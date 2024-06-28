"use client"; // This directive marks the file as a Client Component

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import loader from "../../../../assets/loader.gif";

const PokemonDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { name } = params; // Get the Pokémon name from the URL
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    if (name) {
      // Fetch Pokémon details from the API
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((response) => response.json())
        .then((data) => setPokemon(data));
    }
  }, [name]);

  if (!pokemon)
    return (
      <div
        style={{ height: "100vh", width: "100%" }}
        className="flex items-center justify-center"
      >
        <Image src={loader} alt="Loading..." width={200} height={200} />
      </div>
    );

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <button
        className="absolute top-4 left-4 text-blue-500"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      <div className="container mx-auto p-4 max-w-lg">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
          <div
            className="flex items-center justify-center flex-1"
            style={{ backgroundColor: "#33d6ff" }}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-60 h-60 object-contain"
            />
          </div>
          <div
            className="p-4 flex-1"
            style={{ backgroundColor: "rgb(204, 153, 0 , 0.8)" }}
          >
            <h2 className="text-2xl font-bold capitalize mb-4">
              {pokemon.name}
            </h2>
            <p>
              <strong>Type:</strong>{" "}
              {pokemon.types.map((t) => t.type.name).join(", ")}
            </p>
            <p>
              <strong>Stats:</strong>{" "}
              {pokemon.stats
                .map((s) => `${s.stat.name}: ${s.base_stat}`)
                .join(", ")}
            </p>
            <p>
              <strong>Abilities:</strong>{" "}
              {pokemon.abilities.map((a) => a.ability.name).join(", ")}
            </p>
            <p>
              <strong>Moves:</strong>{" "}
              {pokemon.moves
                .slice(0, 10)
                .map((m) => m.move.name)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
