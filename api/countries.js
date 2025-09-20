const cityCache = {};

export async function fetchCountries(continent) {
  const response = await fetch(`https://restcountries.com/v3.1/region/${continent}`);
  return response.json();
}

export async function fetchCities(country) {
  if (cityCache[country]) return cityCache[country];

  const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.msg);

  cityCache[country] = data.data;
  return data.data;
}
