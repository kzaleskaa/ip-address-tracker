const form = document.querySelector(".ip_form");

const addressInfo = document.getElementById("ip_address");
const locationInfo = document.getElementById("location");
const timezoneInfo = document.getElementById("timezone");
const ispInfo = document.getElementById("isp");


const fetchLocation = async (domain) => {
  url = url.concat(`&domain=${domain}`);

  fetch(url)
    .then((response) => response.json())
    .then((data) => setData(data));
};

const setData = (data) => {
  console.log(data);
  addressInfo.innerText = data.ip;
  locationInfo.innerText = `${data.location.region}, ${data.location.country}`;
  timezoneInfo.innerText = `UTC${data.location.timezone}`;
  ispInfo.innerText = data.isp;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredIp = event.target[0].value;
  fetchLocation(enteredIp);
});



var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([51.5, -0.09])
  .addTo(map)
  .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
  .openPopup();
