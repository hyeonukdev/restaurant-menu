import { getDishById, getMenuImageUrl } from "@/../database/dishes";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid dish ID",
        data: null,
      });
    }

    const dish = getDishById(id);

    if (!dish) {
      return res.status(404).json({
        message: "Dish not found",
        data: null,
      });
    }

    // 캐싱 헤더 설정
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300"); // 5분 캐시
    res.setHeader("ETag", `"dish-${id}-${Date.now()}"`); // ETag 추가

    res.status(200).json({
      message: "Dish information retrieved successfully",
      data: {
        ...dish,
        imageUrl: getMenuImageUrl(dish.id),
      },
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
