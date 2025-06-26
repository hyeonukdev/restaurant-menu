import { useState, useEffect, useRef } from "react";
import { TRestaurantInfo } from "@/../database/restaurant";
import { restaurantInfo } from "@/../database/restaurant";

interface UseRestaurantReturn {
  restaurant: TRestaurantInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 전역 상태 관리
let globalRestaurant: TRestaurantInfo | null = null;
let globalLoading = false;
let globalError: string | null = null;
let fetchPromise: Promise<void> | null = null;

export const useRestaurant = (
  initialData?: TRestaurantInfo
): UseRestaurantReturn => {
  const [restaurant, setRestaurant] = useState<TRestaurantInfo | null>(
    initialData || globalRestaurant
  );
  const [loading, setLoading] = useState(
    !initialData && !globalRestaurant && globalLoading
  );
  const [error, setError] = useState<string | null>(globalError);
  const isMounted = useRef(true);

  const fetchRestaurant = async () => {
    // 이미 전역 상태에 데이터가 있으면 사용
    if (globalRestaurant) {
      setRestaurant(globalRestaurant);
      setLoading(false);
      return;
    }

    // 이미 요청 중이면 기존 요청 대기
    if (fetchPromise) {
      try {
        await fetchPromise;
        if (isMounted.current) {
          setRestaurant(globalRestaurant);
          setLoading(false);
          setError(globalError);
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
      globalLoading = true;
      setLoading(true);
      setError(null);

      fetchPromise = (async () => {
        const response = await fetch("/api/restaurant", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant information");
        }

        const result = await response.json();
        if (result.data && typeof result.data === "object") {
          globalRestaurant = result.data;
          globalError = null;
        } else {
          throw new Error("Invalid data format received");
        }
      })();

      await fetchPromise;

      if (isMounted.current) {
        setRestaurant(globalRestaurant);
        setLoading(false);
        setError(globalError);
      }
    } catch (err) {
      console.error("Failed to fetch restaurant information:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      globalError = errorMessage;
      setError(errorMessage);
      // 에러 시 정적 데이터로 fallback
      globalRestaurant = restaurantInfo;
      setRestaurant(restaurantInfo);
    } finally {
      globalLoading = false;
      fetchPromise = null;
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    // 전역 상태 초기화 후 재요청
    globalRestaurant = null;
    globalError = null;
    fetchPromise = null;
    fetchRestaurant();
  };

  useEffect(() => {
    if (!initialData && !globalRestaurant) {
      fetchRestaurant();
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    restaurant,
    loading,
    error,
    refetch,
  };
};
