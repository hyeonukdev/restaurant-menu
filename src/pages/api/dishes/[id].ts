import { getDishById, getMenuImageUrl, updateDish } from "@/../database/dishes";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    console.log("API: Fetching dish with ID:", id);

    if (!id || typeof id !== "string") {
      console.log("API: Invalid dish ID");
      return res.status(400).json({
        message: "Invalid dish ID",
        data: null,
      });
    }

    const dish = getDishById(id);

    if (!dish) {
      console.log("API: Dish not found for ID:", id);
      return res.status(404).json({
        message: "Dish not found",
        data: null,
      });
    }

    console.log("API: Found dish:", dish.name);

    // 캐싱 헤더 설정
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300"); // 5분 캐시
    res.setHeader("ETag", `"dish-${id}-${Date.now()}"`); // ETag 추가

    const responseData = {
      ...dish,
      imageUrl: getMenuImageUrl(dish.id),
    };

    console.log("API: Sending response:", responseData);

    res.status(200).json({
      message: "Dish information retrieved successfully",
      data: responseData,
    });
  } else if (req.method === "PUT") {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid dish ID",
      });
    }

    try {
      const updatedDish = req.body;

      if (!updatedDish) {
        return res.status(400).json({
          success: false,
          message: "Request body is required",
        });
      }

      // 필수 필드 검증
      const requiredFields = [
        "name",
        "ingredients",
        "description",
        "prices",
        "bestSeller",
      ];
      for (const field of requiredFields) {
        if (!(field in updatedDish)) {
          return res.status(400).json({
            success: false,
            message: `Missing required field: ${field}`,
          });
        }
      }

      // 메뉴 업데이트
      const result = updateDish(id, updatedDish);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Dish not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Dish updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error updating dish:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
