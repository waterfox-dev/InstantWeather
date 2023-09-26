let weatherInfos = this.document.getElementById("weatherInfos");
let searchBar = this.document.getElementById("searchBar");
let divButtonCitySearch = this.document.getElementById("divButtonCitySearch");
let strWeatherInfos = ["°C", "°C", "%", "mm", "h", "", "", "km/h", "°", ""];
let strWeatherKey = ["tmin", "tmax", "probarain", "rr10", "sun_hours", "latitude", "longitude", "wind10m", "dirwind10m", "weather"]
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


function getWeather(insee, day)
{
    //console.log(insee);
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=196a097c4b2b523569d2099ae7fd051b2afbacf5b97bf204b9876facfe68d66e&insee=${insee}`)
    .then(response => response.json())
    .then(
        data =>
        {
            let weather = data.forecast[day];

            for(let i = 1; i < 10; i++)
            {
                document.getElementById(`weatherInfos-Text${i}`).innerText = `${weather[strWeatherKey[i-1]]} ${strWeatherInfos[i-1]}`;
            }
        }
    )
}

