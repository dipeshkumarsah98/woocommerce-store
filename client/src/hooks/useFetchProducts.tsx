import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/products";
import { useMemo } from "react";

const useFetchProducts = (search: string, sortBy?: string) => {
  const [sortByValue, sortOrderValue] =  useMemo(() => {
    if (!sortBy) return [];
    const [sortByValue, sortOrderValue] = sortBy.split('_');
    return [sortByValue, sortOrderValue];
  }, [sortBy]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", search, sortByValue, sortOrderValue],
    queryFn: () => getProducts({ search, sortBy: sortByValue, sortOrder: sortOrderValue as "asc" | "desc" }),
  });

  return { data, isLoading, error };
};

export default useFetchProducts;