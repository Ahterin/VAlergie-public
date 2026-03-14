"use strict";

const peopleGrid = document.getElementById("people-grid");
const personTemplate = document.getElementById("person-template");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const languageSelect = document.getElementById("language-select");
const foodTooltip = createFoodTooltipElement();

const THEME_KEY = "va-theme";
const LANGUAGE_KEY = "va-language";
const ASSET_VERSION = "20260311-10";
const IS_FILE_PROTOCOL = window.location.protocol === "file:";

function parseEmbeddedJson(raw) {
  return JSON.parse(raw.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t"));
}

const EMBEDDED_LOCALES_BY_FILE = {
  "cs.json": parseEmbeddedJson('{\\r\\n  "code": "cs",\\r\\n  "displayName": "\\u010ce\\u0161tina",\\r\\n  "strings": {\\r\\n    "page.title": "Profil j\\u00eddel pro Vojt\\u011b\\u0161ku",\\r\\n    "hero.title": "Alergie a preference j\\u00eddla Vojt\\u011b\\u0161ky",\\r\\n    "hero.subtitle": "Pro v\\u00edce informac\\u00ed naje\\u010f my\\u0161\\u00ed na konkr\\u00e9tn\\u00ed j\\u00eddlo.",\\r\\n    "toolbar.ariaLabel": "Ovl\\u00e1d\\u00e1n\\u00ed profilu",\\r\\n    "language.label": "Jazyk",\\r\\n    "theme.toDark": "P\\u0159epnout na tmav\\u00fd re\\u017eim",\\r\\n    "theme.toLight": "P\\u0159epnout na sv\\u011btl\\u00fd re\\u017eim",\\r\\n    "field.allergies": "Alergie",\\r\\n    "field.safeFoods": "Bezpe\\u010dn\\u00e1 j\\u00eddla",\\r\\n    "field.dislikedFood": "Neobl\\u00edben\\u00e9 j\\u00eddlo",\\r\\n    "common.none": "\\u017d\\u00e1dn\\u00e9"\\r\\n  }\\r\\n}\\r\\n'),
  "en.json": parseEmbeddedJson('{\\r\\n  "code": "en",\\r\\n  "displayName": "English",\\r\\n  "strings": {\\r\\n    "page.title": "Vojteska Food Profile",\\r\\n    "hero.title": "Vojteska\\u0027s Allergy and Food Preferences",\\r\\n    "hero.subtitle": "For more info place the mouse over the concrete food.",\\r\\n    "toolbar.ariaLabel": "Profile controls",\\r\\n    "language.label": "Language",\\r\\n    "theme.toDark": "Switch to Dark Mode",\\r\\n    "theme.toLight": "Switch to Light Mode",\\r\\n    "field.allergies": "Allergies",\\r\\n    "field.safeFoods": "Safe Foods",\\r\\n    "field.dislikedFood": "Disliked Food",\\r\\n    "common.none": "None"\\r\\n  }\\r\\n}\\r\\n'),
};

const EMBEDDED_PROFILE = parseEmbeddedJson('{\\r\\n  "allergies": [\\r\\n    {\\r\\n      "id": "alkohol",\\r\\n      "name": {\\r\\n        "cs": "alkohol",\\r\\n        "en": "Alcohol"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "vyh\\u00fdbam se mu, jak m\\u016f\\u017eu, fakt je mi po n\\u011bm blb\\u011b",\\r\\n        "en": "I avoid it whenever I can; it really makes me feel sick."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "brambory",\\r\\n      "name": {\\r\\n        "cs": "brambory",\\r\\n        "en": "Potatoes"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Konkr\\u00e9tn\\u00ed spou\\u0161t\\u011b\\u010d z lilkovit\\u00fdch rostlin.",\\r\\n        "en": "Specific trigger from the nightshade group."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "hroznove_vino",\\r\\n      "name": {\\r\\n        "cs": "hroznov\\u00e9 v\\u00edno",\\r\\n        "en": "Grape wine"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "rozinky taky ne",\\r\\n        "en": "Raisins too"\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "jablka",\\r\\n      "name": {\\r\\n        "cs": "jablka",\\r\\n        "en": "Apples"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Tepeln\\u011b upraven\\u00e9 nevad\\u00ed.",\\r\\n        "en": "Heat-treated apples are tolerated."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "lepek",\\r\\n      "name": {\\r\\n        "cs": "lepek",\\r\\n        "en": "Gluten"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Vyh\\u00fdbat se p\\u0161enici, \\u017eitu a je\\u010dmeni; m\\u016f\\u017ee zp\\u016fsobit tr\\u00e1vic\\u00ed pot\\u00ed\\u017ee.",\\r\\n        "en": "Avoid wheat, rye, and barley; may trigger digestive issues."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "lilek",\\r\\n      "name": {\\r\\n        "cs": "lilek",\\r\\n        "en": "Eggplant"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Konkr\\u00e9tn\\u00ed spou\\u0161t\\u011b\\u010d z lilkovit\\u00fdch rostlin.",\\r\\n        "en": "Specific trigger from the nightshade group."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "lilkovite_rostliny",\\r\\n      "name": {\\r\\n        "cs": "lilkovit\\u00e9 rostliny",\\r\\n        "en": "Nightshade plants"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Obecn\\u00e1 citlivost na \\u010d\\u00e1st lilkovit\\u00fdch (raj\\u010data, papriky, lilek, brambory).",\\r\\n        "en": "General sensitivity to some nightshades (tomatoes, peppers, eggplant, potatoes)."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "orechy",\\r\\n      "name": {\\r\\n        "cs": "o\\u0159echy",\\r\\n        "en": "Nuts"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Alergie na vybran\\u00e9 druhy; tolerovan\\u00e9 v\\u00fdjimky jsou uvedeny v bezpe\\u010dn\\u00fdch j\\u00eddlech.",\\r\\n        "en": "Allergy applies to selected nut types; tolerated exceptions are listed in safe foods."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "papriky",\\r\\n      "name": {\\r\\n        "cs": "papriky",\\r\\n        "en": "Peppers"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Konkr\\u00e9tn\\u00ed spou\\u0161t\\u011b\\u010d z lilkovit\\u00fdch rostlin.",\\r\\n        "en": "Specific trigger from the nightshade group."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "rajcata",\\r\\n      "name": {\\r\\n        "cs": "raj\\u010data",\\r\\n        "en": "Tomatoes"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Konkr\\u00e9tn\\u00ed spou\\u0161t\\u011b\\u010d z lilkovit\\u00fdch rostlin.",\\r\\n        "en": "Specific trigger from the nightshade group."\\r\\n      }\\r\\n    }\\r\\n  ],\\r\\n  "safeFoods": [\\r\\n    {\\r\\n      "id": "kesu",\\r\\n      "name": {\\r\\n        "cs": "ke\\u0161u",\\r\\n        "en": "Cashews"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Tolerovan\\u00e1 v\\u00fdjimka z obecn\\u00e9 alergie na o\\u0159echy.",\\r\\n        "en": "Tolerated exception within the broader nut allergy profile."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "pistacie",\\r\\n      "name": {\\r\\n        "cs": "pistacie",\\r\\n        "en": "Pistachios"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Tolerovan\\u00e1 v\\u00fdjimka z obecn\\u00e9 alergie na o\\u0159echy.",\\r\\n        "en": "Tolerated exception within the broader nut allergy profile."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "tvargle",\\r\\n      "name": {\\r\\n        "cs": "tvargle",\\r\\n        "en": "The Smelly Moravian Cheese Delicacy"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Bezpe\\u010dn\\u00e9 j\\u00eddlo podle aktu\\u00e1ln\\u00ed zku\\u0161enosti.",\\r\\n        "en": "Considered safe based on current experience."\\r\\n      }\\r\\n    },\\r\\n    {\\r\\n      "id": "vlasky",\\r\\n      "name": {\\r\\n        "cs": "vla\\u0161\\u00e1ky",\\r\\n        "en": "Walnuts"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Tolerovan\\u00e1 v\\u00fdjimka z obecn\\u00e9 alergie na o\\u0159echy.",\\r\\n        "en": "Tolerated exception within the broader nut allergy profile."\\r\\n      }\\r\\n    }\\r\\n  ],\\r\\n  "dislikes": [\\r\\n    {\\r\\n      "id": "rukola",\\r\\n      "name": {\\r\\n        "cs": "rukola",\\r\\n        "en": "Arugula"\\r\\n      },\\r\\n      "info": {\\r\\n        "cs": "Nejde o alergii, jen chu\\u0165ov\\u00e1 neobl\\u00edbenost.",\\r\\n        "en": "Not an allergy, only a taste dislike."\\r\\n      }\\r\\n    }\\r\\n  ]\\r\\n}\\r\\n');

const DEFAULT_LOCALE = {
  "code": "cs",
  "displayName": "Čeština",
  "strings": {
    "page.title": "Profil jídel pro Vojtěšku",
    "hero.title": "Alergie a preference jídla Vojtěšky",
    "hero.subtitle": "Pro více informací najeď myší na konkrétní jídlo.",
    "toolbar.ariaLabel": "Ovládání profilu",
    "language.label": "Jazyk",
    "theme.toDark": "Přepnout na tmavý režim",
    "theme.toLight": "Přepnout na světlý režim",
    "field.allergies": "Alergie",
    "field.safeFoods": "Bezpečná jídla",
    "field.dislikedFood": "Neoblíbené jídlo",
    "common.none": "Žádné"
  }
};

const FALLBACK_PROFILE = {
  name: "",
  allergies: [
    {
      id: "lepek",
      name: { cs: "lepek", en: "Gluten" },
      info: {
        cs: "Vyhýbat se pšenici, žitu a ječmeni; může způsobit trávicí potíže.",
        en: "Avoid wheat, rye, and barley; may trigger digestive issues.",
      },
    },
    {
      id: "lilkovite_rostliny",
      name: { cs: "lilkovité rostliny", en: "Nightshade plants" },
      info: {
        cs: "Obecná citlivost na část lilkovitých (rajčata, papriky, lilek, brambory).",
        en: "General sensitivity to some nightshades (tomatoes, peppers, eggplant, potatoes).",
      },
    },
    {
      id: "rajcata",
      name: { cs: "rajčata", en: "Tomatoes" },
      info: {
        cs: "Konkrétní spouštěč z lilkovitých rostlin.",
        en: "Specific trigger from the nightshade group.",
      },
    },
    {
      id: "papriky",
      name: { cs: "papriky", en: "Peppers" },
      info: {
        cs: "Konkrétní spouštěč z lilkovitých rostlin.",
        en: "Specific trigger from the nightshade group.",
      },
    },
    {
      id: "lilek",
      name: { cs: "lilek", en: "Eggplant" },
      info: {
        cs: "Konkrétní spouštěč z lilkovitých rostlin.",
        en: "Specific trigger from the nightshade group.",
      },
    },
    {
      id: "brambory",
      name: { cs: "brambory", en: "Potatoes" },
      info: {
        cs: "Konkrétní spouštěč z lilkovitých rostlin.",
        en: "Specific trigger from the nightshade group.",
      },
    },
    {
      id: "orechy",
      name: { cs: "ořechy", en: "Nuts" },
      info: {
        cs: "Alergie na vybrané druhy; tolerované výjimky jsou uvedeny v bezpečných jídlech.",
        en: "Allergy applies to selected nut types; tolerated exceptions are listed in safe foods.",
      },
    },
    {
      id: "jablka",
      name: { cs: "jablka", en: "Apples" },
      info: {
        cs: "Tepelně upravené nevadí.",
        en: "Heat-treated apples are tolerated.",
      },
    },
  ],
  safeFoods: [
    {
      id: "tvargle",
      name: { cs: "tvargle", en: "Tvargle" },
      info: {
        cs: "Bezpečné jídlo podle aktuální zkušenosti.",
        en: "Considered safe based on current experience.",
      },
    },
    {
      id: "pistacie",
      name: { cs: "pistacie", en: "Pistachios" },
      info: {
        cs: "Tolerovaná výjimka z obecné alergie na ořechy.",
        en: "Tolerated exception within the broader nut allergy profile.",
      },
    },
    {
      id: "vlasky",
      name: { cs: "vlašáky", en: "Walnuts" },
      info: {
        cs: "Tolerovaná výjimka z obecné alergie na ořechy.",
        en: "Tolerated exception within the broader nut allergy profile.",
      },
    },
    {
      id: "kesu",
      name: { cs: "kešu", en: "Cashews" },
      info: {
        cs: "Tolerovaná výjimka z obecné alergie na ořechy.",
        en: "Tolerated exception within the broader nut allergy profile.",
      },
    },
  ],
  dislikes: [
    {
      id: "rukola",
      name: { cs: "rukola", en: "Arugula" },
      info: {
        cs: "Nejde o alergii, jen chuťová neoblíbenost.",
        en: "Not an allergy, only a taste dislike.",
      },
    },
  ],
};

let availableLocales = [DEFAULT_LOCALE];
let activeLocale = DEFAULT_LOCALE;
let activeProfile = normalizeProfile(FALLBACK_PROFILE, 0);
let activeTooltipAnchor = null;

function createFoodTooltipElement() {
  const tooltip = document.createElement("div");
  tooltip.id = "food-tooltip";
  tooltip.className = "food-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.hidden = true;
  Object.assign(tooltip.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    transform: "translate(-9999px, -9999px)",
    zIndex: "1000",
    pointerEvents: "none",
  });
  document.body.append(tooltip);
  return tooltip;
}

function interpolate(template, params = {}) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match;
  });
}

function t(key, params = {}) {
  const value = activeLocale.strings[key] ?? DEFAULT_LOCALE.strings[key] ?? key;
  return interpolate(value, params);
}

function setElementText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function normalizeLocaleCode(code) {
  return String(code || "").trim().toLowerCase();
}

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Ignore storage errors in strict/private environments.
  }
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    return null;
  }
}

function setStoredLanguage(code) {
  try {
    localStorage.setItem(LANGUAGE_KEY, code);
  } catch (error) {
    // Ignore storage errors in strict/private environments.
  }
}

function getPreferredTheme() {
  const storedTheme = getStoredTheme();
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemPrefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === "dark" ? t("theme.toLight") : t("theme.toDark");
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  setStoredTheme(nextTheme);
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeKey(value) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function normalizeFoodId(value) {
  return normalizeKey(value)
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

function normalizeLocalizedMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const output = {};
  Object.entries(value).forEach(([key, text]) => {
    if (typeof text !== "string") {
      return;
    }

    const clean = normalizeText(text);
    if (!clean) {
      return;
    }

    output[normalizeLocaleCode(key)] = clean;
  });

  return output;
}

function getLocalizedValue(map, localeCode) {
  if (!map || typeof map !== "object") {
    return "";
  }

  const normalized = normalizeLocaleCode(localeCode);
  const base = normalized.split("-")[0];
  const candidates = [normalized, base];

  for (const key of candidates) {
    const value = map[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  const first = Object.values(map).find((value) => typeof value === "string" && value.trim());
  return typeof first === "string" ? first.trim() : "";
}

function compareAlpha(left, right) {
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function normalizeFoodList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  const output = [];
  values.forEach((item) => {
    const normalizedItem = normalizeFoodItem(item);
    if (normalizedItem) {
      output.push(normalizedItem);
    }
  });

  return output.sort((left, right) => compareAlpha(left.name, right.name));
}

function normalizeFoodItem(item) {
  if (typeof item === "string") {
    const name = normalizeText(item);
    if (!name) {
      return null;
    }

    return {
      id: normalizeFoodId(name),
      name,
      names: {},
      info: "",
      infos: {}
    };
  }

  if (!item || typeof item !== "object") {
    return null;
  }

  const localizedNames = normalizeLocalizedMap(
    typeof item.name === "object"
      ? item.name
      : typeof item.names === "object"
        ? item.names
        : typeof item.labels === "object"
          ? item.labels
          : {}
  );

  const localizedInfos = normalizeLocalizedMap(
    typeof item.info === "object"
      ? item.info
      : typeof item.infos === "object"
        ? item.infos
        : typeof item.details === "object"
          ? item.details
          : {}
  );

  const rawName =
    typeof item.name === "string"
      ? item.name
      : typeof item.label === "string"
        ? item.label
        : typeof item.food === "string"
          ? item.food
          : typeof item.value === "string"
            ? item.value
            : typeof item.title === "string"
              ? item.title
              : "";

  const rawId = typeof item.id === "string" ? item.id : "";
  const idFromRawId = normalizeFoodId(rawId);

  if (!rawName) {
    if (idFromRawId) {
      const idOnlyInfo = typeof item.info === "string" ? item.info.trim() : "";
      return {
        id: idFromRawId,
        name: "",
        names: localizedNames,
        info: idOnlyInfo,
        infos: localizedInfos
      };
    }

    const keys = Object.keys(item);
    if (keys.length === 1 && keys[0]) {
      const mappedInfo = typeof item[keys[0]] === "string" ? item[keys[0]] : "";
      const mappedName = normalizeText(keys[0]);
      if (!mappedName && !idFromRawId) {
        return null;
      }
      return {
        id: idFromRawId || normalizeFoodId(mappedName),
        name: mappedName,
        names: localizedNames,
        info: mappedInfo.trim(),
        infos: localizedInfos
      };
    }
  }

  const name = normalizeText(rawName);
  if (!name && !idFromRawId) {
    return null;
  }

  const info =
    typeof item.info === "string"
      ? item.info.trim()
      : typeof item.description === "string"
        ? item.description.trim()
        : typeof item.details === "string"
          ? item.details.trim()
        : typeof item.note === "string"
            ? item.note.trim()
            : "";

  const derivedId = idFromRawId || normalizeFoodId(name);
  return { id: derivedId, name, names: localizedNames, info, infos: localizedInfos };
}

function normalizeProfile(profile, index) {
  const rawName =
    typeof profile.name === "string"
      ? profile.name
      : typeof profile.person === "string"
        ? profile.person
        : typeof profile.fullName === "string"
          ? profile.fullName
          : `Person ${index + 1}`;

  const name = normalizeText(rawName);

  const allergiesSource = pickFirstFoodCollection(
    profile.allergies,
    profile.allergy,
    profile.allergicFoods
  );

  const safeSource = pickFirstFoodCollection(
    profile.safeFoods,
    profile.safe,
    profile.likes,
    profile.likedFoods
  );

  const dislikesSource = pickFirstFoodCollection(
    profile.dislikes,
    profile.dislike,
    profile.unlikedFoods,
    profile.unlikes
  );

  return {
    name,
    allergies: normalizeFoodList(allergiesSource),
    safeFoods: normalizeFoodList(safeSource),
    dislikes: normalizeFoodList(dislikesSource)
  };
}

function normalizeFoodCollectionInput(candidate) {
  if (Array.isArray(candidate)) {
    return candidate;
  }

  if (typeof candidate === "string" && candidate.trim()) {
    return [candidate];
  }

  if (!candidate || typeof candidate !== "object") {
    return [];
  }

  if (Array.isArray(candidate.items)) {
    return candidate.items;
  }

  if (
    typeof candidate.id === "string" ||
    typeof candidate.name === "string" ||
    typeof candidate.label === "string" ||
    typeof candidate.food === "string" ||
    typeof candidate.value === "string" ||
    typeof candidate.title === "string"
  ) {
    return [candidate];
  }

  return Object.entries(candidate).map(([foodName, foodDetails]) => {
    if (typeof foodDetails === "string") {
      return { name: foodName, info: foodDetails };
    }

    if (foodDetails && typeof foodDetails === "object") {
      const extraInfo =
        typeof foodDetails.info === "string"
          ? foodDetails.info
          : typeof foodDetails.description === "string"
            ? foodDetails.description
            : typeof foodDetails.note === "string"
              ? foodDetails.note
              : "";

      return { name: foodName, info: extraInfo };
    }

    return { name: foodName, info: "" };
  });
}

function pickFirstFoodCollection(...candidates) {
  let firstSupported = null;

  for (const candidate of candidates) {
    const normalized = normalizeFoodCollectionInput(candidate);
    if (normalized.length > 0) {
      return normalized;
    }

    if (
      firstSupported === null &&
      (Array.isArray(candidate) ||
        (candidate && typeof candidate === "object") ||
        (typeof candidate === "string" && candidate.trim()))
    ) {
      firstSupported = normalized;
    }
  }

  return firstSupported || [];
}

function createEmptyListItem() {
  const item = document.createElement("li");
  item.className = "empty-item";
  item.textContent = t("common.none");
  return item;
}

function localizeFoodItem(food) {
  const id = normalizeFoodId(food.id || food.name || "");
  const localeCode = activeLocale.code || DEFAULT_LOCALE.code;
  const localizedName = getLocalizedValue(food.names, localeCode);
  const localizedInfo = getLocalizedValue(food.infos, localeCode);

  return {
    id,
    name: localizedName || food.name || id,
    info: localizedInfo || food.info || ""
  };
}

function createFoodPillItem(food, relationClass) {
  const item = document.createElement("li");
  const pill = document.createElement("span");

  pill.className = `food-pill relation-${relationClass}`;
  pill.textContent = food.name;

  if (food.info) {
    pill.dataset.foodInfo = food.info;
    pill.classList.add("has-food-info");
    pill.tabIndex = 0;
  }

  item.append(pill);
  return item;
}

function createDislikeItem(food) {
  const item = document.createElement("li");
  const row = document.createElement("span");

  row.className = "food-row relation-dislike";
  row.textContent = food.name;

  if (food.info) {
    row.dataset.foodInfo = food.info;
    row.classList.add("has-food-info");
    row.tabIndex = 0;
  }

  item.append(row);
  return item;
}

function fillChipList(listElement, values, relationClass) {
  listElement.textContent = "";

  if (values.length === 0) {
    listElement.append(createEmptyListItem());
    return;
  }

  const localizedFoods = values.map(localizeFoodItem).sort((left, right) => compareAlpha(left.name, right.name));
  localizedFoods.forEach((food) => {
    listElement.append(createFoodPillItem(food, relationClass));
  });
}

function fillDislikeList(listElement, values) {
  listElement.textContent = "";

  if (values.length === 0) {
    listElement.append(createEmptyListItem());
    return;
  }

  const localizedFoods = values.map(localizeFoodItem).sort((left, right) => compareAlpha(left.name, right.name));
  localizedFoods.forEach((food) => {
    listElement.append(createDislikeItem(food));
  });
}

function positionTooltip(pointerX, pointerY) {
  const margin = 12;
  const offsetX = 14;
  const offsetY = 16;

  const tooltipWidth = foodTooltip.offsetWidth;
  const tooltipHeight = foodTooltip.offsetHeight;

  const maxLeft = Math.max(margin, window.innerWidth - tooltipWidth - margin);
  const maxTop = Math.max(margin, window.innerHeight - tooltipHeight - margin);

  const left = Math.min(Math.max(margin, pointerX + offsetX), maxLeft);
  const top = Math.min(Math.max(margin, pointerY + offsetY), maxTop);

  foodTooltip.style.transform = "translate(0, 0)";
  foodTooltip.style.left = `${left}px`;
  foodTooltip.style.top = `${top}px`;
}

function showFoodTooltip(target, pointerX, pointerY) {
  if (!target || !target.dataset.foodInfo) {
    return;
  }

  activeTooltipAnchor = target;
  foodTooltip.textContent = target.dataset.foodInfo;
  foodTooltip.hidden = false;
  foodTooltip.classList.add("is-visible");
  foodTooltip.setAttribute("aria-hidden", "false");

  if (typeof pointerX === "number" && typeof pointerY === "number") {
    positionTooltip(pointerX, pointerY);
    return;
  }

  const rect = target.getBoundingClientRect();
  positionTooltip(rect.left + rect.width / 2, rect.bottom);
}

function hideFoodTooltip() {
  activeTooltipAnchor = null;
  foodTooltip.hidden = true;
  foodTooltip.style.transform = "translate(-9999px, -9999px)";
  foodTooltip.classList.remove("is-visible");
  foodTooltip.setAttribute("aria-hidden", "true");
}

function bindFoodInfoTooltip(card) {
  const infoNodes = card.querySelectorAll("[data-food-info]");
  infoNodes.forEach((node) => {
    node.addEventListener("pointerenter", (event) => {
      showFoodTooltip(node, event.clientX, event.clientY);
    });

    node.addEventListener("pointermove", (event) => {
      if (activeTooltipAnchor === node) {
        positionTooltip(event.clientX, event.clientY);
      }
    });

    node.addEventListener("pointerleave", () => {
      if (activeTooltipAnchor === node) {
        hideFoodTooltip();
      }
    });

    node.addEventListener("focus", () => {
      showFoodTooltip(node);
    });

    node.addEventListener("blur", () => {
      if (activeTooltipAnchor === node) {
        hideFoodTooltip();
      }
    });
  });
}

function renderProfile(profile) {
  if (!peopleGrid || !personTemplate) {
    return;
  }

  peopleGrid.textContent = "";

  const fragment = personTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".person-card");
  if (!card) {
    return;
  }

  card.querySelector(".label-allergies").textContent = t("field.allergies");
  card.querySelector(".label-safe").textContent = t("field.safeFoods");
  card.querySelector(".label-disliked").textContent = t("field.dislikedFood");

  fillChipList(card.querySelector(".allergy-list"), profile.allergies, "allergy");
  fillChipList(card.querySelector(".safe-list"), profile.safeFoods, "safe");
  fillDislikeList(card.querySelector(".dislike-list"), profile.dislikes);
  bindFoodInfoTooltip(card);
  hideFoodTooltip();

  peopleGrid.append(card);
}

function applyStaticTranslations() {
  document.title = t("page.title");
  setElementText("hero-title", t("hero.title"));
  setElementText("hero-subtitle", t("hero.subtitle"));
  setElementText("language-label", t("language.label"));

  const toolbar = document.getElementById("profile-toolbar");
  if (toolbar) {
    toolbar.setAttribute("aria-label", t("toolbar.ariaLabel"));
  }

  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(currentTheme);
}

function parseLocaleFileNames(listingHtml) {
  const files = new Set();
  const parser = new DOMParser();
  const doc = parser.parseFromString(listingHtml, "text/html");

  doc.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    const clean = href.split("?")[0].split("#")[0];
    const fileName = clean.split("/").pop();

    if (fileName && fileName.endsWith(".json")) {
      files.add(fileName);
    }
  });

  if (files.size === 0) {
    const regex = /href="([^\"]+\.json)"/g;
    let match;
    while ((match = regex.exec(listingHtml)) !== null) {
      const clean = match[1].split("?")[0].split("#")[0];
      const fileName = clean.split("/").pop();
      if (fileName) {
        files.add(fileName);
      }
    }
  }

  return Array.from(files).sort(compareAlpha);
}

async function discoverLocaleFiles() {
  if (IS_FILE_PROTOCOL) {
    return Object.keys(EMBEDDED_LOCALES_BY_FILE).sort(compareAlpha);
  }

  try {
    const response = await fetch(`./locales/?v=${ASSET_VERSION}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load locales directory (${response.status})`);
    }

    const listingHtml = await response.text();
    const files = parseLocaleFileNames(listingHtml);

    if (files.length > 0) {
      return files;
    }
  } catch (error) {
    console.error(error);
  }

  return ["cs.json", "en.json"];
}

async function loadLocaleFromFile(fileName) {
  if (IS_FILE_PROTOCOL) {
    const embedded = EMBEDDED_LOCALES_BY_FILE[fileName];
    if (!embedded) {
      return null;
    }

    const codeFromFile = fileName.replace(/\.json$/i, "");
    const rawCode = typeof embedded.code === "string" && embedded.code.trim() ? embedded.code : codeFromFile;
    const code = normalizeLocaleCode(rawCode);
    const displayName =
      typeof embedded.displayName === "string" && embedded.displayName.trim()
        ? embedded.displayName.trim()
        : codeFromFile;
    const strings = embedded.strings && typeof embedded.strings === "object" ? embedded.strings : {};

    return { code, displayName, strings };
  }

  try {
    const response = await fetch(`./locales/${fileName}?v=${ASSET_VERSION}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const codeFromFile = fileName.replace(/\.json$/i, "");
    const rawCode = typeof data.code === "string" && data.code.trim() ? data.code : codeFromFile;
    const code = normalizeLocaleCode(rawCode);

    const displayName =
      typeof data.displayName === "string" && data.displayName.trim()
        ? data.displayName.trim()
        : codeFromFile;

    const strings = data.strings && typeof data.strings === "object" ? data.strings : {};

    return { code, displayName, strings };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function loadLocales() {
  const files = await discoverLocaleFiles();
  const loaded = await Promise.all(files.map(loadLocaleFromFile));

  const byCode = new Map();
  loaded.forEach((locale) => {
    if (!locale || !locale.code) {
      return;
    }

    byCode.set(locale.code, locale);
  });

  if (!byCode.has(DEFAULT_LOCALE.code)) {
    byCode.set(DEFAULT_LOCALE.code, DEFAULT_LOCALE);
  }

  return Array.from(byCode.values()).sort((left, right) => compareAlpha(left.displayName, right.displayName));
}

function populateLanguageSelect(locales) {
  if (!languageSelect) {
    return;
  }

  languageSelect.textContent = "";

  locales.forEach((locale) => {
    const option = document.createElement("option");
    option.value = locale.code;
    option.textContent = locale.displayName;
    languageSelect.append(option);
  });
}

function pickInitialLocale(locales) {
  const storedCode = normalizeLocaleCode(getStoredLanguage());
  if (storedCode && locales.some((locale) => locale.code === storedCode)) {
    return storedCode;
  }

  const browserPrefs = [];
  if (Array.isArray(navigator.languages)) {
    browserPrefs.push(...navigator.languages);
  }
  if (typeof navigator.language === "string") {
    browserPrefs.push(navigator.language);
  }

  for (const pref of browserPrefs) {
    const normalized = normalizeLocaleCode(pref);
    if (!normalized) {
      continue;
    }

    if (locales.some((locale) => locale.code === normalized)) {
      return normalized;
    }

    const base = normalized.split("-")[0];
    if (base && locales.some((locale) => locale.code === base)) {
      return base;
    }

    const prefixed = locales.find((locale) => locale.code.startsWith(`${base}-`));
    if (prefixed) {
      return prefixed.code;
    }
  }

  return locales.some((locale) => locale.code === "cs") ? "cs" : locales[0].code;
}

function setActiveLocale(code) {
  const normalized = normalizeLocaleCode(code);
  const locale =
    availableLocales.find((entry) => entry.code === normalized) || availableLocales[0] || DEFAULT_LOCALE;

  activeLocale = locale;
  document.documentElement.lang = locale.code;

  if (languageSelect) {
    languageSelect.value = locale.code;
  }

  setStoredLanguage(locale.code);
  applyStaticTranslations();
}

async function loadTargetProfile() {
  if (IS_FILE_PROTOCOL) {
    return normalizeProfile(EMBEDDED_PROFILE, 0);
  }

  try {
    const response = await fetch(`./people.json?v=${ASSET_VERSION}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load people.json (${response.status})`);
    }

    const data = await response.json();
    if (
      data &&
      typeof data === "object" &&
      (Array.isArray(data.allergies) ||
        Array.isArray(data.safeFoods) ||
        Array.isArray(data.dislikes) ||
        Array.isArray(data.safe) ||
        Array.isArray(data.allergy))
    ) {
      return normalizeProfile(data, 0);
    }

    const rows = Array.isArray(data)
      ? data
      : Array.isArray(data?.people)
        ? data.people
        : Array.isArray(data?.profiles)
          ? data.profiles
          : data && typeof data === "object"
            ? [data]
            : [];

    if (!Array.isArray(rows)) {
      throw new Error("people.json has unsupported format");
    }

    const normalized = rows
      .map(normalizeProfile)
      .filter((profile) => profile.name.length > 0)
      .sort((left, right) => compareAlpha(left.name, right.name));

    if (normalized.length > 0) {
      return normalized[0];
    }

    return normalizeProfile(FALLBACK_PROFILE, 0);
  } catch (error) {
    console.error(error);
    return normalizeProfile(FALLBACK_PROFILE, 0);
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}

if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    setActiveLocale(languageSelect.value);
    renderProfile(activeProfile);
  });
}

window.addEventListener("resize", hideFoodTooltip);
window.addEventListener(
  "scroll",
  () => {
    if (activeTooltipAnchor) {
      hideFoodTooltip();
    }
  },
  true
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeTooltipAnchor) {
    hideFoodTooltip();
  }
});

async function initializeApp() {
  applyTheme(getPreferredTheme());

  availableLocales = await loadLocales();
  populateLanguageSelect(availableLocales);
  setActiveLocale(pickInitialLocale(availableLocales));

  activeProfile = await loadTargetProfile();
  renderProfile(activeProfile);
}

initializeApp();
