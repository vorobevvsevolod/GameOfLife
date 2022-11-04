const canvas = document.getElementById('canvas');
const contextCanvas = canvas.getContext("2d");
const colorInput = document.getElementById('color');
const resolutionInput = document.getElementById('resolution');
const generationP = document.getElementById('generation')

let resolution = resolutionInput.value;
//Размер игрового поля
const WIDHT = window.innerWidth;
const HEIGHT = window.innerHeight;
let interval;
let widthMap = Math.floor(WIDHT / resolution);
let heightMap = Math.floor(HEIGHT / resolution);
let countGeneration = 0;

//Массивы для поля
let Map;
let NewMap;

//цвета
const COLOR_BACKGROUND = "#000000";
let colorCell = colorInput.value;

window.onload = () =>{
    generationP.hidden = true;
    canvas.width = WIDHT;
    canvas.height = HEIGHT;
    
    contextCanvas.fillStyle = COLOR_BACKGROUND;
    contextCanvas.fillRect(0,0,WIDHT,HEIGHT);
}

//Событие изменения цвета клеток
colorInput.addEventListener("input" , () =>{
    clearInterval(interval);
    colorCell = colorInput.value;
    contextCanvas.fillStyle = colorCell;
    interval = setInterval(GameStep, 17)
}, false);

//событие изменения resolution
resolutionInput.addEventListener("input", () => {
    clearInterval(interval);
    countGeneration = 0
    resolution = resolutionInput.value;
    widthMap = Math.floor(WIDHT / resolution);
    heightMap = Math.floor(HEIGHT / resolution);
    StartGame()
});

const StartGame = () =>{
    generationP.hidden = false;
    clearInterval(interval);
    countGeneration = 0
    Map = [widthMap * heightMap]
    NewMap = [widthMap * heightMap]

    StartLife()
    contextCanvas.fillStyle = colorCell;
    interval = setInterval(GameStep, 1)
}


const Stop = () =>{
    clearInterval(interval);
}

const StartLife = () =>{
    for(y = 1; y < heightMap - 1; y++)
        for(x = 1; x < widthMap - 1; x++)
            Map[x + y * widthMap] = Math.floor(Math.random() * 2) 
}

const PrintMap = () =>{
    contextCanvas.fillStyle = COLOR_BACKGROUND;
    contextCanvas.fillRect(0,0, WIDHT, HEIGHT);
    contextCanvas.fillStyle = colorCell;
    for(y = 1; y < heightMap - 1; y++)
        for(x = 1; x < widthMap - 1; x++)
        if(Map[x + y * widthMap] == 1)
            contextCanvas.fillRect((x * resolution), (y * resolution) , resolution, resolution) 
}

const GameStep = () =>{
    NextGeneration()
    PrintMap()
    generationP.textContent = countGeneration
}

const NextGeneration = () =>{
    let pos;
    countGeneration++;
    for(y = 1; y < heightMap - 1; y++)
        for(x = 1; x < widthMap - 1; x++){
            pos = (x + y * widthMap)

            let buffer = (
                Map[pos + 1] +
                Map[pos - 1] +
                Map[pos + widthMap] +
                Map[pos - widthMap] +

                Map[pos - widthMap - 1] +
                Map[pos - widthMap + 1] +
                Map[pos + widthMap + 1] +
                Map[pos + widthMap - 1] )

                let keepAlive = Map[pos] == 1 && (buffer == 2 || buffer == 3);
                let makeNewLive = Map[pos] == 0 && buffer == 3;
                NewMap[pos] = keepAlive | makeNewLive;
                
             }
    let temp = Map;
    Map = NewMap;
    NewMap = temp;
}
        



