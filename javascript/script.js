let weatherInfos = this.document.getElementById("weatherInfos");
let searchBar = this.document.getElementById("searchBar");
let divButtonCitySearch = this.document.getElementById("divButtonCitySearch");

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
                    console.log(button.id);
                    //console.log(button.textContent);
                    searchBar.value = button.textContent;
                    //console.log(button.id);
                    getWeather(button.id);
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


function getWeather(insee)
{
    //console.log(insee);
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=196a097c4b2b523569d2099ae7fd051b2afbacf5b97bf204b9876facfe68d66e&insee=${insee}`)
    .then(response => response.json())
    .then(
        data =>
        {
            let weather = data.forecast[0];
            weatherInfos.innerText = "Temp min : " + weather.tmin + "\n"; 
            weatherInfos.innerText += "Temp max : " + weather.tmax + "\n"; 
            weatherInfos.innerText += "Probabilité pluie : " + weather.probarain + "\n"; 
            weatherInfos.innerText += "Nombre heure ensoleillement : " + weather.sun_hours + "\n"; 
            weatherInfos.innerText += "Latitude : " + weather.latitude + "\n"; 
            weatherInfos.innerText += "Longitude : " + weather.longitude + "\n"; 
            weatherInfos.innerText += "Cumul de la pluie sur la journée : " + weather.rr10 + "mm\n"; 
            weatherInfos.innerText += "Vitesse du vent à 10m : " + weather.wind10m + "km/h\n"; 
            weatherInfos.innerText += "Direction du vent à 10m : " + weather.dirwind10m + "°\n";
            weatherInfos.innerText += "Temps : " + weather.weather + "\n";

            document.getElementById("arrow").style.transform = "rotate(" + weather.dirwind10m + "deg)";
            //console.log(document.getElementById("arrow").style.transform);
        }
    )
    .catch(error => testDiv.innerHTML);
}

let strWeatherInfos = ["°C", "°C", "%", "H", "", "", "mm", "km/h", "°"];

for(let i = 1; i < 10; i++){
    document.getElementById("weatherInfos-Text" + i).innerText = document.getElementById("tempSlider" + i).value + strWeatherInfos[i - 1];
    document.getElementById("tempSlider" + i).addEventListener('input', () =>
    {
        document.getElementById("weatherInfos-Text" + i).innerText = document.getElementById("tempSlider" + i).value + strWeatherInfos[i - 1];
        if(i == 9){
            document.getElementById("arrow").style.transform = "rotate(" + document.getElementById("tempSlider" + i).value + "deg)";
            //console.log(document.getElementById("arrow").style.transform)
        }
    })
}