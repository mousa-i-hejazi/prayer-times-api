import { continents, calculationMethods } from "../config/config.js";

export function populateContinents(selectElement) {
  continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent.toLowerCase();
    option.textContent = continent;
    selectElement.appendChild(option);
  });
}

export function populateCalculationMethods(selectElement) {
  calculationMethods.forEach((method) => {
    const option = document.createElement("option");
    option.value = method.id;
    option.textContent = method.name;
    selectElement.appendChild(option);
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
