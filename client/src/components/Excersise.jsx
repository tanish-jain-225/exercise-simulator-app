import React, { useState, useEffect, useCallback } from "react";

const Exercise = () => {
  const [exerciseItems, setExerciseItems] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [gifUrls, setGifUrls] = useState({});

  const url = `https://exercisedb.p.rapidapi.com/exercises?limit=100&offset=100`;
  const exercise_db_api_key = "a3a8007797msh1b5ac7b1dd506e9p13b7e0jsn4d956bbfaacf";
  const searchUrl = `https://exercisedb.p.rapidapi.com/exercises`;

  useEffect(() => {
    fetchExerciseItems();
  }, []);

  const fetchExerciseItems = async () => {
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

      if (!response.ok) throw new Error("Failed to fetch exercises");

      let data = await response.json();
      data = shuffleArray(data);
      setExerciseItems(data);
      setFilteredExercises(data);
      await fetchExerciseGifs(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
    let gifs = {};
    items.forEach((item) => {
      gifs[item.name] = item.gifUrl || "https://via.placeholder.com/400x300.png?text=GIF+not+available";
    });
    setGifUrls(gifs);
  };

  const fetchExercisesBySearchTerm = async (searchValue) => {
    if (searching) return;
    setSearching(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${searchUrl}?name=${searchValue}`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": exercise_db_api_key,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch exercises");

      const data = await response.json();
      setFilteredExercises(data);
      await fetchExerciseGifs(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm.length >= 2) {
        const filteredData = exerciseItems.filter((exercise) =>
          [exercise.name, exercise.equipment, exercise.target]
            .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filteredData.length > 0) {
          setFilteredExercises(filteredData);
          fetchExerciseGifs(filteredData);
        } else {
          fetchExercisesBySearchTerm(searchTerm);
        }
      } else {
        setFilteredExercises(exerciseItems);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, exerciseItems]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      {loading && <div className="text-center mb-6 text-white"><p>Loading...</p></div>}
      
      {!loading && filteredExercises.length === 0 && (
        <div className="text-center text-gray-600">No results found.</div>
      )}

      {!loading && filteredExercises.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredExercises.map((exerciseItem, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <div className="mb-4">
                  <img
                    src={gifUrls[exerciseItem.name]}
                    alt={exerciseItem.name}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 capitalize">
                  {exerciseItem.name || "Name"}
                </h3>
                <p className="text-gray-600 mt-2">
                  {exerciseItem.equipment || "Equipment: Information not available"}
                </p>
                <p className="text-gray-600 mt-2">
                  {exerciseItem.target ? `Target: ${exerciseItem.target}` : "Target: Information not available"}
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
