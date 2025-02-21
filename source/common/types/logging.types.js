// @flow
import type { CardanoNodeState, CardanoStatus } from './cardano-node.types';
import type { SystemInfo } from '../../renderer/app/types/systemInfoTypes';
import type { CoreSystemInfo } from '../../renderer/app/types/coreSystemInfoTypes';
import type { WalletImportStatus } from '../../renderer/app/types/walletExportTypes';
import type { WalletMigrationStatus } from '../../renderer/app/stores/WalletMigrationStore';
import type {
  GetNetworkParametersApiResponse,
  NetworkInfoResponse,
} from '../../renderer/app/api/network/types';
import type {
  AdaWallet,
  LegacyAdaWallet,
  TransferFundsResponse,
} from '../../renderer/app/api/wallets/types';
import type { Address } from '../../renderer/app/api/addresses/types';
import type { GetTransactionsRequest } from '../../renderer/app/api/transactions/types';
import type { HardwareWalletLocalData } from '../../renderer/app/api/utils/localStorage';
import type { AdaApiStakePool } from '../../renderer/app/api/staking/types';

export type LoggingLevel = 'debug' | 'info' | 'error' | 'warn';

export type Logger = {
  debug: (string, ?Object) => void,
  info: (string, ?Object) => void,
  error: (string, ?Object) => void,
  warn: (string, ?Object) => void,
};

export type FormatMessageContextParams = {
  appName: string,
  electronProcess: string,
  level: string,
  network: string,
};

type Process = {
  exe: string,
  code: string | null,
  signal: string,
  err: string | null,
};

type Currency = {
  code?: string,
  decimalDigits?: number,
  name?: string,
  symbolNative: string,
};

type BodyData = {
  response?: Currency[],
  networkParameters?: GetNetworkParametersApiResponse,
  networkInfo?: ?NetworkInfoResponse,
  transactions?: ?(TransferFundsResponse[]),
  addresses?: ?(Address[]),
  parameters?: ?GetTransactionsRequest,
  wallets?: ?AdaWallet,
  legacyWallets?: ?LegacyAdaWallet,
  hwLocalData?: ?HardwareWalletLocalData,
  stakePools?: ?(AdaApiStakePool[]),
  code?: string,
  state?: CardanoNodeState,
  status?: CardanoStatus,
  name?: string,
  processName?: string,
  wallet?: Process,
  node?: Process,
  command?: string,
  args?: string[],
  shutdownMethod?: string,
  cwd?: string,
  apiPort?: number,
  extraEnv?: ?(string[]),
};

export type ConstructMessageBodyParams = {
  at: string,
  env: string,
  ns?: Array<?string>,
  data?: BodyData,
  app?: Array<?string>,
  msg: string,
  pid: number | string,
  sev: string,
  thread: number | string,
};

export type MessageBody = {
  at: string,
  env: string,
  ns: Array<?string>,
  data: BodyData,
  app: Array<?string>,
  msg: string,
  pid: number | string,
  sev: string,
  thread: number | string,
};

export type ElectronLoggerMessage = {
  date: Date,
  data: LogSystemInfoParams,
  level: string,
};

export type LogSystemInfoParams = {
  cardanoNodeVersion: string,
  cardanoWalletVersion: string,
  cpu: Array<Object>,
  daedalusVersion: string,
  isBlankScreenFixActive: boolean,
  network: string,
  osName: string,
  platformVersion: string,
  ram: string,
  startTime: string,
};

export type StateSnapshotLogParams = {
  systemInfo: SystemInfo,
  coreInfo: CoreSystemInfo,
  cardanoNodeState: CardanoNodeState,
  currentLocale: string,
  isConnected: boolean,
  isDev: boolean,
  isMainnet: boolean,
  isNodeInSync: boolean,
  isNodeResponding: boolean,
  isNodeSyncing: boolean,
  isStaging: boolean,
  isSynced: boolean,
  isTestnet: boolean,
  currentTime: string,
  syncPercentage: string,
  localTip: ?Object,
  networkTip: ?Object,
};

export type ExportedWalletData = {
  id: string,
  name: ?string,
  hasPassword: boolean,
  import?: {
    status: WalletImportStatus,
    error?: string,
  },
};

export type RestoredWalletData = {
  id: string,
  name: string,
  hasPassword: boolean,
};

export type WalletMigrationReportData = {
  exportedWalletsData: Array<ExportedWalletData>,
  exportedWalletsCount: number,
  exportErrors: string,
  restoredWalletsData: Array<RestoredWalletData>,
  restoredWalletsCount: number,
  restorationErrors: Array<{
    error: string,
    wallet: ExportedWalletData,
  }>,
  finalMigrationStatus: WalletMigrationStatus,
};
