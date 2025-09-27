import Papa from "papaparse";

// Deine Basis-URL von GitHub Pages (anpassen!)
const BASE_URL =
  "https://jerrichoz.github.io/DrinkingGameOh/assets/images/cards";
const DEFAULT_IMAGE = "default_card.png";

// Hilfsfunktion: GitHub-Dateiname in URL umwandeln
export function makeGithubUrl(fileName, cardName = "Unbekannt") {
  if (!fileName || fileName.trim() === "") {
    const url = `${BASE_URL}/${DEFAULT_IMAGE}`;
    console.log(`🖼️ [${cardName}] -> Default Bild genutzt: ${url}`);
    return url;
  }

  // automatisch .png anhängen, falls keine Endung drin ist
  let finalName = fileName.trim();
  if (!finalName.toLowerCase().endsWith(".png")) {
    finalName = `${finalName}.png`;
  }

  const url = `${BASE_URL}/${finalName}`;
  console.log(`🖼️ [${cardName}] -> GitHub Bild genutzt: ${url}`);
  return url;
}

// Google Sheets CSV-URL bauen
function buildCsvUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${process.env.EXPO_PUBLIC_GOOGLE_SHEET_ID}/export?format=csv&gid=${gid}`;
}

// CSV-Parser
export async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  console.log("📥 CSV-Rohdaten:\n", text);

  const { data } = Papa.parse(text, { header: true });
  console.log("📊 Geparste Daten:", data);

  // Erwartet Spalten: name, effect, imageName
  return data
    .filter((row) => row.name)
    .map((row) => {
      const imageUrl = makeGithubUrl(row.imageName, row.name);
      console.log("🧩 Karte geladen:", row.name, "effect:", row.effect);
      return {
        name: row.name.trim(),
        effect: row.effect?.trim(),
        image: { uri: imageUrl },
      };
    });
}

// Karten laden (Monster, Fallen, Magie)
export async function fetchAllCards() {
  const monster = await fetchCSV(
    buildCsvUrl(process.env.EXPO_PUBLIC_GOOGLE_GID_MONSTER)
  );
  const traps = await fetchCSV(
    buildCsvUrl(process.env.EXPO_PUBLIC_GOOGLE_GID_TRAPS)
  );
  const magics = await fetchCSV(
    buildCsvUrl(process.env.EXPO_PUBLIC_GOOGLE_GID_MAGIC)
  );

  const monsterCards = monster.map((c) => ({ ...c, type: "MONSTER" }));
  const trapCards = traps.map((c) => ({ ...c, type: "TRAP" }));
  const magicCards = magics.map((c) => ({ ...c, type: "MAGIC" }));

  const allCards = [...monsterCards, ...trapCards, ...magicCards];

  // 🐛 Debug-Logging
  console.log("=== Karten geladen ===");
  allCards.forEach((card, i) => {
    console.log(
      `#${i + 1}:`,
      card.name,
      "| Typ:",
      card.type,
      "| Effekt:",
      card.effect
    );
  });
  console.log("======================");

  return allCards;
}
