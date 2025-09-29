export const MAX_LOAD = import.meta.env.PROD ? 3600 * 1000 * 24 : 3600 * 1000 * 24 * 7

export const TEST_DIF = import.meta.env.PROD ? 0 : -3600 * 1000 * 24 * 7
