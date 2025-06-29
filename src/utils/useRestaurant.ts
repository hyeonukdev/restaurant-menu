import { useState, useEffect, useCallback, useRef } from "react";

interface RestaurantData {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
    instagram: string;
  };
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  mobileBusinessHours: string;
  intro: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  images: {
    homeLayoutImage: string;
    ogImage: string;
  };
}

interface UseRestaurantReturn {
  restaurant: RestaurantData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// 전역 상태 관리 (애플리케이션 전체에서 한 번만 요청)
let globalData: RestaurantData | null = null;
let globalLoading = false;
let globalError: string | null = null;
let globalPromise: Promise<RestaurantData> | null = null;
let hasEverFetched = false;

// 상태 변경 리스너들
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const fetchData = async (): Promise<RestaurantData> => {
  if (globalPromise) {
    console.log("기존 요청 대기 중...");
    return await globalPromise;
  }

  if (hasEverFetched && globalData) {
    console.log("이미 데이터가 있음, 캐시된 데이터 반환");
    return globalData;
  }

  console.log("새로운 API 요청 시작");
  globalLoading = true;
  globalError = null;
  notifyListeners();

  globalPromise = (async (): Promise<RestaurantData> => {
    try {
      const timestamp = Date.now();
      console.log(`API 요청: /api/restaurant?t=${timestamp}`);

      const response = await fetch(`/api/restaurant?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data) {
        console.log("API 요청 성공");
        globalData = result.data;
        globalError = null;
        hasEverFetched = true;
        return result.data;
      } else {
        throw new Error(result.message || "데이터를 불러올 수 없습니다.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      console.error("API 요청 오류:", errorMessage);
      globalError = errorMessage;
      globalData = null;
      throw err;
    } finally {
      globalLoading = false;
      globalPromise = null;
      notifyListeners();
    }
  })();

  return await globalPromise;
};

export const useRestaurant = (): UseRestaurantReturn => {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(
    globalData
  );
  const [loading, setLoading] = useState<boolean>(!hasEverFetched);
  const [error, setError] = useState<string | null>(globalError);

  const hasInitialized = useRef<boolean>(false);

  // 전역 상태 변경 리스너
  useEffect(() => {
    const updateState = () => {
      setRestaurant(globalData);
      setLoading(globalLoading);
      setError(globalError);
    };

    listeners.add(updateState);

    return () => {
      listeners.delete(updateState);
    };
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (hasInitialized.current) {
      console.log("이미 초기화됨, 중복 요청 방지");
      return;
    }

    if (hasEverFetched && globalData) {
      console.log("전역 데이터 존재, API 요청 스킵");
      setRestaurant(globalData);
      setLoading(false);
      setError(null);
      return;
    }

    hasInitialized.current = true;
    console.log("초기 데이터 로드 시작");

    fetchData().catch((err) => {
      console.error("초기 데이터 로드 실패:", err);
    });
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    console.log("수동 새로고침 시작");

    // 전역 상태 초기화
    globalData = null;
    globalError = null;
    hasEverFetched = false;
    globalPromise = null;

    setLoading(true);
    setError(null);

    try {
      await fetchData();
    } catch (err) {
      console.error("수동 새로고침 실패:", err);
    }
  }, []);

  return {
    restaurant,
    loading,
    error,
    refetch,
  };
};
