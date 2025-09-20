// Format 24h to 12h
export function formatTime(time24) {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const am_pm = hour >= 12 ? "م" : "ص";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${am_pm}`;
}

// Save selections
export function saveSelections({ continent, country, city, method }) {
  localStorage.setItem("prayerSelections", JSON.stringify({ continent, country, city, method }));
}

// Load selections
export function loadSelections() {
  const saved = localStorage.getItem("prayerSelections");
  return saved ? JSON.parse(saved) : null;
}
