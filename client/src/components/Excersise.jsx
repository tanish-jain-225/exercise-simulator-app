// Search for exercises using the ExerciseDB API - By Excerise Name
import React, { useState, useEffect, useRef } from "react";

const Exercise = () => {
  const [exerciseItems, setExerciseItems] = useState([]);
  const [gifUrls, setGifUrls] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API key for the ExerciseDB API
  const exercise_db_api_key = import.meta.env.VITE_EXERCISE_DB_API_KEY;

  const debounceTimer = useRef(null);

  // Unified fetch function with improved error handling
  const fetchExercises = async (url, errorMessage = "Failed to fetch exercises") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-key": exercise_db_api_key,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${errorMessage} - ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setExerciseItems(data);

      // Prepare GIF URLs using exact `name` as the key (case-sensitive, original logic)
      const gifs = data.reduce((acc, item) => {
        acc[item.name] = item.gifUrl || "https://via.placeholder.com/400x300.png?text=GIF+not+available";
        return acc;
      }, {});

      setGifUrls(gifs);
    } catch (err) {
      setError(err.message);
      setExerciseItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomExercises = () => {
    const offset = Math.floor(Math.random() * 1000);
    const url = `https://exercisedb.p.rapidapi.com/exercises?limit=100&offset=${offset}`;
    fetchExercises(url, "Failed to fetch random exercises");
  };

  const fetchExercisesBySearch = (query) => {
    const url = `https://exercisedb.p.rapidapi.com/exercises/name/${query}`;
    fetchExercises(url, "No exercises found for the search term");
  };

  useEffect(() => {
    fetchRandomExercises();

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    const valueClient = e.target.value;
    setSearchTerm(valueClient);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (valueClient.trim() === "") {
      fetchRandomExercises();
    } else if (valueClient.trim().length > 1) {
      debounceTimer.current = setTimeout(() => {
        const sanitizedQuery = valueClient.trim().toLowerCase();
        fetchExercisesBySearch(sanitizedQuery);
      }, 500);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search exercises by name"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      {loading && <div className="text-center text-white">Loading...</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {exerciseItems.map((exerciseItem, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <img
                  src={gifUrls[exerciseItem.name]}  // Reverted to case-sensitive name key
                  alt={exerciseItem.name}
                  className="w-full h-56 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold mt-4 capitalize">
                  {exerciseItem.name}
                </h3>
                <p className="text-gray-600 mt-2">
                  <strong>Equipment:</strong> {exerciseItem.equipment || "Not available"}
                </p>
                <p className="text-gray-600">
                  <strong>Body Part:</strong> {exerciseItem.bodyPart || "Not available"}
                </p>
                <p className="text-gray-600">
                  <strong>Target Muscle:</strong> {exerciseItem.target || "Not available"}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Instructions:</strong>{" "}
                  {Array.isArray(exerciseItem.instructions)
                    ? exerciseItem.instructions.join(", ")
                    : exerciseItem.instructions || "Not available"}
                </p>
              </div>

              <div className="mt-4">
                <a
                  href={`https://www.youtube.com/results?search_query=${exerciseItem.name}+exercise`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exercise;
