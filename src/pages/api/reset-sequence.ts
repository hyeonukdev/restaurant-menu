import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Get max ID from dishes table
      const { data: maxIdResult, error: maxIdError } = await supabase
        .from("dishes")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (maxIdError && maxIdError.code !== "PGRST116") {
        console.error("Max ID error:", maxIdError);
        return res.status(500).json({ error: "Failed to get max ID" });
      }

      const maxId = maxIdResult ? maxIdResult.id : 0;
      const nextId = maxId + 1;

      // Reset sequence to next ID
      const { error: resetError } = await supabase.rpc("reset_sequence", {
        sequence_name: "dishes_id_seq",
        next_value: nextId,
      });

      if (resetError) {
        console.error("Reset sequence error:", resetError);
        return res.status(500).json({ error: "Failed to reset sequence" });
      }

      res.status(200).json({
        message: "Sequence reset successfully",
        maxId,
        nextId,
      });
    } catch (error) {
      console.error("Reset sequence API error:", error);
      res.status(500).json({ error: "Failed to reset sequence" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
