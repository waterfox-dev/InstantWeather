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
                //console.log(divButtonCitySearch.firstChild);
                divButtonCitySearch.removeChild(divButtonCitySearch.firstChild);
            }
            for(city in data)
            {
                let button = document.createElement("button"); 
                button.textContent = data[city].nom;
                button.id = data[city].code;
                //console.log(button.id);
              
                divButtonCitySearch.appendChild(button);
                button.addEventListener('click', () =>
                {

                    //console.log(button.id);
                    //console.log(button.textContent);
                    searchBar.value = button.textContent;
                    document.getElementById("weatherCity").innerText = "Météo sur " + button.textContent;
                    //console.log(button.id);
                    getWeather(button.id, 0);
                    actualCity = button.id;
                    while (divButtonCitySearch.hasChildNodes()) {
                        //console.log(divButtonCitySearch.firstChild);
                        divButtonCitySearch.removeChild(divButtonCitySearch.firstChild);
                    }
                });
            }

            this.document.getElementById()

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
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=b3aa15a4ca4861c821e0a2823b09726840c7a167f998a0a1f2976b34a4e67a2b&insee=${insee}`)
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
                    StopBubble();
                    // changeTermometer(tempsMedium);
                    updateWeatherSVG(weather['weather']); 


                    const elements = document.querySelectorAll('.leaflet-touch .leaflet-bar a');

                    if(window.innerWidth > 850){
                        console.log(element.style.width)
                        elements.forEach(element => {
                            console.log(element.style.width)
                            element.style.width = '2.8vw !important';
                            console.log(element.style.width)
                            element.style.height = '2.8vw !important';
                            element.style.lineHeight = '2.8vw !important';
                        });
                    }
                    else{
                        console.log("bbb")
                        elements.forEach(element => {
                            element.style.width = '4.8vw !important';
                            element.style.height = '4.8vw !important';
                            element.style.lineHeight = '4.9vw !important';
                        });
                    }
    
                    StopSnow();
                    StopRain();

                    if(parseInt(weather['weather']) >= 10 && parseInt(weather['weather']) <= 78)
                    {
                        rain();
                    }
    
    
                    else if(220 >= parseInt(weather['weather']) >= 222)
                    {
                        snow();
                    }
                    else
                    {
                        StopSnow();
                        StopRain();
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
function init(){
    udpateDate(0);
    updateTextAndHeight();
}

/* -------------------- Termometer Config -------------------- */
/**
 * Update Termometer style depending on medium temperature
 * @param {int} tempsMedium The medium temperature
 */
function changeTermometer(tempsMedium){
    let DivTermometer = document.createElement('div');
    DivTermometer.id = "DivTermometer";
    DivTermometer.classList.add("DivTermometer");

    document.getElementById("temperature").appendChild(DivTermometer);

    let tempsTermometer = ((tempsMedium + 20)*100)/70;
    let divTemp = document.createElement('div');
    divTemp.id = "divtermometerInside";
    divTemp.classList.add("DivtermometerInside");

    document.getElementById("DivTermometer").appendChild(divTemp);
    document.getElementById("divtermometerInside").style.width = `${tempsTermometer}%`;

    if(tempsTermometer < 33){
        document.getElementById("divtermometerInside").style.backgroundColor = "blue";
    }
    else if(tempsTermometer >= 33 && tempsTermometer < 66){
        document.getElementById("divtermometerInside").style.backgroundImage = "linear-gradient(90deg, #64a7ff 0%, #eeb61d 100%)";
    }
    else if(tempsTermometer >= 66){
        document.getElementById("divtermometerInside").style.backgroundImage = "linear-gradient(90deg, #64a7ff 0%, #eeb61d 50%, #fa6464 100%)";
    }

    document.getElementById("termometerActual").innerText = tempsMedium + "°C";

    const droplets = 8;
    for (let r = 0; r < droplets; r++)
    {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('class', 'bubble');
        svg.setAttribute('preserveAspectRatio', 'xMinYMin');
        svg.setAttribute('viewBox', '0 0 2 3');
        svg.style.width = Math.floor(Math.random() * 13) + "px";
        svg.style.height = svg.style.width;
        svg.style.left = Math.floor(Math.random() * 85) + "%";
        svg.style.top = Math.floor(Math.random() * 70) + "%";
        
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        const a = Math.random() + 2;
        
        svg.style.setProperty('--x', 500);
        svg.style.setProperty('--y', 0);
        svg.style.setProperty('--a', a);
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('stroke', 'none');
        path.setAttribute('d', 'M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z');
        
        svg.appendChild(path);
        divTemp.appendChild(svg);

        
        const divTermometer = document.getElementById("divtermometerInside");
        const computedStyle = window.getComputedStyle(divTermometer);
        const size = computedStyle.getPropertyValue('width');
        root = document.documentElement;
        root.style.setProperty('--bubble', size);
        console.log(size)
    }  
}   

/**
 * Stop the emission of bubble
 */
function StopBubble() {
    if (document.getElementById('DivTermometer')) {
        const divToDelete = document.getElementById('DivTermometer');
        divToDelete.remove();
    }
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

    //console.log(result);

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