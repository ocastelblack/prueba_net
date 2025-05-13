import axios from "axios";

const BASE_URL = "http://localhost:5026/api/catfactgiphy";

export const getCatFact = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fact`);
    return response.data.fact;
  } catch (error) {
    console.error("Error obteniendo el Cat Fact:", error);
    return "Error al obtener Cat Fact.";
  }
};

export const getGif = async (query) => {
  try {
    console.log("Query enviado:", query);  // 🔥 Verificamos el query enviado

    const response = await axios.get(`${BASE_URL}/gif`, { params: { query } });

    console.log("Respuesta completa del GIF:", response.data);  // 🔥 Verificamos la respuesta completa

    return response.data.gifUrl;
  } catch (error) {
    console.error("Error obteniendo el GIF:", error);
    return null;
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el historial:", error);
    return [];
  }
};