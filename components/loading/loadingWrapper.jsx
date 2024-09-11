"use client";

import {createContext, Suspense, useContext, useEffect, useState,} from "react";
import {usePathname} from "next/navigation";
import Loading from "./loading";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingWrapper = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    const excludedRoutes = ["/login"];

    useEffect(() => {
        const handleStart = () => {
            if (!excludedRoutes.includes(pathname)) {
                setIsLoading(true);
            }
        };
        const handleComplete = () => setIsLoading(false);

        window.addEventListener("beforeunload", handleStart);
        window.addEventListener("load", handleComplete);

        return () => {
            window.removeEventListener("beforeunload", handleStart);
            window.removeEventListener("load", handleComplete);
        };
    }, [pathname]);

    useEffect(() => {
        if (!excludedRoutes.includes(pathname)) {
            setIsLoading(false);
        }
    }, [pathname]);


    return (
        <LoadingContext.Provider value={{isLoading, setIsLoading}}>
            <Suspense fallback={<Loading/>}>
                {isLoading && <Loading/>}
                {children}
            </Suspense>
        </LoadingContext.Provider>
    );
};