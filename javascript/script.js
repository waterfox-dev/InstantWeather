let searchBar = this.document.getElementById("searchBar");
let divButtonCitySearch = this.document.getElementById("divButtonCitySearch");
let weatherSvg = this.document.getElementById("weatherSvg");

let strWeatherInfos = ["°C", "°C", "%", "mm", "h", "km/h", "", "km/h", "°", ""];
let strWeatherKey = ["tmin", "tmax", "probarain", "rr10", "sun_hours", "wind10m", "dirwind10m"]
let actualCity; //City Choose Hover
let actualDayHover = 1; //Day Button Hover
let mapReset = 0;   //Map Status
let actualDay = 0;
let globInsee = 14000;

/* -------------------- EVENT LISTENERS -------------------- */


searchBar.addEventListener("input", (event) =>
{
    getCity(parseInt(searchBar.value));
});

document.getElementById("header").addEventListener("mouseenter", (event) =>
{
    document.getElementById("content").style.opacity = "0.5";
});

document.getElementById("header").addEventListener("mouseleave", (event) => {
    document.getElementById("content").style.opacity = "1";
});

document.getElementById("tommorowArrow").addEventListener('click', () =>
{   
    actualDay += 1;           
    getWeather(globInsee, actualDay);      
})

document.getElementById("yesterdayArrow").addEventListener('click', () =>
{
    actualDay -= 1;           
    getWeather(globInsee, actualDay)
})


/* -------------------- END OF EVENT LISTENERS -------------------- */

/**
 * @async
 * Asynchronous function. Get a postal code and fetch all datas concerning its cities
 * @param {int} cp the postal code 
 */
function getCity(cp)
{
    //console.log(cp);
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${cp}`)
    .then(response => response.json())
    .then(
        data =>
        {
            while (divButtonCitySearch.hasChildNodes()) {
                divButtonCitySearch.removeChild(divButtonCitySearch.firstChild);
            }
            for(city in data)
            {
                let button = document.createElement("button"); 
                button.textContent = data[city].nom;
                button.id = data[city].code;
            
                button.classList.add("fade-in");
                button.classList.add("CityButton");
                divButtonCitySearch.appendChild(button);
            
                button.addEventListener('click', () =>
                {
                    document.getElementById("content").style.opacity = "1";
                    searchBar.value = button.textContent;
                    document.getElementById("weatherCity").innerText = "Météo sur " + button.textContent;
                    getWeather(button.id, 0);
                    actualCity = button.id;
                    while (divButtonCitySearch.hasChildNodes()) {
                        divButtonCitySearch.removeChild(divButtonCitySearch.firstChild);
                    }
                });
            }
        })
    .catch(error =>
        {
            divButtonCitySearch.innerHtml = error;
        }
    )
}

/**
 * @async 
 * Asynchronous function. Get Weather for a specific day.
 * @param {int} insee The insee code of the city
 * @param {int} day The day after today. For example `1` mean tommorow
 */
function getWeather(insee, day)
{
    //console.log(insee);
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=5a53a6c6c06bdf4db59b5848acd3050994fd48fff83f9f7c201cf0f7447a6835&insee=${insee}`)
    .then(response => response.json())
    .then(
        data =>
        {
            if('code' in data)
            {
                window.alert("L'api meteo concept ne fourni pas de prévisions pour ce lieu");
                console.log(data['code']);
            }
            else 
            {
                document.getElementById("content").style.visibility = "visible";
                document.getElementById("header").style.display = "flex";
                document.getElementById("divButtonCitySearch").style.position = "absolute";
                document.getElementById("searchBar").style.marginTop = "25px";
                document.getElementById("searchBar").style.marginBottom = "25px";
                document.getElementById("divButtonCitySearch").style.top = "70px";

                globInsee = insee;
                udpateDate(day)
                try
                {
                    let weather = data.forecast[day];
                    for(let i = 1; i < strWeatherKey.length; i++)
                    {
                        let currentText = document.getElementById(`weatherInfos-Text${i}`);
                        currentText.innerHTML = `${weather[strWeatherKey[i-1]]} ${strWeatherInfos[i-1]}`;
                    }
    
                    document.getElementById("arrow").style.transform = `rotate(${weather['dirwind10m']}deg)`;
    
                    document.getElementById("water").style.height = (weather['rr10'] + 45) + 'px';
                    
                    let tempsMedium = (weather['tmax'] + weather['tmin']) / 2;
                    document.getElementById("medTemp").innerText = `${tempsMedium} °C`;
                    updateDegree(tempsMedium)
                    updateWeatherSVG(weather['weather']); 
    
                    StopSnow();
                    StopRain();

                    let actualWeather = parseInt(weather['weather']);

                    if((actualWeather >= 10 && actualWeather <= 15) || (actualWeather >= 30 && actualWeather <= 78) || (actualWeather >= 130 && actualWeather <= 141) || (actualWeather >= 210 && actualWeather <= 212)  || (actualWeather >= 230 && actualWeather <= 232))
                    {
                        rain();
                    }
                    else{
                        StopRain();
                    }

                    if((actualWeather >= 20 && actualWeather <= 32) || (actualWeather >= 60 && actualWeather <= 78) || (actualWeather >= 120 && actualWeather <= 138) || (actualWeather >= 141 && actualWeather <= 142) || (actualWeather >= 220 && actualWeather <= 232))
                    {
                        snow();
                    }
                    else
                    {
                        StopSnow();
                    }
    
                    if(mapReset == 0)
                    {
                        loadMap(weather['latitude'], weather['longitude'], "map");
                        mapReset++;
                    }
                    else
                    {
                        realoadMap(weather['latitude'], weather['longitude'], "map");
                        mapReset++;
                    }
                }
                catch(error)
                {
                    window.alert("Données insuffisantes pour ce jour");
                }

            }
        }
    )
}

/**
 * Initiliasition of the script
 */
function init()
{
    document.getElementById("content").style.visibility = "hidden";
    document.getElementById("searchBar").style.marginTop = "40vh";
    document.getElementById("header").style.display = "block";
    document.getElementById("divButtonCitySearch").style.position = "inherit";

    udpateDate(0);
    updateTextAndHeight();
}
/* -------------------- Map Config -------------------- */

/**
 * Create a `leaflet` map depending on position.
 * @param {float} lat trigonometric position of latitude 
 * @param {float} lon trigonometric position of longitude 
 * @param {String} div id of the map div
 */
function loadMap(lat, lon, div)
{
    map = L.map(div).setView([lat, lon], 11);
    var marker = L.marker([lat, lon]).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    {
        attribution: `Coordonnées : <b>${lat} ; ${lon}</b>`,
        minZoom: 1,
        maxZoom: 20
    }).addTo(map);   
}

/**
 * Reload the map depending on new position
 * @param {float} lat trigonometric position of latitude 
 * @param {float} lon trigonometric position of longitude 
 * @param {String} div id of the map div
 */
function realoadMap(lat, lon, div)
{
    map.remove();   
    map = L.map(div).setView([lat, lon], 11);
    var marker = L.marker([lat, lon]).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    {
        attribution: `Coordonnées : <b>${lat} ; ${lon}</b>`,
        minZoom: 1,
        maxZoom: 20
    }).addTo(map);    
}

/* -------------------- Rain Bucket Config -------------------- */

let resizeDiv = document.getElementById('water');
const displayText = document.getElementById('displayText');
const currentHeightSpan = document.getElementById('waterNum');

/**
 * Update Bucket style
 */
function updateTextAndHeight() {
    const currentHeight = resizeDiv.clientHeight;

    var height = document.getElementById('water').style.height; // e.g., "47.5px"
    var numericHeight = parseFloat(height); // Parse the float value from the string
    var result = (numericHeight - 45).toFixed(2); // Subtract 45 and round to two decimal places

    currentHeightSpan.textContent = result + "mm -";
    requestAnimationFrame(updateTextAndHeight);
}

function updateWeatherSVG(state)
{
    weatherSvg.src = "assets/" + weatherIconDay[`${state}`];
}

function udpateDate(day)
{
    const today = new Date() // get today's date
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + day)
    document.getElementById("currentDate").innerHTML = tomorrow.toDateString();
}

init();