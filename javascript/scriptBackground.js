// Elements Reference
let tempLine = this.document.getElementById('tempLine');
let hourLine = this.document.getElementById('hourLine');
let starContainer = this.document.getElementById('test'); //TODO : update this

//Internal variables
let dawnHour = 8;
let sunsetHour = 19;
let currentHour = new Date().getHours();

let degreeNumber = 70;
let degreeVars = ['--wth-very-cold-color', '--wth-cold-color', '--wth-normal-color', '--wth-hot-color', '--wth-very-hot-color', '--wth-sun-color'];
let currentDegree = 10;

//Functions

function sleep(milliseconds)
{
    const date = Date.now();
    let currentDate = null;
    do 
    {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function getCssVariable(key)
{
    return getComputedStyle(document.documentElement).getPropertyValue(key);
}

function createRandomStars(nb)
{

    let rdm =  Math.floor(Math.random() * (20 - 2)) + 2
    for(let i = 0; i<nb; i++)
    {
        const star = document.createElement('div');
        star.className = 'Star';
    
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;
    
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        const animDuration = Math.floor(Math.random() * (7 - 2)) + 2;
    
        star.style.left = `${randomX}px`;
        star.style.top = `${randomY}px`;

        if(rdm == 12)
        {
            star.style.animation = `blink ${animDuration}s infinite alternate`;
            star.style.width = `${animDuration+10}px`;
            star.style.height = `${animDuration+10}px`;
            star.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            
            this.document.getElementById('firstHeader').innerText = "Cause you're like every stars in this sky : Unique."

        }
        else
        {
            this.document.getElementById('firstHeader').innerText = "Instant Weather"
            star.style.animation = `blink ${animDuration}s infinite alternate`;
            star.style.width = `${animDuration}px`;
            star.style.height = `${animDuration}px`;
        }
        starContainer.appendChild(star);
    }
}


function udpateHour(newHour)
{
    currentHour = newHour;
    while (starContainer.firstChild) {
        starContainer.removeChild(starContainer.firstChild);
    }
    if(newHour >= sunsetHour || newHour <= dawnHour)
    {
        document.body.style.backgroundColor = getCssVariable('--night-base-color');
        document.body.style.color = getCssVariable('--night-font-color');
        document.body.style.backgroundImage = 'none';

        createRandomStars(60);
       
    }
    else
    {
        document.body.style.backgroundColor = getCssVariable('--day-base-color');
        document.body.style.color = getCssVariable('--day-font-color');
        updateDegree(currentDegree);

    }
}

function updateDegree(newDegree)
{
    currentDegree = newDegree;
    let pos = (Math.abs(Math.round(((newDegree - 70)/ 70) * 4)));
    
    if(currentHour < sunsetHour && currentHour > dawnHour)
    {
        let range = degreeVars.length - (pos)
        bgColorOne = getCssVariable(degreeVars[range-1]);
        bgColorTwo = getCssVariable(degreeVars[range]);
        //console.log(`linear-gradient(45deg, ${bgColorOne} 0%, ${bgColorTwo} 100%)`)

        document.body.style.backgroundImage = `linear-gradient(45deg, ${bgColorOne} 0%, ${bgColorTwo} 100%)`;
    }
}

function rain()
{
    document.body.style.backgroundColor = "#6c78a9";

    const droplets = 200;

    let rainContainer = document.createElement('div');
    rainContainer.id = 'RainBackground';
    
    for (let r = 0; r < droplets; r++)
    {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('class', 'rain__drop');
        svg.setAttribute('preserveAspectRatio', 'xMinYMin');
        svg.setAttribute('viewBox', '0 0 3 20');
        
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        const o = Math.random();
        const a = Math.random() + 0.5;
        const d = (Math.random() * 2) - 1;
        const s = Math.random();
        
        svg.style.setProperty('--x', x);
        svg.style.setProperty('--y', y);
        svg.style.setProperty('--o', o);
        svg.style.setProperty('--a', a);
        svg.style.setProperty('--d', d);
        svg.style.setProperty('--s', s);
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('stroke', 'none');
        path.setAttribute('d', 'M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z');
        
        svg.appendChild(path);
        rainContainer.appendChild(svg);
        document.body.appendChild(rainContainer);
    }  
}

  function StopRain() {
    if (document.getElementById('RainBackground')) {
        const divToDelete = document.getElementById('RainBackground');
        divToDelete.remove();
    }
  }  

/**
 * Init some features like slider value
 */
function init()
{
    udpateHour(currentHour);
    updateDegree(currentDegree);
    //Rain();
    //StopRain();
}

//First Automation
init();