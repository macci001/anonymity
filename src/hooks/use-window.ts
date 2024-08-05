import { useEffect, useState } from "react";

export const useWindow = () => {
    const [mounted, isMounted] = useState(false);
    useEffect(() => {
        isMounted(true);
    }, []);
    if(!mounted) {
        return null;
    }
    return window;
}   