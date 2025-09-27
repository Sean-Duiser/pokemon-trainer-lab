export function getIdFromUrl(url: string): number {
  // e.g. "https://pokeapi.co/api/v2/pokemon/25/" -> 25
  const m = url.match(/\/pokemon\/(\d+)\/*$/);
  return m ? Number(m[1]) : NaN;
}

// src/features/dex/utils.ts
export function spriteThumbUrl(id: number) {
  // tiny PNGs (~15–30KB)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

// keep this only for the detail drawer
export function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function typeColor(type: string) {
  // simple mapping—tweak colors as you like
  const map: Record<string,string> = {
    normal:"#A8A77A", fire:"#EE8130", water:"#6390F0", electric:"#F7D02C",
    grass:"#7AC74C", ice:"#96D9D6", fighting:"#C22E28", poison:"#A33EA1",
    ground:"#E2BF65", flying:"#A98FF3", psychic:"#F95587", bug:"#A6B91A",
    rock:"#B6A136", ghost:"#735797", dragon:"#6F35FC", dark:"#705746",
    steel:"#B7B7CE", fairy:"#D685AD",
  };
  return map[type] ?? "#888";
}
