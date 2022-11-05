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
let timeInterval;
let widthMap = Math.floor(WIDHT / resolution);
let heightMap = Math.floor(HEIGHT / resolution);
let countGeneration = 0;
let openSeting = false;

//Правили игры
let burnTo = document.getElementById('burnTo');
let burnUp = document.getElementById('burnUp');
let saveTo = document.getElementById('saveTo');
let saveUp = document.getElementById('saveUp');
let pressetRuls = document.getElementById('presset');

let burnToValue = burnTo.value;
let burnUpValue = burnUp.value;
let saveToValue = saveTo.value;
let saveUpValue = saveUp.value;

//Положение курсора на экране
let posX;
let posY;
let drawInMap = false;
let gameStop = false;
let clearMapBool = false;
let startGame = false;
//Массивы для поля
let Map;
let NewMap;

//цвета
const COLOR_BACKGROUND = "#000000";
let colorCell = colorInput.value;

window.onload = () =>{
    canvas.width = WIDHT;
    canvas.height = HEIGHT;
    
    document.getElementById('settings').hidden = true
    timeInterval = document.getElementById('speedSelect').value;
    contextCanvas.fillStyle = COLOR_BACKGROUND;
    contextCanvas.fillRect(0,0,WIDHT,HEIGHT);
    
}

const settingsOpen = () =>{
   if(openSeting) openSeting = false; else openSeting = true;

   if(openSeting) document.getElementById('settings').hidden = false
   if(!openSeting)document.getElementById('settings').hidden = true
}

//Событие изменения правил игры
burnTo.addEventListener("input", () =>{
    burnToValue = burnTo.value
}, false);

burnUp.addEventListener("input", () =>{
    burnUpValue = burnUp.value
}, false);

saveTo.addEventListener("input", () =>{
    saveToValue = saveTo.value
}, false);

saveUp.addEventListener("input", () =>{
    saveUpValue = saveUp.value
}, false);

const changePressetRuls = () =>{
    switch(pressetRuls.value){
        case "1": burnToValue = 3; burnUpValue = 3; saveToValue = 2; saveUpValue = 3; break;
        case "2": burnToValue = 3; burnUpValue = 3; saveToValue = 0; saveUpValue = 8; break;
        case "3": burnToValue = 5; burnUpValue = 8; saveToValue = 4; saveUpValue = 8; break;
        case "4": burnToValue = 1; burnUpValue = 1; saveToValue = 0; saveUpValue = 8; break;
        case "5": burnToValue = 2; burnUpValue = 2; saveToValue = 2; saveUpValue = 5; break;
    }
}

//Событие изменения скорости
const changeSelect = () =>{
    clearInterval(interval);
    timeInterval = document.getElementById('speedSelect').value;
    interval = setInterval(GameStep, Number(timeInterval));
}
//Событие изменения цвета клеток
colorInput.addEventListener("input" , () =>{
    clearInterval(interval);
    colorCell = colorInput.value;
    contextCanvas.fillStyle = colorCell;
    interval = setInterval(GameStep, timeInterval)
}, false);

//событие изменения resolution
resolutionInput.addEventListener("input", () => {
    clearInterval(interval);
    countGeneration = 0
    resolution = resolutionInput.value;
    widthMap = Math.floor(WIDHT / resolution);
    heightMap = Math.floor(HEIGHT / resolution);
    restartGame();
});

const StartGame = () =>{
    if(!startGame)restartGame();
    
    
    interval = setInterval(GameStep, timeInterval)
    if(gameStop) gameStop = false; else gameStop = true;

    
    if(gameStop && !startGame) gameStop = false;
    if(!gameStop) {document.getElementById('start').textContent = 'Стоп';interval = setInterval(GameStep, timeInterval)} else 
    {document.getElementById('start').textContent = 'Старт';clearInterval(interval);}

    contextCanvas.fillStyle = colorCell;
     
    document.getElementById('stop').textContent = 'Заново'
    startGame = true;
}

const restartGame = () =>{
    clearInterval(interval);
    Map = [widthMap * heightMap]
    NewMap = [widthMap * heightMap]
    StartLife()
    countGeneration = 0
    interval = setInterval(GameStep, timeInterval)
}

//Очистка поля
const clearMap = () =>{
    countGeneration = 0;
    for(y = 1; y < heightMap - 1; y++)
        for(x = 1; x < widthMap - 1; x++)
        Map[x + y * widthMap] = 0;
    interval = setInterval(GameStep, timeInterval)
    clearMapBool = true;
}


const Stop = () =>{
    clearInterval(interval);
    if(startGame) restartGame();

}

const StartLife = () =>{
    for(y = 1; y < heightMap - 1; y++)
        for(x = 1; x < widthMap - 1; x++)
            Map[x + y * widthMap] = Math.floor(Math.random() * 2) 
}

const PrintMap = () =>{
    contextCanvas.clearRect(0,0, WIDHT, HEIGHT)
    for(y = 0; y < heightMap - 1; y++)
        for(x = 0; x < widthMap - 1; x++)
        if(Map[x + y * widthMap] == 1)
            contextCanvas.fillRect(
            (x * resolution), 
            (y * resolution), 
            (resolution- 0.5), (resolution - 0.5) )  
    
}

const GameStep = () =>{
    
    if(!gameStop)NextGeneration()
    PrintMap()
    generationP.textContent = "Поколение: "+ countGeneration;

    if(clearMapBool){clearInterval(interval); clearMapBool = false; return}
    if(drawInMap){clearInterval(interval); drawInMap = false;}
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

                let keepAlive = Map[pos] == 1 && (buffer >= saveToValue && buffer <= saveUpValue);
                let makeNewLive = Map[pos] == 0 && (buffer >= burnToValue && buffer <= burnUpValue);
                NewMap[pos] = keepAlive | makeNewLive;
                
             }
    let temp = Map;
    Map = NewMap;
    NewMap = temp;
}
        
const bodyClick = (event) =>{
    posX = Math.floor(event.clientX / resolution)
    posY = Math.floor(event.clientY / resolution)
    
    AddRemoveCell(event.ctrlKey)
}


const AddRemoveCell = (add) =>{
    if(!add){
        Map[posX + posY * widthMap] = 1;
        if(gameStop){
            drawInMap = true;
            interval = setInterval(GameStep, timeInterval)}
       
    }else{
        Map[posX + posY * widthMap] = 0;
        if(gameStop){
            drawInMap = true;
            interval = setInterval(GameStep, timeInterval)}
    }
}




