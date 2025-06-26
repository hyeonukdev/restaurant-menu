import { useState, useEffect, useRef } from "react";
import { TMenuItem } from "@/types/dish";
import { getDishById, getMenuImageUrl } from "@/../database/dishes";

interface UseDishReturn {
  dish: TMenuItem | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 전역 캐시
const dishCache = new Map<string, TMenuItem>();

// 캐시 비우기 함수
export const clearDishCache = () => {
  console.log("useDish: Clearing dish cache");
  dishCache.clear();
};

export const useDish = (
  id: string | undefined,
  initialData?: TMenuItem
): UseDishReturn => {
  const [dish, setDish] = useState<TMenuItem | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentIdRef = useRef<string | undefined>(id);

  const fetchDish = async () => {
    console.log("useDish: fetchDish called with id:", id);

    if (!id) {
      console.log("useDish: No id provided, setting loading to false");
      setLoading(false);
      return;
    }

    // 캐시된 데이터가 있으면 먼저 사용
    if (dishCache.has(id)) {
      const cachedDish = dishCache.get(id)!;
      console.log("useDish: Using cached data for ID:", id);
      setDish(cachedDish);
      setLoading(false);
      setError(null);
      return;
    }

    console.log("useDish: No cached data, fetching from API for ID:", id);

    // 이전 요청이 있다면 취소
    if (abortControllerRef.current) {
      console.log("useDish: Aborting previous request");
      abortControllerRef.current.abort();
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      console.log("useDish: Fetching dish with ID:", id);

      const response = await fetch(`/api/dishes/${id}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("메뉴를 찾을 수 없습니다");
        }
        throw new Error("메뉴 정보를 가져오는데 실패했습니다");
      }

      const result = await response.json();
      console.log("useDish: API response:", result);

      if (result.data && typeof result.data === "object") {
        console.log("useDish: Setting dish data:", result.data);

        // 요청이 취소되지 않았다면 상태 업데이트
        if (!abortControllerRef.current.signal.aborted) {
          // 캐시에 저장
          dishCache.set(id, result.data);

          setDish(result.data);
          setLoading(false);
          setError(null);
          console.log("useDish: Dish state updated successfully", {
            dishId: result.data.id,
            dishName: result.data.name,
            loading: false,
            error: null,
          });
        } else {
          console.log("useDish: Request was aborted, ignoring response");
        }
      } else {
        throw new Error("잘못된 데이터 형식입니다");
      }
    } catch (err) {
      // AbortError는 무시
      if (err instanceof Error && err.name === "AbortError") {
        console.log("useDish: Request was aborted");
        return;
      }

      console.error("useDish: Failed to fetch dish information:", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";

      // 요청이 취소되지 않았다면 에러 상태 설정
      if (!abortControllerRef.current.signal.aborted) {
        setError(errorMessage);
        setLoading(false);

        // 에러 시 정적 데이터로 fallback
        const fallbackDish = getDishById(id);
        if (fallbackDish) {
          console.log("useDish: Using fallback data for ID:", id);
          setDish(fallbackDish);
          // fallback 데이터도 캐시에 저장
          dishCache.set(id, fallbackDish);
        }
      }
    }
  };

  const refetch = () => {
    console.log("useDish: Refetching dish with ID:", id);
    // 캐시에서 제거하고 다시 fetch
    if (id) {
      dishCache.delete(id);
    }
    fetchDish();
  };

  // id가 변경되었는지 확인
  useEffect(() => {
    console.log(
      "useDish: useEffect triggered, id:",
      id,
      "currentIdRef:",
      currentIdRef.current
    );

    if (id) {
      // id가 변경되었으면 캐시를 비우고 새로운 데이터 가져오기
      if (currentIdRef.current !== id) {
        console.log(
          "useDish: ID changed from",
          currentIdRef.current,
          "to",
          id,
          "- clearing cache"
        );
        dishCache.clear();
        currentIdRef.current = id;
      }
      fetchDish();
    } else {
      setLoading(false);
    }
  }, [id]); // id를 의존성 배열에 다시 추가

  useEffect(() => {
    // 컴포넌트 언마운트 시 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    dish,
    loading,
    error,
    refetch,
  };
};
