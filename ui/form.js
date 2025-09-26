import { continents } from "../config/config.js";
import { fetchCalculationMethods } from "../api/calculationMethods.js";

export function populateContinents(selectElement) {
  continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent.toLowerCase();
    option.textContent = continent;
    selectElement.appendChild(option);
  });
}

export async function populateCalculationMethods(selectElement) {
  try {
    const methods = await fetchCalculationMethods();
    methods.forEach((method) => {
      const option = document.createElement("option");
      option.value = method.id;
      option.textContent = method.name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error populating calculation methods:", error);
    // The fetchCalculationMethods already handles fallback, so this shouldn't happen
    // But if it does, create a basic option
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "خطأ في تحميل طرق الحساب";
    selectElement.appendChild(option);
  }
}

export function renderCountries(countrySelect, countries) {
  countrySelect.innerHTML = `<option value="">اختر الدولة</option>`;
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.name.common;
    option.textContent = country.name.common;
    countrySelect.appendChild(option);
  });
}

export function renderCities(citySelect, cities) {
  citySelect.innerHTML = `<option value="">اختر المدينة</option>`;
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}
