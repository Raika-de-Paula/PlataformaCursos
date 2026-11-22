// src/components/NavbarSearch.jsx

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export default function NavbarSearch({
  activeRole,
  searchExpanded,
  setSearchExpanded
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const term = searchTerm.trim();

    if (activeRole === "student" || !activeRole) {
      navigate(`/courses/search?title=${encodeURIComponent(term)}`);
    } else if (activeRole === "instructor") {
      navigate(`/instructor/courses?title=${encodeURIComponent(term)}`);
    }

    setSearchTerm("");
    setSearchExpanded(false);
  };

  const handleSearchButtonClick = () => {
    // Em telas <= 580px (2º passo), o primeiro clique expande o campo de busca
    if (window.innerWidth <= 580 && !searchExpanded) {
      setSearchExpanded(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return;
    }

    handleSearch();
  };

  return (
    <div className={`search-container ${searchExpanded ? "expanded" : ""}`}>
      <input
        ref={searchInputRef}
        className="navbar-search"
        type="text"
        placeholder="Pesquisar cursos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
          if (e.key === "Escape") setSearchExpanded(false);
        }}
      />

      {searchExpanded && (
        <button
          type="button"
          className="search-close-btn"
          onClick={() => setSearchExpanded(false)}
          aria-label="Fechar busca"
        >
          <FiX size={16} />
        </button>
      )}

      <button
        type="button"
        className="search-btn-icon"
        onClick={handleSearchButtonClick}
        aria-label="Buscar"
      >
        <FaSearch />
      </button>
    </div>
  );
}