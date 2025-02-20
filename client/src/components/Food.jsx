// API change 
import React, { useState, useRef } from "react";

const Food = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const imageUrlsRef = useRef({});

  // Api keys and secrets  
  const ninja_data_api_key = "4djTX684YuzuktpSHhz6vA==lkNflklbWGoiQlYw"
  const pixabay_images_api_key = '48466349-17b626c5842b291cd98fe4ee6';

  // Function to fetch food items
  const fetchFoodItems = async () => {
    if (!query.trim()) {
      setError("Input space is empty. Please enter a query.");
      setFoodItems([]);
      setIsContentLoaded(true);
      setAllDataLoaded(true); // Ensure loading is complete even if no query is entered
      return;
    }

    setLoading(true);
    setError(null);
    setFoodItems([]);
    setIsContentLoaded(false);
    setAllDataLoaded(false); // Reset when starting a new fetch

    try {
      const response = await fetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${query}`,
        {
          headers: {
            "X-Api-Key": `${ninja_data_api_key}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch food items");

      const data = await response.json();
      if (data.items?.length > 0) {
        setFoodItems(data.items);
        fetchFoodImages(data.items);
      } else {
        setError("No results found for the given query.");
        setIsContentLoaded(true);
        setAllDataLoaded(true); // Ensure loading is complete when no results are found
      }
    } catch (error) {
      setError(error.message);
      setIsContentLoaded(true);
      setAllDataLoaded(true); // Ensure loading is complete even on error
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch images (Optimized to cache results)
  const fetchFoodImages = async (items) => {
    const imagePromises = items.map(async (item) => {
      if (imageUrlsRef.current[item.name]) return; // Skip fetching if already cached

      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=${pixabay_images_api_key}&q=edible+food+${item.name}&image_type=photo`
        );
        const data = await response.json();

        imageUrlsRef.current[item.name] =
          data.hits?.[0]?.webformatURL || "https://via.placeholder.com/200x150";
      } catch {
        imageUrlsRef.current[item.name] = "https://via.placeholder.com/200x150";
      }
    });

    await Promise.all(imagePromises);

    // After all images are fetched, set the state to indicate loading is complete
    setAllDataLoaded(true);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter food name..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
        <button
          onClick={fetchFoodItems} // Fetch on button click
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Access
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="text-center mb-6 text-white">Loading...</div>}

      {/* Error Message */}
      {error && !loading && <div className="text-center text-red-500">{error}</div>}

      {/* Food Items Grid -Card */}
      {allDataLoaded && foodItems.length > 0 && (
        <div className="flex justify-center">
        {foodItems.map((food, index) => (
          <div
            key={index}
            className="bg-white sm:w-[50%] w-[90%] shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl"
          >
            {/* Image Section */}
            <img
              src={imageUrlsRef.current[food.name] || "https://via.placeholder.com/200x150"}
              alt={food.name}
              className="w-full h-50 object-cover"
            />
      
            {/* Food Details */}
            <div className="p-3">
              <h3 className="text-lg font-bold text-gray-800 capitalize">{food.name}</h3>
      
              {/* Nutritional Info */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <p className="text-gray-600">
                  <span className="font-semibold">Calories:</span> {food.calories} kcal
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Protein:</span> {food.protein_g} g
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Fat:</span> {food.fat_total_g} g
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Carbs:</span> {food.carbohydrates_total_g} g
                </p>
                <p className="text-gray-600 col-span-2">
                  <span className="font-semibold">Sugar:</span> {food.sugar_g} g
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      )}
    </div>
  );
};

export default Food;

