import {
  IconIceCream2,
  IconGlassFull,
  IconMeat,
  IconBeer,
  IconCoffee,
  IconBread,
} from "@tabler/icons-react";

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
