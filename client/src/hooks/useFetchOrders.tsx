import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/orders";
import { useMemo } from "react";

const useFetchOrders = (search: string, status: string, sortBy?: string, lineItemFilter?: string) => {
  const [sortByValue, sortOrderValue] = useMemo(() => {
    if (!sortBy) return [];
    const [sortByValue, sortOrderValue] = sortBy.split('_');
    return [sortByValue, sortOrderValue];
  }, [sortBy]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orders", search, status, sortByValue, sortOrderValue, lineItemFilter],
    queryFn: () => getOrders({ 
      search, 
      status, 
      sortBy: sortByValue, 
      sortOrder: sortOrderValue as "asc" | "desc",
      lineItem: lineItemFilter
    }),
  });

  return { data, isLoading, error, refetch };
};

export default useFetchOrders; 