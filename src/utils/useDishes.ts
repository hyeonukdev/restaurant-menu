import { useState, useEffect, useRef, useCallback } from "react";
import { TMenuSection } from "@/types/dish";
import { menuSections } from "@/../database/dishes";

interface UseDishesReturn {
  dishes: TMenuSection[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDishes = (initialData?: TMenuSection[]): UseDishesReturn => {
  const [dishes, setDishes] = useState<TMenuSection[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const fetchPromiseRef = useRef<Promise<void> | null>(null);

  const fetchDishes = useCallback(async () => {
    // 이미 요청 중이면 기존 요청 대기
    if (fetchPromiseRef.current) {
      try {
        await fetchPromiseRef.current;
      } catch (err) {
        console.error("Previous request failed:", err);
      }
      return;
    }

    // 새로운 요청 시작
    try {
      setLoading(true);
      setError(null);

      fetchPromiseRef.current = (async () => {
        const response = await fetch("/api/dishes", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dishes");
        }

        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
          setDishes(result.data);
          setLoading(false);
          setError(null);
        } else {
          throw new Error("Invalid data format received");
        }
      })();

      await fetchPromiseRef.current;
    } catch (err) {
      console.error("Failed to fetch dishes:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      setError(errorMessage);
      // 에러 시 정적 데이터로 fallback
      setDishes(menuSections.sections);
      setLoading(false);
    } finally {
      fetchPromiseRef.current = null;
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchPromiseRef.current = null;
    fetchDishes();
  }, [fetchDishes]);

  useEffect(() => {
    if (!initialData) {
      fetchDishes();
    }
  }, [fetchDishes, initialData]);

  return {
    dishes,
    loading,
    error,
    refetch,
  };
};
