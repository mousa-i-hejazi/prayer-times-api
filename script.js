const continentSelect = document.getElementById("continent-select");
const countrySelect = document.getElementById("country-select");
const citySelect = document.getElementById("city-select");
const timeSelect = document.getElementById("time-select");

const continents = ["africa", "americas", "asia", "europe", "oceania"];

// Different calculation methods from Aladhan API
const calculationMethods = [
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
  { id: 14, name: "Spiritual Administration of Muslims of Russia" }
];
function populateContinents() {
  continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent.toLowerCase();
    option.textContent = continent;
    continentSelect.appendChild(option);
  });
}

function populateCalculationMethods() {
  calculationMethods.forEach((method) => {
    const option = document.createElement("option");
    option.value = method.id;
    option.textContent = method.name;
    timeSelect.appendChild(option);
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
populateCalculationMethods();

// Function to fetch prayer times from Aladhan API
async function fetchPrayerTimes(city, country, method) {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error('Failed to fetch prayer times for the specified city');
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
}

// Function to display prayer times
function displayPrayerTimes(prayerData) {
  const timings = prayerData.timings;
  
  // Convert time from 24-hour to 12-hour format with AM/PM
  function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  
  // Display times in the appropriate elements
  document.getElementById('fajr-time').textContent = formatTime(timings.Fajr);
  document.getElementById('dhuhr-time').textContent = formatTime(timings.Dhuhr);
  document.getElementById('asr-time').textContent = formatTime(timings.Asr);
  document.getElementById('maghrib-time').textContent = formatTime(timings.Maghrib);
  document.getElementById('isha-time').textContent = formatTime(timings.Isha);
}

// Event listener for the form
const form = document.getElementById("prayer-times-form");
const section3 = document.querySelector(".section-3");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const city = citySelect.value;
  const country = countrySelect.value;
  const method = timeSelect.value;
  
  if (!city || !country || !method) {
    alert("يرجى اختيار جميع الحقول المطلوبة");
    return;
  }
  
  try {
    // Change search button text to show loading state
    const submitBtn = document.getElementById("submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "جاري البحث...";
    submitBtn.disabled = true;
    
    const prayerData = await fetchPrayerTimes(city, country, method);
    displayPrayerTimes(prayerData);
    startNextPrayer(prayerData.timings);
    section3.classList.remove("hidden");

    
    // Restore original button text
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
  } catch (error) {
    // Handle different types of errors
    let errorMessage = "حدث خطأ في جلب أوقات الصلاة. يرجى المحاولة مرة أخرى.";
    
    if (error.message.includes('Failed to fetch prayer times for the specified city')) {
      errorMessage = "لم يتم العثور على أوقات الصلاة للمدينة المحددة. يرجى التأكد من اسم المدينة والدولة.";
    } else if (error.message.includes('fetch')) {
      errorMessage = "تعذر الاتصال بالخدمة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.";
    }
    
    alert(errorMessage);
    console.error("Error:", error);
    
    // Restore original button text in case of error
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.textContent = "بحث";
    submitBtn.disabled = false;
  }
});

// Add reset button functionality
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  // Reset all elements
  continentSelect.selectedIndex = 0;  // Reset to first option (اختر القارة)
  countrySelect.innerHTML = `<option value="">اختر الدولة</option>`;
  citySelect.innerHTML = `<option value="">اختر المدينة</option>`;
  timeSelect.selectedIndex = 0;  // Reset to first option (اختر طريقة الحساب)

  
  // Reset prayer times display
  document.getElementById('fajr-time').textContent = '--:--';
  document.getElementById('dhuhr-time').textContent = '--:--';
  document.getElementById('asr-time').textContent = '--:--';
  document.getElementById('maghrib-time').textContent = '--:--';
  document.getElementById('isha-time').textContent = '--:--';
  section3.classList.add("hidden")
});

function startNextPrayer(timings) {
  const countdownEl = document.getElementById('next-prayer-countdown');
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  function getPrayerDate(time) {
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  }

  function findNextPrayer() {
    const now = new Date();
    for (let p of prayerOrder) {
      const prayerTime = getPrayerDate(timings[p]);
      if (prayerTime > now) {
        return { name: p, date: prayerTime };
      }
    }
    // كل الصلوات خلصت → فجر بكرة
    const tomorrowFajr = getPrayerDate(timings['Fajr']);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    return { name: 'Fajr', date: tomorrowFajr };
  }

  let interval = setInterval(() => {
    const now = new Date();
    const nextPrayer = findNextPrayer();
    const diff = nextPrayer.date - now;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const arabicNames = {
      Fajr: 'الفجر',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };

    countdownEl.textContent =
      ` ${arabicNames[nextPrayer.name]} ` +
      `${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
  }, 1000);
}

