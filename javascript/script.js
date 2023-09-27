let weatherInfos = this.document.getElementById("weatherInfos");
let searchBar = this.document.getElementById("searchBar");
let divButtonCitySearch = this.document.getElementById("divButtonCitySearch");
let strWeatherInfos = ["°C", "°C", "%", "mm", "h", "", "", "km/h", "°", ""];
let strWeatherKey = ["tmin", "tmax", "probarain", "rr10", "sun_hours", "latitude", "longitude", "wind10m", "dirwind10m"]
let actualCity;
let actualDayHover = 0;

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
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=196a097c4b2b523569d2099ae7fd051b2afbacf5b97bf204b9876facfe68d66e&insee=${insee}`)
    .then(response => response.json())
    .then(
        data =>
        {
            if('code' in data)
            {
                window.alert("L'api meteo concept ne fourni pas de prévisions pour ce lieu");
                document.getElementById("weatherInfos").style.visibility = 'hidden';
                document.getElementById("dayBar").style.visibility = 'hidden';
            }
            else 
            {
                document.getElementById("weatherInfos").style.visibility = 'visible';
                document.getElementById("dayBar").style.visibility = 'visible';
                let weather = data.forecast[day];

                for(let i = 1; i < 10; i++)
                {
                    document.getElementById(`weatherInfos-Text${i}`).innerText = `${weather[strWeatherKey[i-1]]} ${strWeatherInfos[i-1]}`;
                }
                document.getElementById("weatherInfos-Text10").innerText = weather['weather'];

                document.getElementById("arrow").style.transform = `rotate(${weather['dirwind10m']}deg)`;
                let tempsMedium = (weather['tmax'] + weather['tmin']) / 2;
                changeTermometer(tempsMedium);
            }
        }
    )
}

for(let i = 1; i < 8; i++){
    document.getElementById(`day${i}`).addEventListener("click", () => {
        getWeather(actualCity, i-1);

        if(actualDayHover != 0){
            document.getElementById(`day${actualDayHover}`).classList.remove("dayHover");
        }
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
    let tempsTermometer = ((tempsMedium + 20)*100)/70;
    console.log(tempsMedium + " " + tempsTermometer);
    document.getElementById("divtermometerInside").style.width = `${tempsTermometer}%`;

    if(tempsTermometer < 33){
        document.getElementById("divtermometerInside").style.backgroundColor = "blue";
    }
    else if(tempsTermometer >= 33 && tempsTermometer < 66){
        document.getElementById("divtermometerInside").style.backgroundColor = "yellow";
    }
    else if(tempsTermometer >= 66){
        document.getElementById("divtermometerInside").style.backgroundColor = "red";
    }
}