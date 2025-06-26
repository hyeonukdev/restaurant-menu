import { useState, useEffect, useRef } from "react";
import { TMenuItem } from "@/types/dish";
import { getDishById, getMenuImageUrl } from "@/../database/dishes";

interface UseDishReturn {
  dish: TMenuItem | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 전역 상태 관리 (ID별로 캐싱)
const dishCache: Record<string, TMenuItem> = {};
const loadingStates: Record<string, boolean> = {};
const errorStates: Record<string, string | null> = {};
const fetchPromises: Record<string, Promise<void>> = {};

export const useDish = (id: string, initialData?: TMenuItem): UseDishReturn => {
  const [dish, setDish] = useState<TMenuItem | null>(
    initialData || dishCache[id] || null
  );
  const [loading, setLoading] = useState(
    !initialData && !dishCache[id] && loadingStates[id]
  );
  const [error, setError] = useState<string | null>(errorStates[id]);
  const isMounted = useRef(true);

  const fetchDish = async () => {
    if (!id) return;

    // 이미 캐시에 데이터가 있으면 사용
    if (dishCache[id]) {
      setDish(dishCache[id]);
      setLoading(false);
      return;
    }

    // 이미 요청 중이면 기존 요청 대기
    if (fetchPromises[id]) {
      try {
        await fetchPromises[id];
        if (isMounted.current) {
          setDish(dishCache[id] || null);
          setLoading(false);
          setError(errorStates[id]);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
      return;
    }

    // 새로운 요청 시작
    try {
      loadingStates[id] = true;
      setLoading(true);
      setError(null);

      fetchPromises[id] = (async () => {
        const response = await fetch(`/api/dishes/${id}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Dish not found");
          }
          throw new Error("Failed to fetch dish information");
        }

        const result = await response.json();
        if (result.data && typeof result.data === "object") {
          dishCache[id] = result.data;
          errorStates[id] = null;
        } else {
          throw new Error("Invalid data format received");
        }
      })();

      await fetchPromises[id];

      if (isMounted.current) {
        setDish(dishCache[id] || null);
        setLoading(false);
        setError(errorStates[id]);
      }
    } catch (err) {
      console.error("Failed to fetch dish information:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      errorStates[id] = errorMessage;
      setError(errorMessage);
      // 에러 시 정적 데이터로 fallback
      const fallbackDish = getDishById(id);
      if (fallbackDish) {
        dishCache[id] = fallbackDish;
        setDish(fallbackDish);
      }
    } finally {
      loadingStates[id] = false;
      delete fetchPromises[id];
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    // 캐시 초기화 후 재요청
    delete dishCache[id];
    delete errorStates[id];
    delete fetchPromises[id];
    fetchDish();
  };

  useEffect(() => {
    if (id && !initialData && !dishCache[id]) {
      fetchDish();
    }
  }, [id, initialData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    dish,
    loading,
    error,
    refetch,
  };
};
