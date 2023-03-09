import { useEffect, useCallback, useState } from 'react';
import { createPortal, unmountComponentAtNode } from 'react-dom';
const useProtal = (el) => {
    if (!el) {
        return () => null;
    }
    const [portal, setPortal] = useState({
        render: () => null,
        remove: () => null,
    });
    const CreatePortal = useCallback((el) => {
        const Portal = ({ children }) => createPortal(children, el);
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
