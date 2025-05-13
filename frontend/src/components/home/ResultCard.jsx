import React, { useState, useEffect } from "react";
import { getCatFact, getGif } from "../../services/api";

const ResultCard = () => {
  const [fact, setFact] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCatFact();
  }, []);

  const fetchCatFact = async () => {
    setLoading(true);
    setError(false);
    const fact = await getCatFact();
    setFact(fact);
    const query = fact.split(" ").slice(0, 3).join(" ");
    const gif = await getGif(query);
    setGifUrl(gif);
    setLoading(false);
  };

  const refreshGif = async () => {
    setLoading(true);
    setError(false);
    const query = fact.split(" ").slice(0, 3).join(" ");
    const gif = await getGif(query);
    setGifUrl(gif);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex space-x-6 w-full max-w-4xl mx-auto">
      <div className="w-1/2 flex justify-center items-center">
        {loading ? (
          <p>Cargando...</p>
        ) : gifUrl ? (
          <img src={gifUrl} alt="GIF" className="max-h-64 rounded-lg object-cover" />
        ) : (
          <p>No hay GIF disponible</p>
        )}
      </div>
      <div className="w-1/2 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Cat Fact</h2>
        <p className="mb-4">{fact}</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={refreshGif}
        >
          Refrescar GIF
        </button>
      </div>
    </div>
  );
};

export default ResultCard;