'use client';

import { LoadingBar } from './LoadingBar';
import { useLoadingState } from '../hooks/useLoadingState';

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const isLoading = useLoadingState();

    return (
        <>
            {isLoading && <LoadingBar />}
            {children}
        </>
    );
} 