import { API_BASE_URL } from "../config/config.js";

// Cache for calculation methods to avoid repeated API calls
let methodsCache = null;

export async function fetchCalculationMethods() {
  try {
    // Return cached methods if available
    if (methodsCache) {
      return methodsCache;
    }

    const response = await fetch(`${API_BASE_URL}/methods`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error("Invalid response from calculation methods API");
    }

    // Convert the response data to array format
    const methods = Object.entries(data.data).map(([key, value]) => ({
      id: parseInt(key),
      name: value.name || `Method ${key}`
    }));

    // Cache the results
    methodsCache = methods;
    return methods;
    
  } catch (error) {
    console.error("Error fetching calculation methods:", error);
    
    // Fallback to static methods if API fails
    const fallbackMethods = [
      { id: 1, name: "University of Islamic Sciences, Karachi" },
      { id: 2, name: "Islamic Society of North America (ISNA)" },
      { id: 3, name: "Muslim World League (MWL)" },
      { id: 4, name: "Umm al-Qura, Makkah" },
      { id: 5, name: "Egyptian General Authority of Survey" },
      { id: 7, name: "Institute of Geophysics, University of Tehran" },
      { id: 8, name: "Gulf Region" },
      { id: 9, name: "Kuwait" },
      { id: 10, name: "Qatar" },
      { id: 11, name: "Majlis Ugama Islam Singapura, Singapore" },
      { id: 12, name: "Union Organization islamic de France" },
      { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
      { id: 14, name: "Spiritual Administration of Muslims of Russia" },
    ];
    
    methodsCache = fallbackMethods;
    return fallbackMethods;
  }
}