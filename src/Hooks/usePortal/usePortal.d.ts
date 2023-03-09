import type { ReactNode, ReactPortal } from 'react';
declare const useProtal: (el: Element) => ({ children }: {
    children: ReactNode | null;
}) => ReactPortal | null;
export default useProtal;
