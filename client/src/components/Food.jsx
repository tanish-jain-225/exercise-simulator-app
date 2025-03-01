import React, { useState, useEffect } from "react";

const Food = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // API keys for the Nutrition Data API and Pixabay Images API
  const ninja_data_api_key = import.meta.env.VITE_NINJA_API_KEY;
  const pixabay_images_api_key = import.meta.env.VITE_PIXABAY_API_KEY;

  useEffect(() => {
    const cachedImages = JSON.parse(sessionStorage.getItem("cachedFoodImages") || "{}");
    setImageUrls(cachedImages);
  }, []);

  const saveImagesToCache = (newImages) => {
    const updatedImages = { ...imageUrls, ...newImages };
    setImageUrls(updatedImages);
    sessionStorage.setItem("cachedFoodImages", JSON.stringify(updatedImages));
  };

  const fetchFoodItems = async () => {
    if (!query.trim()) {
      setError("Please enter a food name.");
      setFoodItems([]);
      setCurrentIndex(0);
      return;
    }

    setLoading(true);
    setError(null);
    setFoodItems([]);
    setCurrentIndex(0);

    try {
      const response = await fetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${query}`,
        {
          headers: { "X-Api-Key": ninja_data_api_key },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch food data.");

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setFoodItems(data.items);
        await fetchFoodImages(data.items);
      } else {
        setError("No food items found for your search.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodImages = async (items) => {
    const imagePromises = items.map(async (item) => {
      if (imageUrls[item.name]) return;

      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=${pixabay_images_api_key}&q=edible+food+${item.name}&image_type=photo`
        );
        const data = await response.json();

        return { [item.name]: data.hits?.[0]?.webformatURL || "https://via.placeholder.com/200x150" };
      } catch {
        return { [item.name]: "https://via.placeholder.com/200x150" };
      }
    });

    const imageResults = await Promise.all(imagePromises);
    const newImageUrls = imageResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    saveImagesToCache(newImageUrls);
  };

  const handleNext = () => {
    if (currentIndex < foodItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter food name to get nutrition data"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
        <button
          onClick={fetchFoodItems}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Search
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="text-center mb-6 text-white">Loading...</div>}

      {/* Error Message */}
      {error && !loading && <div className="text-center text-red-500">{error}</div>}

      {/* Food Item Single Card - Centered Layout */}
      {!loading && foodItems.length > 0 && (
        <div className="flex flex-col items-center">
          {/* Static Card (no hover effect) */}
          <div className="bg-white w-full sm:w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] shadow-2xl rounded-2xl overflow-hidden">
            <img
              src={imageUrls[foodItems[currentIndex].name] || "https://via.placeholder.com/400x300"}
              alt={foodItems[currentIndex].name}
              className="w-full h-60 object-cover"
            />
            <div className="p-5 space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 capitalize text-center">
                {foodItems[currentIndex].name}
              </h3>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-sm">
                <p><span className="font-semibold">Calories:</span> {foodItems[currentIndex].calories} kcal</p>
                <p><span className="font-semibold">Protein:</span> {foodItems[currentIndex].protein_g} g</p>
                <p><span className="font-semibold">Fat:</span> {foodItems[currentIndex].fat_total_g} g</p>
                <p><span className="font-semibold">Carbs:</span> {foodItems[currentIndex].carbohydrates_total_g} g</p>
                <p><span className="font-semibold">Sugar:</span> {foodItems[currentIndex].sugar_g} g</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {foodItems.length > 1 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-lg ${
                  currentIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === foodItems.length - 1}
                className={`px-4 py-2 rounded-lg ${
                  currentIndex === foodItems.length - 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Food;
