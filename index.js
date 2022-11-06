'use strict'
//Canvas
const canvas = document.getElementById('canvas');
const contextCanvas = canvas.getContext("2d");

//Цвет
const colorInput = document.getElementById('color');
let colorCell = colorInput.value;

let colorBodyInput = document.getElementById('colorBody')


//Разрешение
const resolutionInput = document.getElementById('resolution');

//Кол-во поколений
const generationP = document.getElementById('generation')

let resolution = resolutionInput.value;
//Размер игрового поля
const WIDHT = window.innerWidth;
const HEIGHT = window.innerHeight;

//Анимация
let requestFrameId;

//Размер игрового поля
let widthMap = Math.floor(WIDHT / resolution) + 2;
let heightMap = Math.floor(HEIGHT / resolution) + 2;

//Кол-во поколений
let countGeneration = 0;

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
//Флаги
let gameStop = false;
let startGame = false;
let openSeting = false;
let modeBrushes = true;

//Массивы для поля
let Map;
let NewMap;

//Скорость игры
let startTime = null, stepInMs = document.getElementById('speedSelect').value;

window.onload = () =>{
    canvas.width = WIDHT;
    canvas.height = HEIGHT;

    document.getElementById('body').style.backgroundColor = colorBodyInput.value;
    Map = new ArrayBuffer(widthMap * heightMap);
    NewMap = new ArrayBuffer(widthMap * heightMap);
}

const StartGame = () =>{
    if(!startGame){
        restartGame();
        document.getElementById('stop').textContent = 'Заново';
    }
    gameStop = gameStop ? false : true;

    if(gameStop && !startGame) gameStop = false;

    if(gameStop) {document.getElementById('start').textContent = 'Старт'; cancelAnimationFrame(requestFrameId);} else 
    {document.getElementById('start').textContent = 'Стоп'; requestFrameId = requestAnimationFrame(GameStep);}
    contextCanvas.fillStyle = colorCell;
    
    startGame = true;
}

const restartGame = () =>{
    
    Map = new ArrayBuffer(widthMap * heightMap);
    NewMap = new ArrayBuffer(widthMap * heightMap);
    StartLife()
    countGeneration = 0
}

//Очистка поля
const clearMap = () =>{
    countGeneration = 0;
    for(let y = 1; y < heightMap - 1; y++)
        for(let x = 1; x < widthMap - 1; x++)
        Map[x + y * widthMap] = 0;
    requestAnimationFrame(PrintRequstMap)
}

const Stop = () =>{
    if(startGame) restartGame();
}

//Заполнения игрового поля начальными значениями
const StartLife = () =>{
    for(let y = 1; y < heightMap - 1; y++)
        for(let x = 1; x < widthMap - 1; x++)
            Map[x + y * widthMap] = Math.floor(Math.random() * 2) 
}

//Отрисовка игры на Canvas
const PrintMap = () =>{
    contextCanvas.clearRect(0,0, WIDHT, HEIGHT)
    contextCanvas.beginPath()
    let sizePixel = resolution - resolution / 10;
    for(let y = 0; y < heightMap ; y++)
        for(let x = 0; x < widthMap ; x++)
        if(Map[x + y * widthMap] == 1)
            contextCanvas.rect(
            (x * resolution) - resolution / 1.4, 
            (y * resolution) - resolution / 1.4, 
            sizePixel, sizePixel )  
    contextCanvas.fill()
    contextCanvas.closePath()
}
let time = 0;

//По кадровая отрисовка игры
const GameStep = (timestamp) =>{
    const diff = timestamp - time;
    let progress;
    if (startTime === null) startTime = timestamp;
    progress = timestamp - startTime;

    if(progress > stepInMs){
        NextGeneration()
        
        PrintMap()
        
        startTime = timestamp
    }
    time = timestamp;
    generationP.textContent = "Поколение: "+ Math.floor(1000/ diff );
    requestFrameId = requestAnimationFrame(GameStep); 
}

//Обновление экрана игры
const PrintRequstMap = () =>{
    PrintMap();
}

//Вычисления нового поколения
const NextGeneration = () =>{
    
    countGeneration++;
    for(let y = 1; y < heightMap - 1; y++)
        for(let x = 1; x < widthMap - 1; x++){
            let pos = (x + y * widthMap)

            let buffer = Map[pos + 1];
                buffer+=Map[pos - 1];
                buffer+=Map[pos + widthMap]; 
                buffer+=Map[pos - widthMap];
                if(buffer < 4){
                    buffer+=Map[pos - widthMap - 1];
                    buffer+=Map[pos - widthMap + 1]; 
                    buffer+=Map[pos + widthMap + 1];
                    buffer+=Map[pos + widthMap - 1];
                }

                let keepAlive = Map[pos] == 1 && (buffer >= saveToValue && buffer <= saveUpValue);
                let makeNewLive = Map[pos] == 0 && (buffer >= burnToValue && buffer <= burnUpValue);
                NewMap[pos] = keepAlive | makeNewLive ? 1 : 0;
             }
    let temp = Map;
    Map = NewMap;
    NewMap = temp;
}

//Нажатие на body
 const bodyClick = (event) =>{
    posX = Math.round(event.clientX / resolution)
    posY = Math.round(event.clientY / resolution)
    //alert(`${event.clientX} ${event.layerX} ${event.pageX} ${event.screenX} ${event.x} ${event.altitudeAngle}`)
    if((posX != 0 && posY != 0) &&(posX != widthMap && posY != heightMap))AddRemoveCell(event.ctrlKey)
}  
//Добавление и удаления клеток
const AddRemoveCell = (add) =>{
    if(window.innerWidth <= 1200){
        if(modeBrushes){
            Map[posX + posY * widthMap] = 1;
            if(gameStop) requestAnimationFrame(PrintRequstMap)
        }else{
            Map[posX + posY * widthMap] = 0;
            if(gameStop) requestAnimationFrame(PrintRequstMap)
        }
    }else{
        if(!add){
            Map[posX + posY * widthMap] = 1;
            if(gameStop) requestAnimationFrame(PrintRequstMap)
           
        }else{
            Map[posX + posY * widthMap] = 0;
            if(gameStop) requestAnimationFrame(PrintRequstMap)
        }
    }

    
}