import { fetchAllCards } from "./cards";

let cachedCards = null;

// Alle Karten laden & zwischenspeichern
export async function loadCards() {
  if (!cachedCards) {
    cachedCards = await fetchAllCards();
  }
  return cachedCards;
}

// Karte nach Typ ziehen
export async function randomCardByType(type) {
  const cards = await loadCards();
  const filtered = cards.filter((c) => c.type === type.toUpperCase());
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Convenience-Funktionen
export async function randomMagic() {
  return randomCardByType("MAGIC");
}

export async function randomMonster() {
  return randomCardByType("MONSTER");
}

export async function randomTrap() {
  return randomCardByType("TRAP");
}
