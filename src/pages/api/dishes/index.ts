import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // 1. Get all sections
      const { data: sections, error: sectionsError } = await supabase
        .from("sections")
        .select("id, name, description")
        .order("id");

      if (sectionsError) {
        console.error("Sections error:", sectionsError);
        return res.status(500).json({ error: "Failed to fetch sections" });
      }

      // 2. Get all section items with dishes and prices
      const { data: sectionItems, error: itemsError } = await supabase
        .from("section_items")
        .select(
          `
          section_id,
          order_index,
          dish_id,
          dishes (
            id,
            name,
            description,
            ingredients,
            image_url,
            best_seller
          )
        `
        )
        .order("order_index");

      if (itemsError) {
        console.error("Section items error:", itemsError);
        return res.status(500).json({ error: "Failed to fetch section items" });
      }

      // 3. Get all prices
      const { data: prices, error: pricesError } = await supabase
        .from("prices")
        .select("dish_id, name, price");

      if (pricesError) {
        console.error("Prices error:", pricesError);
        return res.status(500).json({ error: "Failed to fetch prices" });
      }

      // 4. Transform data
      const transformedData =
        sections?.map((section) => {
          // Get items for this section
          const sectionItemsForSection =
            sectionItems?.filter((item) => item.section_id === section.id) ||
            [];

          const items = sectionItemsForSection
            .map((item: any) => {
              const dish = item.dishes;
              if (!dish) return null;

              // Get prices for this dish
              const dishPrices =
                prices?.filter((price) => price.dish_id === dish.id) || [];

              return {
                id: dish.id.toString(),
                name: dish.name,
                description: dish.description,
                ingredients: dish.ingredients,
                imageUrl: dish.image_url,
                bestSeller: dish.best_seller,
                prices: dishPrices.map((price) => ({
                  name: price.name,
                  price: price.price,
                })),
              };
            })
            .filter(Boolean)
            .sort((a: any, b: any) => {
              const aOrder =
                sectionItemsForSection.find(
                  (item: any) => item.dishes?.id.toString() === a.id
                )?.order_index || 0;
              const bOrder =
                sectionItemsForSection.find(
                  (item: any) => item.dishes?.id.toString() === b.id
                )?.order_index || 0;
              return aOrder - bOrder;
            });

          return {
            name: section.name,
            description: section.description,
            items,
          };
        }) || [];

      res.status(200).json({
        message: "Dishes retrieved successfully",
        data: transformedData,
      });
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to fetch dishes" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
