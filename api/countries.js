const cityCache = {};

export async function fetchCountries(continent) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/region/${continent}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from countries API");
    }
    return data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw new Error("فشل في جلب بيانات البلدان. يرجى المحاولة مرة أخرى.");
  }
}

export async function fetchCities(country) {
  try {
    if (cityCache[country]) return cityCache[country];

    const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.msg || "Unknown error from cities API");
    }

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format from cities API");
    }

    cityCache[country] = data.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw new Error("فشل في جلب بيانات المدن. يرجى المحاولة مرة أخرى.");
  }
}
