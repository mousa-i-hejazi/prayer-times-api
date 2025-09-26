import { STORAGE_KEYS } from "../config/config.js";

// Format 24h to 12h
export function formatTime(time24) {
  try {
    if (!time24 || typeof time24 !== 'string') {
      throw new Error("Invalid time format");
    }
    
    const [hours, minutes] = time24.split(":");
    if (!hours || !minutes) {
      throw new Error("Invalid time format");
    }
    
    const hour = parseInt(hours);
    const am_pm = hour >= 12 ? "م" : "ص";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${am_pm}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "--:--";
  }
}

// Save selections
export function saveSelections({ continent, country, city, method }) {
  try {
    const selections = { continent, country, city, method };
    localStorage.setItem(STORAGE_KEYS.PRAYER_SELECTIONS, JSON.stringify(selections));
  } catch (error) {
    console.error("Error saving selections to localStorage:", error);
  }
}

// Load selections
export function loadSelections() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PRAYER_SELECTIONS);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading selections from localStorage:", error);
    return null;
  }
}
