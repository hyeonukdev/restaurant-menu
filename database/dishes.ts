import { TRestaurant, PriceNameType } from "@/types/dish";

//*** Mock data ***
export const dishes: TRestaurant = {
  name: "Aukra",
  description:
    "양재천 최고의 뷰맛집! 수제 오픈샌드위치와 커피, 그리고 와인의 올데이 브런치 카페입니다.",
  address: {
    street: "서울 서초구 양재천로 97",
    city: "서울",
    state: "서울특별시",
    postalCode: "12345",
    country: "대한민국",
  },
  sections: [
    {
      name: "Dishes",
      description: "수제 샌드위치와 바삭한 감자튀김 메뉴입니다.",
      items: [
        {
          id: "1",
          name: "클래식 샌드위치",
          ingredients: "사워도우, 햄, 치즈, 양상추, 토마토, 머스터드, 마요네즈",
          description: "신선한 재료와 직접 구운 빵으로 만든 클래식 샌드위치.",
          prices: [{ name: PriceNameType.STANDARD, price: 8500 }],
          imageUrl: "",
          bestSeller: true,
        },
        {
          id: "2",
          name: "프렌치 프라이",
          ingredients: "감자, 소금, 식용유",
          description: "겉은 바삭하고 속은 부드러운 감자튀김.",
          prices: [{ name: PriceNameType.STANDARD, price: 4500 }],
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
          id: "3",
          name: "아메리카노",
          ingredients: "에스프레소, 물",
          description: "진하고 깔끔한 아메리카노.",
          prices: [
            { name: PriceNameType.TWELVEOZ, price: 3500 },
            { name: PriceNameType.SIXTEENOZ, price: 4000 },
          ],
          imageUrl: "",
          bestSeller: true,
        },
        {
          id: "4",
          name: "카페라떼",
          ingredients: "에스프레소, 우유",
          description: "부드럽고 고소한 카페라떼.",
          prices: [
            { name: PriceNameType.TWELVEOZ, price: 4000 },
            { name: PriceNameType.SIXTEENOZ, price: 4500 },
          ],
          imageUrl: "",
          bestSeller: false,
        },
      ],
    },
    {
      name: "Beer",
      description: "시원하게 즐기는 다양한 수제 맥주.",
      items: [
        {
          id: "5",
          name: "크래프트 맥주",
          ingredients: "보리, 홉, 효모, 물",
          description: "로컬 브루어리에서 만든 신선한 수제 맥주.",
          prices: [{ name: PriceNameType.STANDARD, price: 6000 }],
          imageUrl: "",
          bestSeller: false,
        },
      ],
    },
    {
      name: "Wine",
      description: "엄선된 하우스 와인과 다양한 와인 리스트.",
      items: [
        {
          id: "6",
          name: "하우스 와인(레드/화이트)",
          ingredients: "포도",
          description: "가볍게 즐기기 좋은 하우스 와인.",
          prices: [{ name: PriceNameType.STANDARD, price: 7000 }],
          imageUrl: "",
          bestSeller: false,
        },
      ],
    },
    {
      name: "Desserts",
      description: "식사를 마무리하는 달콤한 디저트.",
      items: [
        {
          id: "7",
          name: "티라미수",
          ingredients:
            "마스카포네, 에스프레소, 레이디핑거, 코코아파우더, 설탕, 계란",
          description: "진한 커피향과 부드러운 식감의 이탈리안 디저트.",
          prices: [{ name: PriceNameType.STANDARD, price: 5500 }],
          imageUrl: "",
          bestSeller: true,
        },
      ],
    },
  ],
};
