import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./PokemonDetailPage.module.css";

export default function PokemonDetailPage() {
  type Pokemon = {
    name: string;
    id: number;
    sprites: { front_default: string; front_shiny: string };
    types: {
      slot: number;
      type: {
        name: string;
      };
    }[];
  };

  // pokemon innehåller datan från url, startvärde null, kan vara any
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flavorText, setFlavorText] = useState("");

  const navigate = useNavigate();

  // från route pokemon/:name som är pokemon/name från url'en
  const { name } = useParams();

  // kontrollerad render
  useEffect(
    () => {
      if (!name) return;
      getData();
    },

    // Körs endast om name ändras
    [name]
  );

  async function getData() {
    setIsLoading(true);
    setError(null);
    try {
      const pkmRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!pkmRes.ok) {
        throw new Error("error");
      }
      const pkmData = await pkmRes.json();
      console.log(pkmData);
      // sparar datan i state
      setPokemon(pkmData);

      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${name}`
      );
      if (!speciesRes.ok) throw new Error("species failed");
      const speciesData = await speciesRes.json();

      const entry =
        speciesData.flavor_text_entries.find(
          (e: any) => e.language.name === "en"
        )?.flavor_text ?? "No flavor text found.";

      setFlavorText(entry.replace(/\f|\n/g, " "));
    } catch (error) {
      setError("failed to load pokemon");
    } finally {
      // Så att sidan inte fastnar i ett konstant "Loading", oavsett om fetch fungerar eller ej
      setIsLoading(false);
    }
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  // skydda vid första renderingen, då pokemon = null
  if (!pokemon) {
    return null;
  }

  console.log(pokemon.id);

  return (
    // ser till att första bokstaven blir stor, även vid första render, då pokemon har null

    <div className={styles.container}>
      <div className={styles.pkmWrapper}>
        <div className={styles.screenWrapper}>
          <h1 className={styles.detailh1}>
            {pokemon?.name
              ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
              : ""}
          </h1>
          {/*om sprite är default -> visa shiny. Om sprite är shiny -> default */}
          <img
            className={styles.pkmSprite}
            src={
              isShiny
                ? pokemon.sprites.front_shiny
                : pokemon.sprites.front_default
            }
            alt={pokemon.name}
          />

          <div className={styles.typeWrapper}>
            Type:{" "}
            {pokemon.types
              .map(
                (pkmtype) =>
                  pkmtype.type.name.charAt(0).toUpperCase() +
                  pkmtype.type.name.slice(1)
              )
              .join(", ")}
          </div>
        </div>
        <div className={styles.flavorTextWrapper}>
          <h2>Pokedex entrie: </h2>
          <p className={styles.flavorText}>{flavorText}</p>
        </div>
        <div className={styles.btnWrapper}>
          <button
            className={styles.prevBtn}
            onClick={() => {
              navigate(`/pokemon/${pokemon.id - 1}`);
            }}
          >
            ⬅
          </button>
          <button
            className={styles.shinyBtn}
            // vid klick, skapar funktion som körs och sätter motsatsen till nuvarande värdet(default eller shiny)
            onClick={() => {
              setIsShiny((prev) => !prev);
            }}
          >
            ⭐
          </button>
          <button
            className={styles.nextBtn}
            onClick={() => {
              navigate(`/pokemon/${pokemon.id + 1}`);
            }}
          >
            ➡
          </button>
        </div>
      </div>
      <Link className={styles.link} to="/">
        Back
      </Link>
    </div>
  );
}
