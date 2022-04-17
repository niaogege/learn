import { useEffect, useCallback, useState } from 'react';
import type { ReactNode, ReactPortal } from 'react';
import { createPortal, unmountComponentAtNode } from 'react-dom';

interface UsePortal {
    render: ({ children }: { children: ReactNode | null }) => ReactPortal | null;
    remove: () => null | boolean;
}
const useProtal = (el: Element) => {
    if (!el) {
        return () => null;
    }
    const [portal, setPortal] = useState<UsePortal>({
        render: () => null,
        remove: () => null,
    });

    const CreatePortal = useCallback((el: Element) => {
        const Portal = ({ children }: any) => createPortal(children, el);
        const remove = () => unmountComponentAtNode(el);
        return {
            render: Portal,
            remove,
        };
    }, []);

    useEffect(() => {
        if (el && portal) {
            portal.remove();
        }
        const newPortal = el && CreatePortal(el);
        //@ts-ignore
        setPortal(newPortal);
        return () => {
            el && newPortal.remove();
            el.parentNode && el.parentNode.removeChild(el);
        };
    }, [el]);
    return portal && portal.render;
};
export default useProtal;
