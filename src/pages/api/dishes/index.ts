import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // 1. Get all sections ordered by display_order
      const { data: sections, error: sectionsError } = await supabase
        .from("sections")
        .select("id, name, description, display_order, icon")
        .order("display_order", { ascending: true });

      if (sectionsError) {
        console.error("Sections error:", sectionsError);
        return res.status(500).json({ error: "Failed to fetch sections" });
      }

      // 2. Get all section items with dishes
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
            price,
            best_seller
          )
        `
        )
        .order("order_index");

      if (itemsError) {
        console.error("Section items error:", itemsError);
        return res.status(500).json({ error: "Failed to fetch section items" });
      }

      // 3. Transform data
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

              return {
                id: dish.id.toString(),
                name: dish.name,
                description: dish.description,
                ingredients: dish.ingredients,
                imageUrl: dish.image_url,
                price: dish.price,
                bestSeller: dish.best_seller,
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
            icon: section.icon,
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
  } else if (req.method === "POST") {
    try {
      const {
        name,
        description,
        ingredients,
        imageUrl,
        bestSeller,
        price,
        category,
      } = req.body;

      console.log("POST /api/dishes - Request body:", req.body);

      // Validate required fields
      if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      // Get section ID by category name
      const { data: section, error: sectionError } = await supabase
        .from("sections")
        .select("id")
        .eq("name", category)
        .single();

      if (sectionError || !section) {
        console.error("Section error:", sectionError);
        return res.status(400).json({ error: "Invalid category" });
      }

      console.log("Found section:", section);

      // Insert new dish
      const { data: newDish, error: dishError } = await supabase
        .from("dishes")
        .insert({
          name,
          description: description || null,
          ingredients: ingredients || null,
          image_url: imageUrl || null,
          price,
          best_seller: bestSeller || false,
        })
        .select()
        .single();

      if (dishError) {
        console.error("Supabase dish insert error:", dishError);
        return res
          .status(500)
          .json({ error: "Failed to create dish", details: dishError.message });
      }

      console.log("Created dish:", newDish);

      // Get the next order_index for this section
      const { data: maxOrder, error: orderError } = await supabase
        .from("section_items")
        .select("order_index")
        .eq("section_id", section.id)
        .order("order_index", { ascending: false })
        .limit(1)
        .single();

      const nextOrderIndex = maxOrder ? maxOrder.order_index + 1 : 0;

      console.log("Next order index:", nextOrderIndex);

      // Insert section item
      const { error: sectionItemError } = await supabase
        .from("section_items")
        .insert({
          section_id: section.id,
          dish_id: newDish.id,
          order_index: nextOrderIndex,
        });

      if (sectionItemError) {
        console.error("Supabase section item insert error:", sectionItemError);
        return res.status(500).json({
          error: "Failed to create section item",
          details: sectionItemError.message,
        });
      }

      // Transform the response to match the expected format
      const transformedDish = {
        id: newDish.id.toString(),
        name: newDish.name,
        description: newDish.description,
        ingredients: newDish.ingredients,
        imageUrl: newDish.image_url,
        price: newDish.price,
        bestSeller: newDish.best_seller,
      };

      console.log("Transformed dish:", transformedDish);

      res.status(201).json({
        message: "Dish created successfully",
        data: transformedDish,
      });
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({
        error: "Failed to create dish",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
