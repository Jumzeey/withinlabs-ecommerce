"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Match this with the LoadingBar animation duration

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return isLoading;
}
