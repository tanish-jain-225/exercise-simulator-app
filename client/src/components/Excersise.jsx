import React, { useState, useEffect, useCallback } from "react";

const Exercise = () => {
  const [exerciseItems, setExerciseItems] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [searching, setSearching] = useState(false); // To track if a search request is in progress
  const [gifUrls, setGifUrls] = useState({}); // State to store GIF URLs with exercise names

  const url = `https://exercisedb.p.rapidapi.com/exercises?limit=100&offset=100`;
  const exercise_db_api_key = "a3a8007797msh1b5ac7b1dd506e9p13b7e0jsn4d956bbfaacf";
  const searchUrl = `https://exercisedb.p.rapidapi.com/exercises`;

  const fetchExerciseItems = async () => {
    setLoading(true);
    setError(null);
    setIsContentLoaded(false);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-key": `${exercise_db_api_key}`,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch exercises");

      let data = await response.json();
      data = shuffleArray(data);

      setExerciseItems(data);
      setFilteredExercises(data);
      await fetchExerciseGifs(data); // Fetch GIFs when exercises are loaded
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsContentLoaded(true);
    }
  };

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const fetchExerciseGifs = async (items) => {
    if (!Array.isArray(items)) return;

    let gifs = {};
    const gifPromises = items.map(async (item) => {
      try {
        if (item.gifUrl) {
          gifs[item.name] = item.gifUrl;
        } else {
          gifs[item.name] = "https://via.placeholder.com/400x300.png?text=GIF+not+available";
        }
      } catch (error) {
        console.error(`Error fetching GIF for ${item.name}:`, error);
        gifs[item.name] = "https://via.placeholder.com/400x300.png?text=GIF+not+available"; // Fallback
      }
    });

    await Promise.all(gifPromises);
    setGifUrls(gifs); // Store the fetched GIFs with exercise names
  };

  const fetchExercisesBySearchTerm = async (searchValue) => {
    if (searching) return; // Prevent fetching if already searching
    setSearching(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${searchUrl}?name=${searchValue}`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": `${exercise_db_api_key}`,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch exercises based on search");

      const data = await response.json();
      const filteredSearchResults = data.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      if (filteredSearchResults.length > 0) {
        setFilteredExercises(filteredSearchResults);
        await fetchExerciseGifs(filteredSearchResults); // Fetch GIFs for searched exercises
      } else {
        setFilteredExercises([]); // No results
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchExerciseItems();
  }, []);

  const handleSearch = useCallback(
    (event) => {
      const searchValue = event.target.value;
      setSearchTerm(searchValue);

      // If the search term is empty, fetch 100 random exercises again
      if (searchValue.length === 0) {
        fetchExerciseItems(); // Fetch 100 random exercises
        return;
      }

      // Debounce logic to avoid fetching too often (500ms delay)
      const debounceTimeout = setTimeout(() => {
        if (searchValue.length >= 2) {
          // Search within already fetched exercises
          const filteredData = exerciseItems.filter((exercise) =>
            exercise.name.toLowerCase().includes(searchValue.toLowerCase())
          );

          if (filteredData.length > 0) {
            // If there are results from already fetched exercises
            setFilteredExercises(filteredData);
            fetchExerciseGifs(filteredData); // Fetch GIFs for the filtered exercises
          } else {
            // If no results in fetched exercises, fetch dynamically
            fetchExercisesBySearchTerm(searchValue);
          }
        }
      }, 500);

      return () => clearTimeout(debounceTimeout); // Cleanup the previous timeout
    },
    [exerciseItems]
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {error && !loading && <div className="text-red-600 text-center mt-4">{error}</div>}

      {loading && (
        <div className="text-center mb-6 text-white">
          <p>Loading...</p>
        </div>
      )}

      {isContentLoaded && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredExercises.map((exerciseItem, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <div className="mb-4">
                  <img
                    src={gifUrls[exerciseItem.name] || "https://via.placeholder.com/400x300.png?text=GIF+not+available"}
                    alt={exerciseItem.name}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mt-4 capitalize">
                    {exerciseItem.name || "Name"}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {exerciseItem.equipment || "Equipment: Information not available"}
                  </p>
                </div>
                <p className="text-gray-600 mt-2">
                  {exerciseItem.instructions
                    ? `Instructions: ${exerciseItem.instructions}`
                    : "Instructions: Information not available"}
                </p>
              </div>
              <div className="mt-4">
                <a
                  href={`https://www.youtube.com/results?search_query=${exerciseItem.name}+exercise`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Video Link
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
