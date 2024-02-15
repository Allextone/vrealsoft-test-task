export const oneDay: number = 60 * 60 * 24 * 1000; // ms
export const oneHour: number = 60 * 60 * 1000; // ms
export const oneYear: number = 60 * 60 * 24 * 365 * 1000; // ms
export const timestamp: number = new Date().getTime(); // ms
export const userDepositDate: number = oneDay * 300; // ms

export const timeOfLiveDepositAddress: number = 60 * 20 * 1000; // ms
export const amountOfDepositDays = 300; // days

export const assetsCurrency: string[] = ['BTC', 'ETH', 'TRX', 'USDT', 'BNB'];

export const getDefaultFeePercent = () =>
  Number(process.env.DEFAULT_FEE_PERCENT);
