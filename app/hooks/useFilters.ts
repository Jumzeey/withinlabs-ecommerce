import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

interface FilterState {
  search: string;
  category: string;
  priceRange: {
    min: string;
    max: string;
  };
}

export function useFilters(initialValues: Partial<FilterState>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: initialValues.search || "",
    category: initialValues.category || "All",
    priceRange: {
      min: initialValues.priceRange?.min || "",
      max: initialValues.priceRange?.max || "",
    },
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedMinPrice = useDebounce(filters.priceRange.min, 500);
  const debouncedMaxPrice = useDebounce(filters.priceRange.max, 500);

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "All",
      priceRange: {
        min: searchParams.get("minPrice") || "",
        max: searchParams.get("maxPrice") || "",
      },
    });
  }, [searchParams]);

  // Update URL when any filter changes
  useEffect(() => {
    const updateURLWithDebounce = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());

      if (debouncedSearch) params.set("search", debouncedSearch);
      else params.delete("search");

      if (filters.category !== "All") params.set("category", filters.category);
      else params.delete("category");

      if (debouncedMinPrice) params.set("minPrice", debouncedMinPrice);
      else params.delete("minPrice");

      if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
      else params.delete("maxPrice");

      router.push(`/?${params.toString()}`);
      setIsLoading(false);
    };

    updateURLWithDebounce();
  }, [
    debouncedSearch,
    filters.category,
    debouncedMinPrice,
    debouncedMaxPrice,
    router,
    searchParams,
  ]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updatePriceRange = (key: "min" | "max", value: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [key]: value,
      },
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "All",
      priceRange: {
        min: "",
        max: "",
      },
    });
    router.push("/");
  };

  return {
    filters,
    isLoading,
    updateFilter,
    updatePriceRange,
    clearFilters,
  };
}
