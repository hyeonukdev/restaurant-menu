import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      // Get dish by ID
      const { data: dish, error: dishError } = await supabase
        .from("dishes")
        .select("id, name, description, ingredients, image_url, best_seller")
        .eq("id", id)
        .single();

      if (dishError) {
        console.error("Supabase dish error:", dishError);
        if (dishError.code === "PGRST116") {
          return res.status(404).json({ error: "Dish not found" });
        }
        return res.status(500).json({ error: "Failed to fetch dish" });
      }

      if (!dish) {
        return res.status(404).json({ error: "Dish not found" });
      }

      // Get prices for this dish
      const { data: prices, error: pricesError } = await supabase
        .from("prices")
        .select("id, name, price")
        .eq("dish_id", id);

      if (pricesError) {
        console.error("Supabase prices error:", pricesError);
        return res.status(500).json({ error: "Failed to fetch prices" });
      }

      // Transform data to match the expected format
      const transformedDish = {
        id: dish.id.toString(),
        name: dish.name,
        description: dish.description,
        ingredients: dish.ingredients,
        imageUrl: dish.image_url,
        bestSeller: dish.best_seller,
        prices:
          prices?.map((price: any) => ({
            name: price.name,
            price: price.price,
          })) || [],
      };

      res.status(200).json({
        message: "Dish information retrieved successfully",
        data: transformedDish,
      });
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to fetch dish" });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, description, ingredients, imageUrl, bestSeller, prices } =
        req.body;

      // Update dish
      const { data: updatedDish, error: dishError } = await supabase
        .from("dishes")
        .update({
          name,
          description,
          ingredients,
          image_url: imageUrl,
          best_seller: bestSeller,
        })
        .eq("id", id)
        .select()
        .single();

      if (dishError) {
        console.error("Supabase dish update error:", dishError);
        return res.status(500).json({ error: "Failed to update dish" });
      }

      // Update prices if provided
      if (prices && Array.isArray(prices)) {
        // Delete existing prices
        await supabase.from("prices").delete().eq("dish_id", id);

        // Insert new prices
        if (prices.length > 0) {
          const { error: pricesError } = await supabase.from("prices").insert(
            prices.map((price: any) => ({
              dish_id: id,
              name: price.name,
              price: price.price,
            }))
          );

          if (pricesError) {
            console.error("Supabase prices update error:", pricesError);
            return res.status(500).json({ error: "Failed to update prices" });
          }
        }
      }

      res.status(200).json({
        message: "Dish updated successfully",
        data: updatedDish,
      });
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to update dish" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
