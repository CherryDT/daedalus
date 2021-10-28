// @flow
import { BrowserWindow } from 'electron';
import checkDiskSpace from 'check-disk-space';
import prettysize from 'prettysize';
import { getDiskSpaceStatusChannel } from '../ipc/get-disk-space-status';
import { logger } from './logging';
import {
  DISK_SPACE_REQUIRED,
  DISK_SPACE_REQUIRED_MARGIN_PERCENTAGE,
  DISK_SPACE_CHECK_LONG_INTERVAL,
  DISK_SPACE_CHECK_MEDIUM_INTERVAL,
  DISK_SPACE_CHECK_SHORT_INTERVAL,
  DISK_SPACE_RECOMMENDED_PERCENTAGE,
  stateDirectoryPath,
} from '../config';
import { CardanoNodeStates } from '../../common/types/cardano-node.types';
import { CardanoNode } from '../cardano/CardanoNode';
import type { CheckDiskSpaceResponse } from '../../common/types/no-disk-space.types';

export const handleCheckDiskSpace = async (
  response: CheckDiskSpaceResponse,
  cardanoNode: CardanoNode,
  mainWindow: BrowserWindow,
  forceDiskSpaceRequired?: number
): Promise<CheckDiskSpaceResponse> => {
  const diskSpaceRequired = forceDiskSpaceRequired || DISK_SPACE_REQUIRED;
  const {
    free: diskSpaceAvailable,
    size: diskTotalSpace,
  } = await checkDiskSpace(stateDirectoryPath);
  const diskSpaceMissing = Math.max(diskSpaceRequired - diskSpaceAvailable, 0);
  const diskSpaceRecommended =
    (diskTotalSpace * DISK_SPACE_RECOMMENDED_PERCENTAGE) / 100;
  const diskSpaceRequiredMargin =
    diskSpaceRequired -
    (diskSpaceRequired * DISK_SPACE_REQUIRED_MARGIN_PERCENTAGE) / 100;

  response.diskSpaceRequired = prettysize(diskSpaceRequired);

  if (diskSpaceAvailable <= diskSpaceRequiredMargin) {
    if (!response.isNotEnoughDiskSpace) {
      // State change: transitioning from enough to not-enough disk space
      response.interval = DISK_SPACE_CHECK_SHORT_INTERVAL;
      response.isNotEnoughDiskSpace = true;
    }
  } else if (diskSpaceAvailable >= diskSpaceRequired) {
    const newDiskSpaceCheckIntervalLength =
      diskSpaceAvailable >= diskSpaceRequired * 2
        ? DISK_SPACE_CHECK_LONG_INTERVAL
        : DISK_SPACE_CHECK_MEDIUM_INTERVAL;
    if (response.isNotEnoughDiskSpace) {
      // State change: transitioning from not-enough to enough disk space
      response.interval = newDiskSpaceCheckIntervalLength;
      response.isNotEnoughDiskSpace = false;
    } else if (newDiskSpaceCheckIntervalLength !== response.interval) {
      // Interval change: transitioning from medium to long interval (or vice versa)
      // This is a special case in which we adjust the disk space check polling interval:
      // - more than 2x of available space than required: LONG interval
      // - less than 2x of available space than required: MEDIUM interval
      response.interval = newDiskSpaceCheckIntervalLength;
    }
  }

  if (response.isNotEnoughDiskSpace) {
    response.hadNotEnoughSpaceLeft = true;
    logger.info('Not enough disk space', { response });
    if (
      cardanoNode.state !== CardanoNodeStates.STOPPING &&
      cardanoNode.state !== CardanoNodeStates.STOPPED
    ) {
      try {
        logger.info('[DISK-SPACE-DEBUG] Stopping cardano node');
        await cardanoNode.stop();
      } catch (error) {
        logger.error('[DISK-SPACE-DEBUG] Cannot stop cardano node', error);
      }
    }
  } else {
    if (
      // Happens after the user made more disk space
      cardanoNode.state === CardanoNodeStates.STOPPED &&
      cardanoNode.state !== CardanoNodeStates.STOPPING &&
      response.hadNotEnoughSpaceLeft
    ) {
      try {
        logger.info(
          '[DISK-SPACE-DEBUG] restart cardano node after freeing up disk space'
        );
        if (cardanoNode._startupTries > 0) await cardanoNode.restart();
        else await cardanoNode.start();
      } catch (error) {
        logger.error(
          '[DISK-SPACE-DEBUG] Daedalus tried to restart, but failed',
          error
        );
      }
    }
    response.hadNotEnoughSpaceLeft = false;
  }
  await getDiskSpaceStatusChannel.send(
    {
      ...response,
      diskSpaceMissing: prettysize(diskSpaceMissing),
      diskSpaceRecommended: prettysize(diskSpaceRecommended),
      diskSpaceAvailable: prettysize(diskSpaceAvailable),
    },
    mainWindow.webContents
  );
  return response;
};
