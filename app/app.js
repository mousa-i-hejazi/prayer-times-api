import { populateContinents, populateCalculationMethods, renderCities } from "../ui/form.js";
import { fetchCountries, fetchCities } from "../api/countries.js";
import { fetchPrayerTimes } from "../api/prayerTimes.js";
import { displayPrayerTimes, startNextPrayer } from "../ui/display.js";
import { saveSelections, loadSelections } from "../utils/utils.js";

const continentSelect = document.getElementById("continent-select");
const countrySelect = document.getElementById("country-select");
const citySelect = document.getElementById("city-select");
const timeSelect = document.getElementById("time-select");
const form = document.getElementById("prayer-times-form");
const resetBtn = document.getElementById("reset-btn");
const section3 = document.querySelector(".section-3");
const countdown = document.getElementById("next-prayer-countdown");

populateContinents(continentSelect);
populateCalculationMethods(timeSelect);

continentSelect.addEventListener("change", async (e) => {
  const continent = e.target.value;
  if (continent) {
    const countries = await fetchCountries(continent);
    countrySelect.innerHTML = `<option value="">اختر الدولة</option>`;
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.name.common;
      option.textContent = country.name.common;
      countrySelect.appendChild(option);
    });
  }
});

countrySelect.addEventListener("change", async (e) => {
  const country = e.target.value;
  if (country) {
    const cities = await fetchCities(country);
    renderCities(citySelect, cities);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = citySelect.value;
  const country = countrySelect.value;
  const method = timeSelect.value;

  if (!city || !country || !method) return alert("يرجى اختيار جميع الحقول المطلوبة");

  const submitBtn = document.getElementById("submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "جاري البحث...";
  submitBtn.disabled = true;

  try {
    const prayerData = await fetchPrayerTimes(city, country, method);
    displayPrayerTimes(prayerData);
    startNextPrayer(prayerData.timings, countdown);
    section3.classList.remove("hidden");
    saveSelections({ continent: continentSelect.value, country, city, method });
  } catch (error) {
    alert("حدث خطأ في جلب أوقات الصلاة. يرجى المحاولة مرة أخرى.");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  continentSelect.selectedIndex = 0;
  countrySelect.innerHTML = `<option value="">اختر الدولة</option>`;
  citySelect.innerHTML = `<option value="">اختر المدينة</option>`;
  timeSelect.selectedIndex = 0;
  document.querySelectorAll(".time").forEach((el) => (el.textContent = "--:--"));
  countdown.classList.add("hidden");
  localStorage.removeItem("prayerSelections");
});

document.addEventListener("DOMContentLoaded", async () => {
  const saved = loadSelections();
  if (saved) {
    const { continent, country, city, method } = saved;
    
    if (continent) {
      continentSelect.value = continent;
      
      if (country) {
        const countries = await fetchCountries(continent);
        countrySelect.innerHTML = `<option value="">اختر الدولة</option>`;
        countries.forEach((countryObj) => {
          const option = document.createElement("option");
          option.value = countryObj.name.common;
          option.textContent = countryObj.name.common;
          countrySelect.appendChild(option);
        });
        countrySelect.value = country;
        
        if (city) {
          const cities = await fetchCities(country);
          renderCities(citySelect, cities);
          citySelect.value = city;
          
          if (method) {
            timeSelect.value = method;
            const prayerData = await fetchPrayerTimes(city, country, method);
            displayPrayerTimes(prayerData);
            startNextPrayer(prayerData.timings, countdown);
            section3.classList.remove("hidden");
            countdown.classList.remove("hidden");
          }
        }
      }
    }
  }
});
