export type TMenuItem = {
  id: string;
  name: string;
  ingredients?: string;
  description?: string;
  price: number;
  imageUrl: string;
  bestSeller: boolean;
};

export type TMenuSection = {
  name: string;
  description: string;
  items: TMenuItem[];
};
