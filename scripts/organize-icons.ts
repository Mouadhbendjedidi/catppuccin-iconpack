import fs from "fs";
import path from "path";

const ICONS_DIR = "icons";
const THEMES = ["latte", "frappe", "macchiato", "mocha"];
const suffixMap: Record<string, string> = {
  "": "latte",
  "_1": "frappe",
  "_2": "macchiato",
  "_3": "mocha",
};

const pattern = /^(.+?)(_(\d))?\.svg$/;

function ensureDirs() {
  for (const theme of THEMES) {
    const themePath = path.join(ICONS_DIR, theme);
    if (!fs.existsSync(themePath)) {
      fs.mkdirSync(themePath, { recursive: true });
    }
  }
}

function organizeIcons() {
  const files = fs.readdirSync(ICONS_DIR);

  for (const file of files) {
    const fullPath = path.join(ICONS_DIR, file);
    const stats = fs.statSync(fullPath);
    if (!stats.isFile() || !file.endsWith(".svg")) continue;

    const match = pattern.exec(file);
    if (!match) continue;

    const baseName = match[1];
    const suffix = match[2] || "";
    const theme = suffixMap[suffix];

    if (!theme) continue;

    const newFileName = `${baseName}.svg`;
    const destination = path.join(ICONS_DIR, theme, newFileName);

    fs.renameSync(fullPath, destination);
    console.log(`Moved ${file} → ${destination}`);
  }
}

ensureDirs();
organizeIcons();
