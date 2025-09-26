import { formatTime } from "../utils/utils.js";

export function displayPrayerTimes(prayerData) {
  const timings = prayerData.timings;
  document.getElementById("fajr-time").textContent = formatTime(timings.Fajr);
  document.getElementById("dhuhr-time").textContent = formatTime(timings.Dhuhr);
  document.getElementById("asr-time").textContent = formatTime(timings.Asr);
  document.getElementById("maghrib-time").textContent = formatTime(timings.Maghrib);
  document.getElementById("isha-time").textContent = formatTime(timings.Isha);
}

let prayerIntervalId = null; 

export function startNextPrayer(timings, countdownEl) {
  const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  function getPrayerDate(time) {
    const [h, m] = time.split(":").map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  }

  function findNextPrayer() {
    const now = new Date();
    for (let prayer of prayerOrder) {
      const prayerTime = getPrayerDate(timings[prayer]);
      if (prayerTime > now) return { name: prayer, date: prayerTime, isToday: true };
    }
    const tomorrowPrayer = getPrayerDate(timings["Fajr"]);
    tomorrowPrayer.setDate(tomorrowPrayer.getDate() + 1);
    return { name: "Fajr", date: tomorrowPrayer, isToday: false };
  }

  // Stop any existing interval
  if (prayerIntervalId) {
    clearInterval(prayerIntervalId);
    prayerIntervalId = null;
  }

  // Show the countdown element
  countdownEl.classList.remove("hidden");

  // Create a new interval
  prayerIntervalId = setInterval(() => {
    const now = new Date();
    const nextPrayer = findNextPrayer();
    const diff = nextPrayer.date - now;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const arabicNames = { Fajr: "(الفجر)", Dhuhr: "(الظهر)", Asr: "(العصر)", Maghrib: "(المغرب)", Isha: "(العشاء)" };
    const nextPrayerDay = nextPrayer.isToday ? "اليوم" : "غداً";

    countdownEl.textContent = `موعد الصلاة القادمة ${arabicNames[nextPrayer.name]} ${nextPrayerDay} متبقي ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
  }, 1000);
}

export function stopNextPrayerCountdown() {
  if (prayerIntervalId) {
    clearInterval(prayerIntervalId);
    prayerIntervalId = null;
  }
}