const continentSelect = document.getElementById("continent-select");
const countrySelect = document.getElementById("country-select");
const citySelect = document.getElementById("city-select");

const continents = ["africa", "americas", "asia", "europe", "oceania"];
function populateContinents() {
  continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent.toLowerCase();
    option.textContent = continent;
    continentSelect.appendChild(option);
  });
}
async function fetchCountries(continent) {
  countrySelect.innerHTML = `<option value="">Loading countries...</option>`;
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${continent}`
    );
    const data = await response.json();

    countrySelect.innerHTML = `<option value="">اختر الدولة</option>`;
    data.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.name.common;
      option.textContent = country.name.common;
      countrySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    countrySelect.innerHTML = `<option value="">خطأ في تحميل الدول</option>`;
  }
}

const cityCache = {};

async function fetchCities(country) {
  if (cityCache[country]) {
    renderCities(cityCache[country]);
    return;
  }

  citySelect.innerHTML = `<option value="">Loading cities...</option>`;
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      }
    );
    const data = await response.json();

    if (data.error) throw new Error(data.msg);

    cityCache[country] = data.data;
    renderCities(data.data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    citySelect.innerHTML = `<option value="">خطأ في تحميل المدن</option>`;
  }
}

function renderCities(cities) {
  citySelect.innerHTML = `<option value="">اختر المدينة</option>`;
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

continentSelect.addEventListener("change", (e) => {
  const continent = e.target.value;
  if (continent) {
    fetchCountries(continent);
  } else {
    countrySelect.innerHTML = `<option value="">اختر الدولة</option>`;
    citySelect.innerHTML = `<option value="">اختر المدينة</option>`;
  }
});
countrySelect.addEventListener("change", (e) => {
  const country = e.target.value;
  if (country) {
    fetchCities(country);
  } else {
    citySelect.innerHTML = `<option value="">اختر المدينة</option>`;
  }
});

populateContinents();
