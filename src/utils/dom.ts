/** 是否是浏览器 */
export const isBrowser = !!(typeof window !== 'undefined' && window);

/**是否支持var(--corlr) */
export const isCssVarSupported =
  isBrowser && window.CSS && window.CSS.supports && window.CSS.supports('--a', '0');
