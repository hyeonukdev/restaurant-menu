import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Get current dishes
      const { data: dishes, error: dishesError } = await supabase
        .from("dishes")
        .select("id, name")
        .order("id");

      if (dishesError) {
        console.error("Dishes error:", dishesError);
        return res.status(500).json({ error: "Failed to fetch dishes" });
      }

      // Get sequence info
      const { data: sequenceInfo, error: sequenceError } = await supabase
        .rpc("get_sequence_info", { table_name: "dishes" })
        .single();

      res.status(200).json({
        dishes,
        sequenceInfo,
        message: "Debug info retrieved successfully",
      });
    } catch (error) {
      console.error("Debug API error:", error);
      res.status(500).json({ error: "Failed to get debug info" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
