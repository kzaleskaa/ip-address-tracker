const form = document.querySelector(".ip_form");

const addressInfo = document.getElementById("ip_address");
const locationInfo = document.getElementById("location");
const timezoneInfo = document.getElementById("timezone");
const ispInfo = document.getElementById("isp");

let MAP, MARKER;

let url =
  "https://geo.ipify.org/api/v2/country,city?apiKey=at_t9IcNihh5h1gVRAoIiriG3yL1j45g";

const initializeMap = () => {
  MAP = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(MAP);

  const icon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [24, 34],
  });

  MARKER = L.marker([51.5, -0.09], { icon: icon }).addTo(MAP);

  fetchLocation();
};

const fetchLocation = async (domain) => {
  if (domain) {
    url = url.concat(`&domain=${domain}`);
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
};

const setData = (data) => {
  console.log(data);

  addressInfo.innerText = data.ip;
  locationInfo.innerText = `${data.location.city}, ${data.location.country}`;
  timezoneInfo.innerText = `UTC${data.location.timezone}`;
  ispInfo.innerText = data.isp;

  const popupInfo = `${data.location.city}, ${data.ip}`;
  changeMapLocataion(data.location.lat, data.location.lng, popupInfo);
};

const changeMapLocataion = (lat, lng, isp) => {
  MAP.flyTo([lat, lng], 13, { animate: true, duration: 0.4 });

  MARKER.setLatLng([lat, lng]);
  MARKER.bindPopup(isp).openPopup();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredIp = event.target[0].value;
  fetchLocation(enteredIp);
});

initializeMap();
