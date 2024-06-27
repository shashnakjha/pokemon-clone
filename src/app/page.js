"use client"; // This directive marks the file as a Client Component

import { useState, useEffect } from "react";
import Link from "next/link";

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);

  useEffect(() => {
    // Fetch all Pokémon
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151") // Fetching first 151 Pokémon for simplicity
      .then((response) => response.json())
      .then((data) => {
        const promises = data.results.map((p) =>
          fetch(p.url).then((res) => res.json())
        );
        Promise.all(promises).then((results) => {
          setPokemon(results);
          setFilteredPokemon(results); // Set initial filtered Pokemon
        });
      });

    // Fetch Pokémon types
    fetch("https://pokeapi.co/api/v2/type")
      .then((response) => response.json())
      .then((data) => setTypes(data.results));
  }, []);

  const handleSearchClick = () => {
    // Filter Pokémon by type and search term
    let filtered = pokemon;

    if (selectedType) {
      filtered = filtered.filter((p) =>
        p.types.map((t) => t.type.name).includes(selectedType)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPokemon(filtered);
    setSearchButtonClicked(true);
  };

  useEffect(() => {
    // Update filteredPokemon when selectedType changes
    if (selectedType) {
      const filtered = pokemon.filter((p) =>
        p.types.map((t) => t.type.name).includes(selectedType)
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemon); // Reset to all Pokémon if no type selected
    }
  }, [selectedType, pokemon]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <select
          className="border p-2 w-40" // Adjust width of select here
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        <div className="flex-1 flex">
          <input
            type="text"
            className="border p-2 flex-1 max-w-xs" // Adjust width of input here
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearchClick}
            style={{ backgroundColor: "#001a33" }}
            className="border p-2 text-white rounded ml-2"
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPokemon.map((p) => (
          <div
            key={p.name}
            className="border border-white p-2 rounded bg-white flex flex-col"
          >
            <div className="flex items-center justify-center">
              <img
                src={p.sprites.front_default}
                alt={p.name}
                className="w-48 h-48 object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-2 bg-gray-100 p-2">
              <h2
                className="text-xl font-bold capitalize text-center"
                style={{ color: "#132639" }}
              >
                {p.name}
              </h2>
              <div className="flex justify-center">
                <Link href={`/pokemon/${p.name}`} style={{ color: "#0099cc" }}>
                  Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
