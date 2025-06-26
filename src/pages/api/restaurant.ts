import { restaurantInfo } from "@/../database/restaurant";

export default function handler(req, res) {
  if (req.method === "GET") {
    // 캐싱 헤더 설정
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300"); // 5분 캐시
    res.setHeader("ETag", `"restaurant-${Date.now()}"`); // ETag 추가

    res.status(200).json({
      message: "Restaurant information retrieved successfully",
      data: restaurantInfo,
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
