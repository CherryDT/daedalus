// @flow
import LocalStorageApi from '../../../api/utils/localStorage';
import { STORAGE_KEYS as storageKeys } from '../../../../../common/config/electron-store.config';

export class DiscreetModeApi {
  getDiscreetModeSettings = (): Promise<boolean> =>
    LocalStorageApi.get(storageKeys.DISCREET_MODE_ENABLED, false);

  setDiscreetModeSettings = (enabled: boolean): Promise<void> =>
    LocalStorageApi.set(storageKeys.DISCREET_MODE_ENABLED, enabled);

  unsetDiscreetModeSettings = (): Promise<void> =>
    LocalStorageApi.unset(storageKeys.DISCREET_MODE_ENABLED);

  getDiscreetModeSettingsTooltip = (): Promise<boolean> =>
    LocalStorageApi.get(storageKeys.DISCREET_MODE_SETTINGS_TOOLTIP, true);

  setDiscreetModeSettingsTooltip = (enabled: boolean): Promise<void> =>
    LocalStorageApi.set(storageKeys.DISCREET_MODE_SETTINGS_TOOLTIP, enabled);

  unsetDiscreetModeSettingsTooltip = (): Promise<void> =>
    LocalStorageApi.unset(storageKeys.DISCREET_MODE_SETTINGS_TOOLTIP);

  getDiscreetModeNotification = (): Promise<boolean> =>
    LocalStorageApi.get(storageKeys.DISCREET_MODE_NOTIFICATION, true);

  setDiscreetModeNotification = (enabled: boolean): Promise<void> =>
    LocalStorageApi.set(storageKeys.DISCREET_MODE_NOTIFICATION, enabled);

  unsetDiscreetModeNotification = (): Promise<void> =>
    LocalStorageApi.unset(storageKeys.DISCREET_MODE_NOTIFICATION);
}
