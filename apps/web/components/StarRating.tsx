interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const sz = size === "sm" ? "text-xs" : "text-sm";
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const half = !filled && i < rating;
    return { filled, half };
  });
  return (
    <span className={`inline-flex items-center gap-0.5 ${sz}`}>
      {stars.map((s, i) => (
        <span key={i} className={s.filled ? "text-amber-400" : s.half ? "text-amber-300" : "text-gray-200"}>
          ★
        </span>
      ))}
    </span>
  );
}
