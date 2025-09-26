import { API_BASE_URL } from "../config/config.js";

export async function fetchPrayerTimes(city, country, method) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error("Invalid response from prayer times API");
    }
    
    if (!data.data.timings) {
      throw new Error("Prayer times data is missing");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw new Error("فشل في جلب أوقات الصلاة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.");
  }
}
