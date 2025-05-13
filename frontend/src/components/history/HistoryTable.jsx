import React, { useState, useEffect } from "react";
import { getHistory } from "../../services/api";

const HistoryTable = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await getHistory();
    const sortedData = data.sort((a, b) => new Date(b.searchDate) - new Date(a.searchDate));
    setHistory(sortedData);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredHistory = history.filter(
    (item) =>
      item.catFact.toLowerCase().includes(search.toLowerCase()) ||
      item.query.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="table-container animate-fade-in">
      <h2 className="text-lg font-bold mb-4">Historial de Búsquedas</h2>

      <input
        type="text"
        placeholder="Buscar..."
        className="border p-2 rounded mb-4 w-full"
        value={search}
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cat Fact</th>
            <th>Query</th>
            <th>GIF URL</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">No hay historial disponible</td>
            </tr>
          ) : (
            currentItems.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.searchDate).toLocaleString()}</td>
                <td>{item.catFact}</td>
                <td>{item.query}</td>
                <td>
                  {item.gifUrl ? (
                    <a href={item.gifUrl} target="_blank" rel="noopener noreferrer">Ver GIF</a>
                  ) : (
                    "No disponible"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default HistoryTable;