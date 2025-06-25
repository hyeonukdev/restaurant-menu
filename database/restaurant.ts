export interface TRestaurantInfo {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    instagram: string;
  };
  businessHours: {
    weekday: {
      open: string;
      lastOrder: string;
      close: string;
    };
    weekend: {
      open: string;
      lastOrder: string;
      close: string;
    };
  };
  mobileBusinessHours: string;
  intro: {
    id: string;
    title: string;
    content: string;
  }[];
  images: {
    ogImage: string;
    homeLayoutImage: string;
  };
}

export const restaurantInfo: TRestaurantInfo = {
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
  contact: {
    phone: "050-71378-8186",
    instagram: "@aukra.yangjae",
  },
  businessHours: {
    weekday: {
      open: "10:00 am",
      lastOrder: "6:00 pm",
      close: "7:00 pm",
    },
    weekend: {
      open: "10:00 am",
      lastOrder: "9:00 pm",
      close: "10:00 pm",
    },
  },
  mobileBusinessHours: "운영시간: 10:00~19:00(평일), 10:00~22:00(주말)",
  intro: [
    {
      id: "1",
      title: "양재천 최고의 뷰맛집!",
      content: "",
    },
    {
      id: "2",
      title: "",
      content: "낮에는 커피, 저녁에는 한 잔의 여유",
    },
    {
      id: "3",
      title: "",
      content:
        "오크라는 브런치와 커피를 사랑하는 분들을 위한 공간이자,\n북유럽의 여유로운 하루처럼 낮에도 맥주와 와인을 즐길 수 있는\n 복합문화공간으로 확장하고 있습니다.",
    },
    {
      id: "4",
      title: "인기 브런치 메뉴는 그대로!",
      content: "<트러플 머쉬룸 샌드위치> \n <선드라이드 바질 샌드위치>",
    },
    {
      id: "5",
      title: "이젠 한 낮에도 맥주와 와인을 자유롭게",
      content: "<산책 후, 시원한 맥주 한 잔> \n <여유로운 오후, 와인 한 모금>",
    },
    {
      id: "6",
      title: "",
      content:
        "당신의 하루가 머무는 곳, \n 언제 찾아도 편안한 오크라에서\n 커피도 좋고, 술도 좋은 시간을 즐겨보세요.",
    },
    {
      id: "7",
      title: "",
      content: "낮술? 아니죠,\n 낮의 여유입니다.",
    },
    {
      id: "8",
      title: "",
      content: "양재천 옆, 오크라 드림",
    },
  ],
  images: {
    ogImage: "/images/og-image.png",
    homeLayoutImage: "/images/home-layout.png",
  },
};
