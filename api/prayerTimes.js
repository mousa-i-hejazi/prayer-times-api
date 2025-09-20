import { API_BASE_URL } from "../config/config.js";

export async function fetchPrayerTimes(city, country, method) {
  const response = await fetch(
    `${API_BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  if (data.code !== 200 || !data.data) throw new Error("Failed to fetch prayer times");
  return data.data;
}
