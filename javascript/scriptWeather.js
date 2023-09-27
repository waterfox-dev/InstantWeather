function weatherIcon(value){
    let img = document.getElementById("weatherIcon");
    switch(parseInt(value)){
        case 1 : 
            img.src = "assets/weather/1.svg";
            console.log("Yes : " + value + " " + img.src);
    }
}