import csv from "csv-parser";
import fs from "fs";
import path from "path";

// CSV aus Google Sheets holen
async function fetchCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fehler beim Abrufen: ${res.statusText}`);
  const text = await res.text();

  // Text in Stream umwandeln, den csv-parser versteht
  const { Readable } = await import("stream");
  const stream = Readable.from(text);

  return new Promise((resolve, reject) => {
    const results = [];
    stream
      .pipe(csv({ headers: ["name", "effect", "imageName"], skipLines: 1 }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// Bildprüfung
function checkImageExists(imageName) {
  const imagePath = path.join("assets", "images", "cards", imageName);
  return fs.existsSync(imagePath);
}

// JS-Datei schreiben
function saveAsJsFile(cards, filename) {
  const content = `export const ${filename.replace(
    ".js",
    ""
  )} = ${JSON.stringify(cards, null, 2)};\n`;
  fs.writeFileSync(path.join("data", filename), content, "utf-8");
  console.log(`✅ ${filename} erstellt (${cards.length} Karten)`);
}

async function main() {
  // Links zu deinen Tabs (hier Platzhalter GIDs, bitte ersetzen!)
  const urls = {
    monster:
      "https://docs.google.com/spreadsheets/d/1J8gaa-SfBALyJfnMOvBXKFuNe49AtfhfQFsNKqV_fjU/edit?gid=451899318#gid=451899318",
    traps:
      "https://docs.google.com/spreadsheets/d/1J8gaa-SfBALyJfnMOvBXKFuNe49AtfhfQFsNKqV_fjU/edit?gid=1542620199#gid=1542620199",
    magic:
      "https://docs.google.com/spreadsheets/d/1J8gaa-SfBALyJfnMOvBXKFuNe49AtfhfQFsNKqV_fjU/edit?gid=1110294285#gid=1110294285",
  };

  // Monster
  const monster = await fetchCSV(urls.monster);
  monster.forEach((c) => {
    if (!checkImageExists(c.imageName)) {
      console.warn(`⚠️ Bild fehlt: ${c.imageName}`);
      c.imageName = "default.png";
    }
  });
  saveAsJsFile(monster, "monsterCards.js");

  // Fallen
  const traps = await fetchCSV(urls.traps);
  traps.forEach((c) => {
    if (!checkImageExists(c.imageName)) {
      console.warn(`⚠️ Bild fehlt: ${c.imageName}`);
      c.imageName = "default.png";
    }
  });
  saveAsJsFile(traps, "trapCards.js");

  // Magie
  const magic = await fetchCSV(urls.magic);
  magic.forEach((c) => {
    if (!checkImageExists(c.imageName)) {
      console.warn(`⚠️ Bild fehlt: ${c.imageName}`);
      c.imageName = "default.png";
    }
  });
  saveAsJsFile(magic, "magicCards.js");
}

main().catch(console.error);
