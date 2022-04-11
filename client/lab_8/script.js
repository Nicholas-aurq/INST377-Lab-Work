function initMap() {
  const map = L.map('map').setView([38.9397, -76.9378], 10);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibmljaG9sYXNhdXJxIiwiYSI6ImNsMXR3bnd3NzEwZzkza29mMDh6d283N3IifQ.y7I89TuqZxZSigz9CKMf6w'
  }).addTo(map);

  return map;
}

function getRandomInt(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(
    Math.random() * (newMax - newMin + 1) + newMin
  );
}

function dataHandler(arr) {
  console.log('fired dataHandler');
  // console.log(arr);
  const range = [...Array(15).keys()];
  const listItems = range.map((item, index) => {
    const ind = getRandomInt(0, arr.length - 1);
    return arr[ind];
  });
  return listItems;
}

function createHTMLlist(collection) {
  console.log('fired HTML creator function');
  console.log(collection);
  const targetList = document.querySelector('.rest-list');
  targetList.innerHTML = '';
  collection.forEach((item) => {
    const {name} = item;
    const displayName = name.toLowerCase();
    const injectThisItem = `<li>${displayName}</li>`;
    targetList.innerHTML += injectThisItem;
  });
}

function addMarkers(map, collection) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });


  collection.forEach((item) => {
    const point = item.geocoded_column_1?.coordinates;
    L.marker([point[1], point[0]]).addTo(map);
  });
}

async function mainEvent() { // the async keyword means we can make API requests
  map = initMap();
  const form = document.querySelector('.box');
  const sub = document.querySelector('.submit_button');

  const rest = document.querySelector('#rest_name');
  const city = document.querySelector('#city');

  sub.style.display = 'none';
  const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object

  if (arrayFromJson.data.length > 0) {
    sub.style.display = 'block';
    let currentArray = [];
    if (currentArray === undefined) { return; }
    rest.addEventListener('input', async(event) => {
      console.log(event.target.value);
      if (currentArray.length < 1) {
        return;
      }

      const rests = currentArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      createHTMLlist(rests);
      addMarkers(map, rests);
    });
    city.addEventListener('input', async(event) => {
      console.log(event.target.value);
      if (currentArray.length < 1) {
        return;
      }

      const cities = currentArray.filter((item) => {
        const lowerName = item.city.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      createHTMLlist(cities);
    });

    form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      // console.log('form submission'); // this is substituting for a "breakpoint"
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need
      currentArray = dataHandler(arrayFromJson.data);
      createHTMLlist(currentArray);
      addMarkers(map, currentArray);
    });
  }
}
// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests