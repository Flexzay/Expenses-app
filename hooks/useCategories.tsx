import { useQuery } from "@tanstack/react-query";
import { getCategoriesService } from "@/services/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesService,
    staleTime: 0,
    retry: 1,
  });
}