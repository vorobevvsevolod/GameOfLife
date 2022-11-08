'use strict'
//Canvas
const canvas = document.getElementById('canvas');
const contextCanvas = canvas.getContext('2d');

//Цвет
const colorInput = document.getElementById('color');
let colorCell = colorInput.value;

//Реакци белоусова

let colorCellOneInput = document.getElementById('colorCellOne');
let colorCellOne = colorCellOneInput.value;

let colorCellTwoInput = document.getElementById('colorCellTwo');
let colorCellTwo = colorCellTwoInput.value;

let colorCellThreeInput = document.getElementById('colorCellThree');
let colorCellThree = colorCellThreeInput.value;


let colorBodyInput = document.getElementById('colorBody')

//Разрешение
const resolutionInput = document.getElementById('resolution');
const resolutionInput2 = document.getElementById('resolution2');

//Кол-во поколений
const generationP = document.getElementById('generation')

let resolution = resolutionInput.value;
//Размер игрового поля
const WIDHT = window.innerWidth;
const HEIGHT = window.innerHeight;

//Анимация
let requestFrameId;


//Флаги
let gameStop = false;
let startGame = false;
let openSeting = false;
let modeBrushes = true;
let modeStepGame = false;

//Массивы для поля
let TwoGame;

//Скорость игры
let startTime = null, stepInMs = document.getElementById('speedSelect').value;

window.onload = () =>{ 
    canvas.width = WIDHT;
    canvas.height = HEIGHT;
    contextCanvas.fillStyle = colorCell;
    document.getElementById('body').style.backgroundColor = colorBodyInput.value;
}

const StartGame = () =>{
    if(!startGame){
        restartGame();
        document.getElementById('stop').textContent = 'Заново';
    }
    

    if(modeStepGame){
        requestAnimationFrame(GameStepMode)
    }else{
        gameStop = gameStop ? false : true;

        if(gameStop && !startGame) gameStop = false;
        if(gameStop) {document.getElementById('start').textContent = 'Старт'; cancelAnimationFrame(requestFrameId);} else 
        {document.getElementById('start').textContent = 'Стоп'; requestFrameId = requestAnimationFrame(GameStep);}
    }
    
    startGame = true;
}

const restartGame = () => {
    TwoGame = new Bivariate(Math.floor(WIDHT / resolution),Math.floor(HEIGHT / resolution));  
    requestAnimationFrame(PrintRequstMap);
}

//Очистка поля
const clearMap = () =>{
    TwoGame.Clear();
    requestAnimationFrame(PrintRequstMap);
}

const Stop = () =>{
    if(startGame) restartGame();
}


//Отрисовка игры на Canvas
const PrintMap = () =>{
    contextCanvas.clearRect(0,0, WIDHT, HEIGHT)

    let sizePixel = resolution - resolution / 10;
    if(!Bivariate.ReactBelMode){
        contextCanvas.beginPath()
        for(let y = 0; y < TwoGame.height; y++)
            for(let x = 0; x < TwoGame.width; x++)
            if(TwoGame.Map[x + y * TwoGame.width] == 1)
                contextCanvas.rect(
                (x * resolution) - resolution / 1.4, 
                (y * resolution) - resolution / 1.4, 
                sizePixel, sizePixel )  
        contextCanvas.fill()
        contextCanvas.closePath()
    }else{
        for(let y = 0; y < TwoGame.height; y++)
            for(let x = 0; x < TwoGame.width; x++){
                switch(TwoGame.Map[x + y * TwoGame.width]){
                    case 0:
                        break;

                    case 1: 
                    contextCanvas.fillStyle = colorCellTwo;
                    contextCanvas.fillRect((x * resolution) - resolution ,(y * resolution) - resolution, resolution, resolution );
                        break;

                    case 2: 
                    contextCanvas.fillStyle = colorCellThree;
                    contextCanvas.fillRect((x * resolution) - resolution ,(y * resolution) - resolution , resolution, resolution );
                        break;
                }
            }
    }
}
//let time = 0;

//По кадровая отрисовка игры
const GameStep = (timestamp) =>{
    //const diff = timestamp - time;
    let progress;
    if (startTime === null) startTime = timestamp;
    progress = timestamp - startTime;

    if(progress > stepInMs){
        TwoGame.NextGeneration()
        
        PrintMap()
        
        startTime = timestamp
    }
    //time = timestamp;
    generationP.textContent = "Поколение: "+ TwoGame.countGeneration;
    requestFrameId = requestAnimationFrame(GameStep); 
}

//Обновление экрана игры
const PrintRequstMap = () => PrintMap();

const GameStepMode = () =>{
    TwoGame.NextGeneration()
    PrintMap()
    generationP.textContent = "Поколение: "+ TwoGame.countGeneration;
}



//Нажатие на body
 const bodyClick = (event) =>{
    let posX = Math.round(event.clientX / resolution)
    let posY = Math.round(event.clientY / resolution)
    //alert(`${event.clientX} ${event.layerX} ${event.pageX} ${event.screenX} ${event.x} ${event.altitudeAngle}`)
    if(TwoGame != undefined){
        if((posX != 0 && posY != 0) &&(posX != TwoGame.width && posY !=TwoGame.height))AddRemoveCell(event.ctrlKey, posX, posY)
    }
    
}  
//Добавление и удаления клеток
const AddRemoveCell = (add, posX, posY) =>{
    if(window.innerWidth <= 1200){
        if(modeBrushes){
            TwoGame.AddCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(PrintRequstMap)
        }else{
            TwoGame.RemoveCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(PrintRequstMap)
        }
    }else{
        if(!add){
            console.log(add)
            TwoGame.AddCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(PrintRequstMap)
           
        }else{
            TwoGame.RemoveCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(PrintRequstMap)
        }
    }

    
}