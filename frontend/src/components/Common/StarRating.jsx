const StarRating = ({ rating, outOf = 5 }) => {
  const filledStars = Math.round(rating);
  return (
    <div className="flex">
      {[...Array(outOf)].map((_, index) => (
        <span key={index} className="text-yellow-500">
          {index < filledStars ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
