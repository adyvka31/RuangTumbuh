import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { getCourseExtras } from "@/constants/courseData";

export const useSearchCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  // 1. Fitur Debouncing (Menunda pencarian 250ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. React Query: Infinite Fetching
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["courses", debouncedSearch, activeCategory],
      queryFn: async ({ pageParam = 1 }) => {
        const queryParams = new URLSearchParams({
          page: pageParam,
          limit: 6,
          search: debouncedSearch,
          category: activeCategory,
        });
        const result = await api.get(`/courses?${queryParams}`);

        return {
          items: result.data,
          nextPage:
            pageParam < result.meta.totalPages ? pageParam + 1 : undefined,
        };
      },
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  // 3. Ekstrak dan format semua kursus
  const allCourses =
    data?.pages.flatMap((page) =>
      page.items.map((item) => {
        const extras = getCourseExtras(item.kategori);
        return {
          id: item.id,
          title: item.name,
          author: item.tutor,
          category: item.kategori,
          duration: item.durasi,
          description: item.deskripsi,
          date: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          rating: 5,
          ...extras,
        };
      }),
    ) || [];

  // 4. Kembalikan semua fungsi dan data yang dibutuhkan UI
  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    allCourses,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
