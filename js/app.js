import { ipRgx, urlRgx } from "./rgx.js";

const form = document.querySelector(".ip_form");
const input = document.querySelector(".ip_form__input");
const addressInfo = document.getElementById("ip_address");
const locationInfo = document.getElementById("location");
const timezoneInfo = document.getElementById("timezone");
const ispInfo = document.getElementById("isp");

let MAP, MARKER;

// validate entered IP (v4, v6) or domain

let url =
  "https://geo.ipify.org/api/v2/country,city?apiKey=at_t9IcNihh5h1gVRAoIiriG3yL1j45g&";

const validate = (enteredData) => {
  input.value = "";

  let newUrl = url;

  if (ipRgx.test(enteredData)) {
    newUrl = newUrl.concat(`&ipAddress=${enteredData}`);
    input.style.backgroundColor = "#FFF";
  } else if (urlRgx.test(enteredData)) {
    newUrl = newUrl.concat(`&domain=${enteredData}`);
    input.style.backgroundColor = "#FFF";
  } else if (enteredData) {
    input.style.backgroundColor = "#FFB5B7";
    return false;
  } else {
    input.style.backgroundColor = "#FFF";
  }

  return newUrl;
};

// fetch data based on IP or domain
const fetchLocation = async (enteredData) => {
  let newUrl = validate(enteredData);

  if (!newUrl) return false;

  fetch(newUrl)
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
};

// initialize map
const initializeMap = () => {
  MAP = L.map("map").setView([52.17072, 20.81214], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(MAP);

  const icon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [24, 34],
  });

  MARKER = L.marker([52.17072, 20.81214], { icon: icon }).addTo(MAP);
  MARKER.bindPopup("").openPopup();

  fetchLocation();
};

// update information
const setData = (data) => {
  addressInfo.innerText = data.ip;
  locationInfo.innerText = `${data.location.city}, ${data.location.country}`;
  timezoneInfo.innerText = `UTC${data.location.timezone}`;
  ispInfo.innerText = data.isp;

  const popupInfo = `${data.location.city}, ${data.ip}`;
  changeMapLocataion(data.location.lat, data.location.lng, popupInfo);
};

// update map's and marker's location
const changeMapLocataion = (lat, lng, isp) => {
  MAP.flyTo([lat, lng], 13, { animate: true, duration: 0.4 });

  MARKER.setLatLng([lat, lng]);
  MARKER.getPopup().setContent(isp);
};

// add event listener - submit
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredIp = event.target[0].value;

  fetchLocation(enteredIp);
});

initializeMap();
