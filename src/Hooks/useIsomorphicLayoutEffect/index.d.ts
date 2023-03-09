import { useEffect } from 'react';
export declare const canUseDOM: boolean;
export declare const useIsomorphicLayoutEffect: typeof useEffect;
/**
// demo
let contextValue: unknown;
useIsomorphicLayoutEffect(() => {
  const { subscription } = contextValue
  return () => {
    subscription.tryUnsubscribe()
  }
}, [])
 */
