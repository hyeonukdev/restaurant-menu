import {
  IconIceCream2,
  IconGlassFull,
  IconMeat,
  IconBeer,
  IconCoffee,
  IconBread,
  IconFish,
  IconSalad,
  IconChefHat,
  IconCake,
  IconPizza,
  IconApple,
  IconCup,
  IconBottle,
  IconCookie,
  IconCarrot,
  IconEgg,
  IconToolsKitchen2,
  IconSoup,
  IconBowl,
} from "@tabler/icons-react";

// 정적 메뉴 옵션 (fallback용)
export const menuOptions = [
  {
    key: "dishes",
    icon: <IconBread size={32} />,
    label: <a href="#dishes">Dishes</a>,
  },
  {
    key: "coffee",
    icon: <IconCoffee size={32} />,
    label: <a href="#coffee">Coffee</a>,
  },
  {
    key: "beer",
    icon: <IconBeer size={32} />,
    label: <a href="#beer">Beer</a>,
  },
  {
    key: "wine",
    icon: <IconGlassFull size={32} />,
    label: <a href="#wine">Wine</a>,
  },
  {
    key: "desserts",
    icon: <IconIceCream2 size={32} />,
    label: <a href="#desserts">Desserts</a>,
  },
];

// 섹션 이름 또는 아이콘 이름에 따른 아이콘 매핑 함수
export const getIconForSection = (nameOrIcon) => {
  const iconMap = {
    // 기본 섹션들 (섹션 이름)
    Dishes: <IconBread size={32} />,
    Coffee: <IconCoffee size={32} />,
    Beer: <IconBeer size={32} />,
    Wine: <IconGlassFull size={32} />,
    Desserts: <IconIceCream2 size={32} />,

    // Tabler 아이콘 이름들
    IconBread: <IconBread size={32} />,
    IconCoffee: <IconCoffee size={32} />,
    IconBeer: <IconBeer size={32} />,
    IconGlassFull: <IconGlassFull size={32} />,
    IconIceCream2: <IconIceCream2 size={32} />,
    IconMeat: <IconMeat size={32} />,
    IconFish: <IconFish size={32} />,
    IconSalad: <IconSalad size={32} />,
    IconChefHat: <IconChefHat size={32} />,
    IconCake: <IconCake size={32} />,
    IconPizza: <IconPizza size={32} />,
    IconApple: <IconApple size={32} />,
    IconCup: <IconCup size={32} />,
    IconBottle: <IconBottle size={32} />,
    IconCookie: <IconCookie size={32} />,
    IconCarrot: <IconCarrot size={32} />,
    IconEgg: <IconEgg size={32} />,
    IconToolsKitchen2: <IconToolsKitchen2 size={32} />,
    IconSoup: <IconSoup size={32} />,
    IconBowl: <IconBowl size={32} />,

    // 추가 가능한 섹션들
    Meat: <IconMeat size={32} />,
    Fish: <IconFish size={32} />,
    Salad: <IconSalad size={32} />,
    Signature: <IconChefHat size={32} />,
    Cake: <IconCake size={32} />,
    Pizza: <IconPizza size={32} />,
    Fruit: <IconApple size={32} />,
    Tea: <IconCup size={32} />,
    Bottle: <IconBottle size={32} />,
    Cookie: <IconCookie size={32} />,
    Vegetable: <IconCarrot size={32} />,
    Egg: <IconEgg size={32} />,
    Special: <IconToolsKitchen2 size={32} />,
    Soup: <IconSoup size={32} />,
    Bowl: <IconBowl size={32} />,
  };

  return iconMap[nameOrIcon] || <IconBread size={32} />;
};
