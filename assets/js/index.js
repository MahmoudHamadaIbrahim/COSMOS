let sidebarToggle = document.getElementById("sidebar-toggle");
let sidebar = document.getElementById("sidebar");
let featuredLaunchData = document.getElementById("featured-launch");
let loadDateBtn = document.getElementById("load-date-btn");
let loadDateInput = document.getElementById("apod-date-input");
let apodImage = document.getElementById("apod-image");
let launchesGrid = document.getElementById("launches-grid");
let todayDateBtn = document.getElementById("today-apod-btn");
let apodDate = document.getElementById("apod-date");
let apodDateDetail = document.getElementById("apod-date-detail");
let apodLoading = document.getElementById("apod-loading");
let apodCopyright = document.getElementById("apod-copyright");
let apodExplanation = document.getElementById("apod-explanation");
let apodTitle = document.getElementById("apod-title");
let apodDateInfo = document.getElementById("apod-date-info");
let apodMediaType = document.getElementById("apod-media-type");
let appSection = document.querySelectorAll(".app-section");
let planetMain = document.getElementById("planet-main");
let navLinks = document.querySelectorAll(".nav-link");
let planetsCard = document.querySelectorAll(".planet-card");
let loadDateSpan =
  document.querySelector("#apod-date-input").nextElementSibling;
let imgBtn = document.querySelector("#apod-image-container button");
let dateErrorMsg = document.getElementById("date-error-msg");
let isoDate = new Date().toISOString().slice(0, 10);
let allPlanetsData = [];

function handleSidebarDisplay(e) {
  if (sidebarToggle.contains(e.target)) {
    sidebar.classList.toggle("sidebar-open");
  } else if (!sidebar.contains(e.target)) {
    sidebar.classList.remove("sidebar-open");
  }

  if (e.target.classList.contains("nav-link")) {
    sidebar.classList.remove("sidebar-open");
  }
}
document.addEventListener("click", handleSidebarDisplay);

function switchSection(clickedLink) {
  clearActive();
  clickedLink.classList.remove("text-slate-300", "hover:bg-slate-800");
  clickedLink.classList.add("bg-blue-500/10", "text-blue-400");

  let sectionName = clickedLink.getAttribute("data-section");

  for (let j = 0; j < appSection.length; j++) {
    if (appSection[j].getAttribute("data-section") === sectionName) {
      appSection[j].classList.remove("hidden");
    } else {
      appSection[j].classList.add("hidden");
    }
  }
}

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    switchSection(navLinks[i]);
  });
}

function clearActive() {
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove("bg-blue-500/10", "text-blue-400");
    navLinks[i].classList.add("text-slate-300", "hover:bg-slate-800");
  }
}

function initDate() {
  loadDateInput.setAttribute("max", isoDate);
  loadDateInput.value = isoDate;
  setDate(isoDate);
}

initPlanets();
initDate();
displayLaunches();

async function apiData(dateValue = "") {
  loadingData();
  setDate();
  const apiKey = "G607ZyDLOezQc0fw55vCeARK8qYH0ekD5sQMdGEX";
  let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  if (dateValue.trim() !== "") {
    url += `&date=${dateValue}`;
  }

  let response = await fetch(url);

  if (response.ok) {
    let data = await response.json();
    display(data);

    apodImage.classList.remove("hidden");
    apodLoading.classList.add("hidden");
  }
}

function display(data) {
  let dateOptions = { year: "numeric", month: "long", day: "numeric" };
  let date = new Date(data.date).toLocaleDateString("en-US", dateOptions);

  apodDate.innerHTML = `Astronomy Picture of the Day - ${date}`;
  apodTitle.innerHTML = data.title;
  apodExplanation.innerHTML = data.explanation;
  apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${date}`;
  apodCopyright.innerHTML = data.copyright
    ? `&copy; Copyright: ${data.copyright}`
    : "";

  if (data.media_type === "image") {
    apodImage.src = data.hdurl || data.url;
  } else {
    apodImage.src = "assets/images/placeholder.webp";
  }

  imgBtn.onclick = function () {
    window.open(data.url, "_blank");
  };
}

function handleDateLoad() {
  const selectedDate = loadDateInput.value;
  apiData(selectedDate);
  setDate(selectedDate);
}
loadDateBtn.addEventListener("click", handleDateLoad);

function updateToToday() {
  setDate();
  apiData();
  loadDateInput.value = isoDate;
  handleDateLoad();
}
todayDateBtn.addEventListener("click", updateToToday);

function handleDateChange(newDate) {
  setDate(newDate);
}
loadDateInput.addEventListener("input", function () {
  handleDateChange(loadDateInput.value);
});

async function displayLaunches() {
  response = await fetch(
    "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?format=json&limit=10"
  );
  if (response.ok) {
    let data = await response.json();
    let results = data.results;
    displayFeaturedLaunch(results[0]);
    displayLaunchesGrid(results);
  }
}

function displayFeaturedLaunch(results) {
  featuredLaunchData.innerHTML = `
        <div class="flex flex-col justify-between">
                <div>
                <div class="flex items-center gap-3 mb-4">
                    <span
                    class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                    <i class="fas fa-star"></i>
                    Featured Launch
                    </span>
                    <span
                    class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                    >
                    Go
                    </span>
                </div>
                <h3 class="text-3xl font-bold mb-3 leading-tight">
                    ${results.name}
                </h3>
                <div
                    class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                >
                    <div class="flex items-center gap-2">
                    <i class="fas fa-building"></i>
                    <span>${results.launch_service_provider.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                    <i class="fas fa-rocket"></i>
                    <span>${results.rocket.configuration.name}</span>
                    </div>
                </div>
              ${
                dateDiff(results.window_start) > 0
                  ? `
                      <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                          <i class="fas fa-clock text-2xl text-blue-400"></i>
                          <div>
                              <p class="text-2xl font-bold text-blue-400">
                                  ${dateDiff(results.window_start)}
                              </p>
                              <p class="text-xs text-slate-400">Days Until Launch</p>
                          </div>
                      </div>
                      `
                  : ""
              }
                <div class="grid xl:grid-cols-2 gap-4 mb-6">
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-calendar"></i>
                        Launch Date
                    </p>
                    <p class="font-semibold">${setFeaturedDate(
                      results.window_start
                    )}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-clock"></i>
                        Launch Time
                    </p>
                    <p class="font-semibold">${setFeaturedTime(
                      results.window_start
                    )}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-map-marker-alt"></i>
                        Location
                    </p>
                    <p class="font-semibold text-sm">${
                      results.pad.location.name
                    }</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-globe"></i>
                        Country
                    </p>
                    <p class="font-semibold">${results.pad.country.name}</p>
                    </div>
                </div>
                <p class="text-slate-300 leading-relaxed mb-6">
                    ${results.mission.description}
                </p>
                </div>
                <div class="flex flex-col md:flex-row gap-3">
                <button
                    class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                    <i class="fas fa-info-circle"></i>
                    View Full Details
                </button>
                <div class="icons self-end md:self-center">
                    <button
                    class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                    >
                    <i class="far fa-heart"></i>
                    </button>
                    <button
                    class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                    >
                    <i class="fas fa-bell"></i>
                    </button>
                </div>
                </div>
            </div>
            <div class="relative">
                <div
                class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                >
                <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <img src="${results.image.image_url}" alt="${
    results.name
  }" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='/images/launch-placeholder.png';">
                <!-- <div
                    class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                >
                    <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                </div> -->
                <div
                    class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                ></div>
                </div>
            </div>
    `;
}

function displayLaunchesGrid(data) {
  let dataGrid = "";
  for (let i = 1; i < 10; i++) {
    dataGrid += `
        <div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                <img src="${data[i].image.image_url}" alt="${
      data[i].name
    }" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';">
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    Go
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${data[i].name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${data[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${setShortDate(
                      data[i].window_start
                    )}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${setFeaturedTime(
                      data[i].window_start
                    )}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${
                      data[i].rocket.configuration.name
                    }</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${
                      data[i].pad.location.name
                    }</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
    `;
  }

  launchesGrid.innerHTML = dataGrid;
}

function setDate(date = isoDate) {
  if (!date) {
    loadDateSpan.innerHTML = "Select a date";
    return;
  }
  let dateOptions = { year: "numeric", month: "short", day: "numeric" };
  let today = new Date(date);
  loadDateSpan.innerHTML = today.toLocaleDateString("en-US", dateOptions);
}

function setShortDate(date) {
  let dateOptions = { year: "numeric", month: "short", day: "numeric" };
  let shortDate = new Date(date);
  return shortDate.toLocaleDateString("en-US", dateOptions);
}

function loadingData() {
  apodImage.classList.add("hidden");
  apodLoading.classList.remove("hidden");
  apodDate.innerHTML = `Astronomy Picture of the Day - Loading ...`;
  apodTitle.innerHTML = "Loading ...";
  apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>Loading ...`;
  apodExplanation.innerHTML = "Loading ...";
  apodCopyright.innerHTML = "&copy; Copyright: Loading ...";
  apodDateInfo.innerHTML = "Loading ...";
  apodMediaType.innerHTML = "Loading ...";
}

function dateDiff(date) {
  let targetDate = new Date(date);
  let now = new Date();
  let diffInMs = targetDate - now;
  let diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return Math.ceil(diffInDays);
}

function setFeaturedDate(date) {
  let dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let modifiedDate = new Date(date);
  return modifiedDate.toLocaleDateString("en-US", dateOptions);
}

function setFeaturedTime(date) {
  let timeConfig = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  };
  let modifiedTime = new Date(date);
  return modifiedTime.toLocaleString("en-US", timeConfig);
}

function displayCurrentPlanet(data) {
  planetMain.innerHTML = `
    <div class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
      <div class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0">
        <div class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6">
          <img id="planet-detail-image" class="w-full h-full object-contain" 
               src="assets/images/${data.englishName.toLowerCase()}.png"
               alt="${data.englishName} planet" />
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-3 md:mb-4">
            <h3 id="planet-detail-name" class="text-2xl md:text-3xl font-space font-bold">
              ${data.englishName}
            </h3>
            <button class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
          <p id="planet-detail-description" class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
            ${data.description}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
        <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-ruler text-xs"></i>
            <span class="text-xs">Semimajor Axis</span>
          </p>
          <p class="text-sm md:text-lg font-semibold">
            ${(data.semimajorAxis / 1000000).toFixed(1)}M km
          </p>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-circle"></i>
            Mean Radius
          </p>
          <p class="text-lg font-semibold">
            ${Math.floor(data.meanRadius).toLocaleString()} km
          </p>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-weight"></i>
            Mass
          </p>
          <p class="text-lg font-semibold">
            ${data.mass.massValue} x 10^${data.mass.massExponent} kg
          </p>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-compress"></i>
            Density
          </p>
          <p class="text-lg font-semibold">
            ${data.density.toFixed(2)} g/cm³
          </p>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-sync-alt"></i>
            Orbital Period
          </p>
          <p class="text-lg font-semibold">
            ${data.sideralOrbit.toFixed(2)} days
          </p>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-redo"></i>
            Rotation Period
          </p>
          <p class="text-lg font-semibold">
            ${Math.abs(data.sideralRotation).toFixed(2)} hours
          </p>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-moon"></i>
            Moons
          </p>
          <p class="text-lg font-semibold">
            ${data.moons ? data.moons.length : 0}
          </p>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-4">
          <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <i class="fas fa-arrows-alt-v"></i>
            Gravity
          </p>
          <p class="text-lg font-semibold">
            ${data.gravity.toFixed(2)} m/s²
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h4 class="font-semibold mb-4 flex items-center">
          <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
          Discovery Info
        </h4>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Discovered By</span>
            <span class="font-semibold text-right">
              ${data.discoveredBy || "Known since antiquity"}
            </span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Discovery Date</span>
            <span class="font-semibold">
              ${data.discoveryDate || "Ancient"}
            </span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Body Type</span>
            <span class="font-semibold">Planet</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-slate-400">Volume</span>
            <span class="font-semibold">
              ${
                data.vol
                  ? `${data.vol.volValue} x 10^${data.vol.volExponent}`
                  : "N/A"
              } km³
            </span>
          </div>
        </div>
      </div>

      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h4 class="font-semibold mb-4 flex items-center">
          <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
          Quick Facts
        </h4>
        <ul class="space-y-3 text-sm">
          <li class="flex items-start">
            <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
            <span class="text-slate-300">Mass: ${data.mass.massValue} x 10^${
    data.mass.massExponent
  } kg</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
            <span class="text-slate-300">Surface gravity: ${data.gravity.toFixed(
              2
            )} m/s²</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
            <span class="text-slate-300">Density: ${data.density.toFixed(
              2
            )} g/cm³</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
            <span class="text-slate-300">Axial tilt: ${data.axialTilt.toFixed(
              2
            )}°</span>
          </li>
        </ul>
      </div>

      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h4 class="font-semibold mb-4 flex items-center">
          <i class="fas fa-satellite text-blue-400 mr-2"></i>
          Orbital Characteristics
        </h4>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Perihelion</span>
            <span class="font-semibold">${(data.perihelion / 1000000).toFixed(
              1
            )}M km</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Aphelion</span>
            <span class="font-semibold">${(data.aphelion / 1000000).toFixed(
              1
            )}M km</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Eccentricity</span>
            <span class="font-semibold">${data.eccentricity.toFixed(4)}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Inclination</span>
            <span class="font-semibold">${data.inclination.toFixed(2)}°</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Axial Tilt</span>
            <span class="font-semibold">${data.axialTilt.toFixed(2)}°</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-700">
            <span class="text-slate-400">Avg Temperature</span>
            <span class="font-semibold">${data.avgTemp}°C</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-slate-400">Escape Velocity</span>
            <span class="font-semibold">${
              data.escape ? (data.escape / 1000).toFixed(2) : "N/A"
            } km/s</span>
          </div>
        </div>
      </div>

      <button class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
        <i class="fas fa-book mr-2"></i>Learn More
      </button>
    </div>
  `;
}

async function initPlanets() {
  let response = await fetch(
    "https://solar-system-opendata-proxy.vercel.app/api/planets"
  );

  if (response.ok) {
    let data = await response.json();
    allPlanetsData = data.bodies;
    findAndDisplayPlanet("earth");
    highlightTableRow("earth");
  }
}

for (let i = 0; i < planetsCard.length; i++) {
  planetsCard[i].addEventListener("click", function () {
    let planetId = this.getAttribute("data-planet-id");

    findAndDisplayPlanet(planetId);
    highlightTableRow(planetId);
  });
}

function findAndDisplayPlanet(id) {
  if (allPlanetsData.length === 0) {
    return;
  }
  let planet = allPlanetsData.find(function (e) {
    return e.englishName.toLowerCase() === id.toLowerCase();
  });

  if (planet) {
    displayCurrentPlanet(planet);
  }
}

function highlightTableRow(id) {
  let rows = document.querySelectorAll("#planet-comparison-tbody tr");

  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove("bg-blue-500/5");
    rows[i].style.backgroundColor = "";
  }

  let activeRow = document.querySelector(
    `#planet-comparison-tbody tr[data-planet="${id}"]`
  );

  if (activeRow) {
    activeRow.classList.add("bg-blue-500/5");
  }
}
