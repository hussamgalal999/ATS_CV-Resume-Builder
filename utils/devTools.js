export const checkDevTools = () => {
    if (process.env.NODE_ENV === 'development') {
        if (typeof window !== 'undefined') {
            // React DevTools check
            if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                console.log('Install React DevTools for better development experience: https://reactjs.org/link/react-devtools');
            }
        }
    }
};