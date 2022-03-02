const form = document.querySelector(".ip_form");
const input = document.querySelector(".ip_form__input");
const addressInfo = document.getElementById("ip_address");
const locationInfo = document.getElementById("location");
const timezoneInfo = document.getElementById("timezone");
const ispInfo = document.getElementById("isp");

let MAP, MARKER;

// validate entered IP or domain
const ipRgx =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

const urlRgx =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

let url =
  "https://geo.ipify.org/api/v2/country,city?apiKey=at_t9IcNihh5h1gVRAoIiriG3yL1j45g";

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
  MARKER.bindPopup("").openPopup();

  fetchLocation();
};

// update information
const setData = (data) => {
  console.log(data);

  addressInfo.innerText = data.ip;
  locationInfo.innerText = `${data.location.city}, ${data.location.country}`;
  timezoneInfo.innerText = `UTC${data.location.timezone}`;
  ispInfo.innerText = data.isp;

  const popupInfo = `${data.location.city}, ${data.ip}`;
  changeMapLocataion(data.location.lat, data.location.lng, popupInfo);
};

// update map's and marker's location
const changeMapLocataion = (lat, lng, isp) => {
  MAP.flyTo([lat, lng], 10, { animate: true, duration: 0.4 });

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
