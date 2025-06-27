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
        .select(
          "id, name, description, ingredients, image_url, price, best_seller"
        )
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

      // Transform data to match the expected format
      const transformedDish = {
        id: dish.id.toString(),
        name: dish.name,
        description: dish.description,
        ingredients: dish.ingredients,
        imageUrl: dish.image_url,
        price: dish.price,
        bestSeller: dish.best_seller,
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
      const { name, description, ingredients, imageUrl, bestSeller, price } =
        req.body;

      // Update dish
      const { data: updatedDish, error: dishError } = await supabase
        .from("dishes")
        .update({
          name,
          description,
          ingredients,
          image_url: imageUrl,
          price,
          best_seller: bestSeller,
        })
        .eq("id", id)
        .select()
        .single();

      if (dishError) {
        console.error("Supabase dish update error:", dishError);
        return res.status(500).json({ error: "Failed to update dish" });
      }

      res.status(200).json({
        message: "Dish updated successfully",
        data: updatedDish,
      });
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to update dish" });
    }
  } else if (req.method === "DELETE") {
    try {
      // 먼저 dish의 image_url을 확인
      const { data: dish, error: dishError } = await supabase
        .from("dishes")
        .select("image_url")
        .eq("id", id)
        .single();

      if (dishError) {
        console.error("Supabase dish fetch error:", dishError);
        return res.status(404).json({ error: "Dish not found" });
      }

      // section_items에서 먼저 삭제 (외래키 제약조건)
      const { error: sectionItemError } = await supabase
        .from("section_items")
        .delete()
        .eq("dish_id", id);

      if (sectionItemError) {
        console.error("Supabase section item delete error:", sectionItemError);
        return res.status(500).json({ error: "Failed to delete section item" });
      }

      // dish 삭제
      const { error: deleteError } = await supabase
        .from("dishes")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Supabase dish delete error:", deleteError);
        return res.status(500).json({ error: "Failed to delete dish" });
      }

      // 이미지가 Supabase Storage에 있다면 삭제
      if (dish.image_url && dish.image_url.includes("supabase.co")) {
        try {
          // URL에서 파일 경로 추출
          const urlParts = dish.image_url.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `menu-images/${fileName}`;

          const { error: storageError } = await supabase.storage
            .from("menu-images")
            .remove([filePath]);

          if (storageError) {
            console.error("Storage delete error:", storageError);
            // 이미지 삭제 실패는 치명적이지 않으므로 로그만 남김
          }
        } catch (storageError) {
          console.error("Storage delete error:", storageError);
        }
      }

      res.status(200).json({
        message: "Dish deleted successfully",
      });
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to delete dish" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
