const dogsContainer = document.getElementById("dogsContainer");
const searchInput = document.getElementById("searchInput");

let DOGS_DATA = [];

// Fetch dogs from API
async function fetchDogs() {
  try {
    const res = await fetch("https://apidoggydex4.onrender.com/dogs");
    DOGS_DATA = await res.json();
    displayDogs(DOGS_DATA);
  } catch (err) {
    console.error("Failed to fetch dogs:", err);
  }
}

// Display dog cards
function displayDogs(dogs) {
  dogsContainer.innerHTML = "";
  dogs.forEach(dog => {
    const card = document.createElement("div");
    card.className = "col-4";

    card.innerHTML = `
    <a href="dog.html?dog_id=${dog.dog_id}" class="card-link">
      <div class="card h-100">
        <img src="${dog.dog.photo_url}" class="card-img-top" alt="${dog.dog.name}">
        <div class="card-body">
          <h5 class="card-title">${dog.dog.name}</h5>
          <p class="card-text">
            Owner: ${dog.owner.name}<br>
          </p>
        </div>
      </div>
    </a>
    `;
    dogsContainer.appendChild(card);
  });
}

// Search filter
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = DOGS_DATA.filter(d =>
    (d.dog.name && d.dog.name.toLowerCase().includes(query)) ||
    (d.owner.name && d.owner.name.toLowerCase().includes(query))
  );
  displayDogs(filtered);
});

// Fetch dogs on load
fetchDogs();

// ------------------------
// Service Worker Registration
// ------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(reg => console.log("Service Worker registered:", reg.scope))
      .catch(err => console.error("Service Worker registration failed:", err));
  });
}