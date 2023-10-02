let weatherInfos = this.document.getElementById("weatherInfos");
let searchBar = this.document.getElementById("searchBar");
let divButtonCitySearch = this.document.getElementById("divButtonCitySearch");
let strWeatherInfos = ["°C", "°C", "%", "mm", "h", "", "", "km/h", "°", ""];
let strWeatherKey = ["tmin", "tmax", "probarain", "rr10", "sun_hours", "wind10m", "dirwind10m"]
let actualCity;
let actualDayHover = 1;
let mapReset = 0;
let HeightWater = 0;

searchBar.addEventListener("input", (event) =>
{
    //console.log(parseInt(searchBar.value));
    getCity(parseInt(searchBar.value));
});


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
                    //console.log(button.id);
                    getWeather(button.id, 0);
                    actualCity = button.id;
                    while (divButtonCitySearch.hasChildNodes()) {
                        //console.log(divButtonCitySearch.firstChild);
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
                document.getElementById("weatherInfos").style.visibility = 'hidden';
                document.getElementById("dayBar").style.visibility = 'hidden';
            }
            else 
            {
                document.getElementById("weatherInfos").style.visibility = 'visible';
                document.getElementById("dayBar").style.visibility = 'visible';
                let weather = data.forecast[day];

                for(let i = 1; i < strWeatherKey.length; i++)
                {
                    document.getElementById(`weatherInfos-Text${i}`).innerText = `${weather[strWeatherKey[i-1]]} ${strWeatherInfos[i-1]}`;
                }

                document.getElementById("arrow").style.transform = `rotate(${weather['dirwind10m']}deg)`;

                document.getElementById("water").style.height = (weather['rr10'] + 45) + 'px';
                
                let tempsMedium = (weather['tmax'] + weather['tmin']) / 2;
                StopBubble();
                changeTermometer(tempsMedium);

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
        }
    )
}

for(let i = 1; i < 8; i++){
    document.getElementById(`day${i}`).addEventListener("click", () => {
        getWeather(actualCity, i-1);

        document.getElementById(`day${actualDayHover}`).classList.remove("dayHover");
        document.getElementById(`day${i}`).classList.add("dayHover");
        actualDayHover = i;
    });
}

// Get the current date
var currentDate = new Date();

for (var i = 1; i < 8; i++) {
    var listItem = document.getElementById(`day${i}`);

    // Add the current date and increment it by 1 day
    var dateString = currentDate.toLocaleDateString();
    listItem.textContent = dateString;

    // Increment the current date by 1 day for the next iteration
    currentDate.setDate(currentDate.getDate() + 1);
}

function changeTermometer(tempsMedium){
    let DivTermometer = document.createElement('div');
    DivTermometer.id = "DivTermometer";
    DivTermometer.classList.add("DivTermometer");

    document.getElementById("temperature").appendChild(DivTermometer);

    let tempsTermometer = ((tempsMedium + 20)*100)/70;
    //console.log(tempsMedium + " " + tempsTermometer);
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
        svg.style.width = Math.floor(Math.random() * 10) + "px";
        svg.style.height = svg.style.width;
        svg.style.left = Math.floor(Math.random() * 90) + "%";
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
    }  
}   

function StopBubble() {
    if (document.getElementById('DivTermometer')) {
        const divToDelete = document.getElementById('DivTermometer');
        divToDelete.remove();
    }
  }  


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

/* Water Div*/
const resizeDiv = document.getElementById('water');
const displayText = document.getElementById('displayText');
const currentHeightSpan = document.getElementById('waterNum');

function updateTextAndHeight() {
    const currentHeight = resizeDiv.clientHeight;
    currentHeightSpan.textContent = (currentHeight-45) + "mm";
    requestAnimationFrame(updateTextAndHeight);
}

// Add an event listener for the "resize" event
resizeDiv.addEventListener('resize', updateTextAndHeight);

updateTextAndHeight();