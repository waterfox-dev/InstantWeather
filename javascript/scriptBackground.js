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
        console.log(`linear-gradient(45deg, ${bgColorOne} 0%, ${bgColorTwo} 100%)`)

        document.body.style.backgroundImage = `linear-gradient(45deg, ${bgColorOne} 0%, ${bgColorTwo} 100%)`;
    }
}

/**
 * Init some features like slider value
 */
function init()
{
    udpateHour(currentHour);
    updateDegree(currentDegree);
}

//First Automation
init();