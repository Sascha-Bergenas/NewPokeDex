import { useEffect, useState } from "react";
import styles from "./PokemonPage.module.css";
import { Link } from "react-router-dom";

export default function PokedexPage() {
  // hämtar 151 första pokemon från api

  type PokemonType = {
    type: {
      name: string;
    };
  };

  type PokemonListItem = {
    name: string;
    url: string;
  };

  type PokemonListResponse = {
    results: PokemonListItem[];
  };

  type PokemonList = {
    name: string;
    url: string;
    types: PokemonType[];
  };

  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy"
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemonList, setPokemonList] = useState<PokemonList[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  // Hämtar första 151 pokemon från list-endpoint
  async function fetchPokemonList() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
    if (!response.ok) {
      throw new Error("Failed to fetch pokemon list");
    }

    const data: PokemonListResponse = await response.json();
    return data.results;
  }
  // Hämtar detaljdata per pokemon vid varje url, så varje obejekt får types
  async function fetchPokemonDetails(list: PokemonListItem[]) {
    const detailedPokemon = await Promise.allSettled(
      list.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch details for ${pokemon.name}`);
        }

        const data = await response.json();
        return {
          name: data.name,
          url: pokemon.url,
          types: data.types
        };
      })
    );

    const successfulPokemon = detailedPokemon
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{
          name: string;
          url: string;
          types: PokemonType[];
        }> => result.status === "fulfilled"
      )
      .map((result) => result.value);

    return successfulPokemon;
  }

  async function getData() {
    setIsLoading(true);
    setError(null);
    try {
      const list = await fetchPokemonList();
      const detailedPokemon = await fetchPokemonDetails(list);

      if (detailedPokemon.length === 0) {
        throw new Error("No pokemon data loaded");
      }

      if (detailedPokemon.length < list.length) {
        setError("Some pokemon failed to load. Showing available results.");
      }

      setPokemonList(detailedPokemon);
    } catch {
      setError("Failed to load pokemon");
      console.error("error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // filtrerar pokemonList efter matchande bokstäver och type, gör om till små bokstäver.
  const filteredPokemon = pokemonList.filter((pokemon) => {
    const matchesName = pokemon.name
      .toLocaleLowerCase()
      .includes(filter.toLocaleLowerCase());

    const matchesType =
      selectedType === "" ||
      pokemon.types.some(
        (pokemonType) => pokemonType.type.name === selectedType
      );

    return matchesName && matchesType;
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  //äger state
  // filtrerar
  //renderar lista
  return (
    // map block funktion
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.dexh1}>PokéDex</h1>
        {error && (
          <div>
            <p>{error}</p>
            <button onClick={getData}>Retry</button>
          </div>
        )}
        <input
          className={styles.input}
          type="text"
          placeholder="Search Pokemon..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.typeWrapper}>
          {/*All sätter selectedtype till tom sträng, så inget filtreras*/}
          <button
            className={`${styles.typeButton} ${
              selectedType === "" ? styles.active : ""
            }`}
            onClick={() => setSelectedType("")}
          >
            All
          </button>
          {/*Bygger en knapp per typ */}
          {types.map((type) => (
            <button
              key={type}
              className={`${styles.typeButton} ${styles[type]} ${
                selectedType === type ? styles.active : ""
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div
          className={styles.pkmContainer}
          // mappar igenom varje pokemon i pokemonList, split delar upp text vid varje "/",
          // som gör url'en till en array med 8 element, id ligger på plats 6 (så parts.length - 2 ger 6),
          // hämtar bild från imageUrl med Id.
        >
          {filteredPokemon.map((pokemon) => {
            const parts = pokemon.url.split("/");
            const id = parts[parts.length - 2];
            const imageUrl =
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
              id +
              ".png";
            // console.log(pokemon.url)
            // Gör varje bild klickbar och skickar till detailPage för vald pokemon med Link
            return (
              <Link
                className={styles.pkmLink}
                key={pokemon.name}
                to={`/pokemon/${pokemon.name}`}
              >
                <img
                  className={styles.pkmSprite}
                  src={imageUrl}
                  alt={pokemon.name}
                />
                <p>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </p>
              </Link>
            );
            {
            }
          })}
        </div>
      </div>
    </div>
  );
}
