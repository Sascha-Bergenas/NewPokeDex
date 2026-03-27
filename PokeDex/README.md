# PokeDex

A simple React + TypeScript Pokedex application that uses the public [PokeAPI](https://pokeapi.co/) to display Pokemon data.

## About The Application

This app lets you browse the first 151 Pokemon, search by name, filter by type, and open a detailed page for each Pokemon.

The detail page includes:

- Pokemon sprite (default and shiny toggle)
- Pokemon types
- English Pokedex flavor text
- Previous and next navigation

## Features

- List view for the first 151 Pokemon
- Name search (case-insensitive)
- Type filter buttons (Normal, Fire, Water, etc.)
- Clickable Pokemon cards that route to a detail page
- Detail page with:
  - Name
  - Sprite image
  - Shiny toggle
  - Type list
  - Flavor text entry
  - Previous / next Pokemon navigation
- Loading and error states with retry support on the list page

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- CSS Modules

## API Endpoints Used

- `GET https://pokeapi.co/api/v2/pokemon?limit=151`
- `GET https://pokeapi.co/api/v2/pokemon/{name or id}`
- `GET https://pokeapi.co/api/v2/pokemon-species/{name or id}`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Starts Vite in development mode
- `npm run build` - Type-checks and builds the app
- `npm run lint` - Runs ESLint
- `npm run preview` - Serves the production build locally

## Project Structure

```text
src/
  pages/
    PokedexPage/
    PokemonDetailPage/
  router/
    AppRouter.tsx
```

## Screenshots

Place screenshots in `docs/images/` using the file names below.

### Pokedex List View

![Pokedex list view](docs/images/pokedex-list.png)

### Pokemon Detail View

![Pokemon detail view](docs/images/pokemon-detail.png)

## Future Improvements

- Add pagination or infinite scroll for more than 151 Pokemon.
- Add sorting options (A-Z, Z-A, by number, by type).
- Improve accessibility (keyboard navigation, ARIA labels, focus states).
- Add unit and integration tests.
- Add favorites stored in local storage.
- Add a compare view for multiple Pokemon.
- Improve loading skeletons and error feedback UX.
- Add optional localization for more languages.

## Notes

- Data is loaded from a third-party API (PokeAPI), so internet access is required.
- If some Pokemon detail requests fail, the list page still shows successfully loaded results.
