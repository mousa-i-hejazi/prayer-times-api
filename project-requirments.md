# Project Tasks & Phases

## Phase 1: Setting up the general structure
- **Task 1:** Prepare a basic HTML file + initial CSS (responsive design)

---

## Phase 2: Select Continent → Country → City
- **Task 2:** Build a list of continents  
- **Task 3:** Link continent selection with **REST Countries API** to fetch countries  
- **Task 4:** Link country selection with **CountriesNow API** to fetch cities + caching results  

---

## Phase 3: Prayer times & calculation methods
- **Task 5:** Fetch prayer times from **Aladhan API** based on (country/city/calculation method)  
- **Task 6:** Add a dropdown for calculation methods and link it with the API  
- **Task 7:** Display a table for the five daily prayers  

---

## Phase 4: Next prayer & countdown timer
- **Task 8:** Implement logic to determine the next prayer, and specify if it’s today or tomorrow  
  - *(e.g., if current time is 8:30 PM, show that the next prayer is Fajr at 5:05 AM tomorrow)*  
- **Task 9:** Countdown timer for the next prayer (seconds, minutes, hours) updating every second  
- **Task 10:** A panel or small bar showing the next prayer and its time  

---

## Phase 5: UI Enhancements & Error Handling
- **Task 11:** Fix responsive design for mobile and desktop  
- **Task 12:** Add icons for prayers (Font Awesome)  
- **Task 13:** Add loading status  
- **Task 14:** Handle errors  
  - Invalid city → show a proper message to the user  
  - Network/API failure → display an error state  

---

## Phase 6: Local Storage + Reset
- **Task 15:** Save the last selection in **LocalStorage** (continent, country, city, calculation method)  
- **Task 16:** Retrieve the last selection when the page reloads  
- **Task 17:** Add reset option to clear everything and reset LocalStorage  

---

## Final Phase : Refactoring
- Add final touches  
- Split code into separate files/modules (`utils`, `api`, `ui`) instead of keeping everything in one file  
- Clean up and organize the code
