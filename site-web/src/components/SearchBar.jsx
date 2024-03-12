import React, { useState } from "react";

export default function SearchBar({ handleSearch }) {
  const [query, setQuery] = useState("");
  const [exactMatch, setExactMatch] = useState(false);

  return (
    <div id="search-bar">
      <form id="search-form" className="flex-row">
        <input
          id="search-input"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          id="search-btn"
          className="fa fa-2x fa-search"
          type="submit"
          onClick={(event) => handleSearch(event, query, exactMatch)}
        ></button>
        <section id="exact-parent" className="flex-row">
          <input
            id="exact-search"
            type="checkbox"
            onChange={(e) => setExactMatch(e.target.checked)}
          />
          <label htmlFor="exact-search">Exact</label>
        </section>
      </form>
    </div>
  );
}
