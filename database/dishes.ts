import { PriceNameType, TMenuItem } from "@/types/dish";

// 메뉴 섹션 데이터만 포함하는 타입
export interface TMenuSections {
  sections: {
    name: string;
    description: string;
    items: TMenuItem[];
  }[];
}

//*** Mock data ***
export const menuSections: TMenuSections = {
  sections: [
    {
      name: "Dishes",
      description: "오크라만의 메뉴를 만나보세요!",
      items: [
        {
          id: "1",
          name: "트러플 머쉬룸 샌드위치",
          ingredients: "트리플 머쉬룸, ...",
          description: "부드러운 감자, 촉촉한 버섯, 트러플 향의 조화!",
          prices: [{ name: PriceNameType.STANDARD, price: 15000 }],
          imageUrl: "",
          bestSeller: true,
        },
        {
          id: "2",
          name: "선드라이드 바질 샌드위치",
          ingredients: "크림치즈, 바질페스토, 토마토 콩피",
          description:
            "크림치즈와 바질페스토, 토마토 콩피가 올라간 바질 샌드위치!",
          prices: [{ name: PriceNameType.STANDARD, price: 14000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "3",
          name: "에그인헬",
          ingredients: "고기, 토마토, 양파, 마늘",
          description:
            "고기와 토마토, 양파와 마늘을 저온숙성 시킨 오크라식 에그인헬(빵과 함께 제공)",
          prices: [{ name: PriceNameType.STANDARD, price: 16000 }],
          imageUrl: "",
          bestSeller: true,
        },
        {
          id: "4",
          name: "치킨난반",
          ingredients: "치킨, 에그샐러드",
          description: "바삭한 가라아게에 에그샐러드와 타르타르 한 스푼!",
          prices: [{ name: PriceNameType.STANDARD, price: 19000 }],
          imageUrl: "",
          bestSeller: true,
        },
        {
          id: "5",
          name: "감자튀김",
          ingredients: "감자",
          description: "겉바속촉 감자튀김!",
          prices: [{ name: PriceNameType.STANDARD, price: 7900 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "6",
          name: "치아바타 추가",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 2000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "7",
          name: "바닐라 아이스크림",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 4000 }],
          imageUrl: "",
          bestSeller: false,
        },
      ],
    },
    {
      name: "Coffee",
      description: "신선하게 내린 커피와 다양한 음료를 즐겨보세요.",
      items: [
        {
          id: "8",
          name: "아메리카노(ice/hot)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 5500 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "9",
          name: "카페라떼(ice/hot)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "10",
          name: "바닐라라떼(ice/hot)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6500 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "11",
          name: "디카페인 콜드부르",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "12",
          name: "디카페인 콜드부르 라떼",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6500 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "13",
          name: "크림커피(ice/hot)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6800 }],
          imageUrl: "",
          bestSeller: true,
        },
        {
          id: "14",
          name: "초코라떼",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "15",
          name: "딸기라떼",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "16",
          name: "아이스크림 라떼",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 6800 }],
          imageUrl: "",
          bestSeller: true,
        },
      ],
    },
    {
      name: "Beer",
      description: "시원하게 즐기는 다양한 맥주를 만나보세요!",
      items: [
        {
          id: "17",
          name: "하이네켄",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 8000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "18",
          name: "코로나",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 8000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "19",
          name: "버드와이저",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 7500 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "20",
          name: "아사히 ",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 7500 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "21",
          name: "콜센동크(PREMIUM)",
          ingredients: "",
          description:
            "벨기에 전통 밀맥주로 맥아 향과 묵직한 바디감이 매력적인 에일 스타일 맥주",
          prices: [{ name: PriceNameType.STANDARD, price: 12000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "22",
          name: "콜센동크 애플화이트(PREMIUM)",
          ingredients: "",
          description:
            "벨기에 전통 밀맥주 + 천연 청사과가 느껴지는 청량감이 좋은 맥주",
          prices: [{ name: PriceNameType.STANDARD, price: 12000 }],
          imageUrl: "",
          bestSeller: false,
        },
      ],
    },
    {
      name: "Wine",
      description: "엄선된 하우스 와인을 만나보세요!",
      items: [
        {
          id: "23",
          name: "까베르네 쇼비뇽(RED)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 10000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "24",
          name: "쇼비뇽 블랑(WHITE)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 10000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "25",
          name: "샤도네이(WHITE)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 10000 }],
          imageUrl: "",
          bestSeller: false,
        },
        {
          id: "26",
          name: "BOTTLE(카운터문의)",
          ingredients: "",
          description: "",
          prices: [{ name: PriceNameType.STANDARD, price: 0 }],
          imageUrl: "",
          bestSeller: false,
        },
      ],
    },
    {
      name: "Desserts",
      description: "식사를 마무리하는 달콤한 디저트.",
      items: [],
    },
  ],
};

// 모든 메뉴 아이템을 평면화된 배열로 변환하는 함수
export const getAllDishes = (): TMenuItem[] => {
  return menuSections.sections.flatMap((section) => section.items);
};

// ID로 특정 메뉴를 찾는 함수
export const getDishById = (id: string): TMenuItem | undefined => {
  return getAllDishes().find((dish) => dish.id === id);
};

// 메뉴 ID에 따라 이미지 경로를 생성하는 함수
export const getMenuImageUrl = (id: string): string => {
  return `/images/menu/menu_${id}.jpeg`;
};

// 메뉴 업데이트 함수
export const updateDish = (
  id: string,
  updatedDish: TMenuItem
): TMenuItem | null => {
  // 모든 섹션을 순회하면서 해당 ID의 메뉴를 찾아 업데이트
  for (
    let sectionIndex = 0;
    sectionIndex < menuSections.sections.length;
    sectionIndex++
  ) {
    const section = menuSections.sections[sectionIndex];
    const dishIndex = section.items.findIndex((dish) => dish.id === id);

    if (dishIndex !== -1) {
      // 기존 메뉴 정보를 유지하면서 업데이트된 정보로 교체
      const originalDish = section.items[dishIndex];
      const updatedDishWithId = {
        ...originalDish,
        ...updatedDish,
        id: originalDish.id, // ID는 변경 불가
      };

      // 메뉴 업데이트
      menuSections.sections[sectionIndex].items[dishIndex] = updatedDishWithId;

      return updatedDishWithId;
    }
  }

  return null; // 해당 ID의 메뉴를 찾지 못한 경우
};
