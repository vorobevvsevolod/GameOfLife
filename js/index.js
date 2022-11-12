'use strict'
//Canvas
const canvas = document.getElementById('canvas');
const contextCanvas = canvas.getContext('webgl2', { premultipliedAlpha: false });

const gpu = new GPU({
    canvas,
    context: contextCanvas
});

//Цвет
let colorCellOneInput = document.getElementById('colorCellOne');
let colorCellOne = colorCellOneInput.value;

let colorCellTwoInput = document.getElementById('colorCellTwo');
let colorCellTwo = colorCellTwoInput.value;

let colorCellThreeInput = document.getElementById('colorCellThree');
let colorCellThree = colorCellThreeInput.value;

const colorInput = document.getElementById('color');
let colorCell = colorInput.value;

function toRGB(hex) {      
    return  hex.match(/[^#]./g).map(ff => parseInt(ff, 16));
  }

let colorRGB = [
    [(1/255) * 255,0,0],
    [(1/255) * 168, (1/255) * 31, (1/255) * 21],
    [(1/255) * 142, (1/255) * 88, (1/255) * 167],
    [(1/255) * 98,  (1/255) * 88,  (1/255) * 141]
];


let colorBodyInput = document.getElementById('colorBody')

//Разрешение
const resolutionInput = document.getElementById('resolution');
const resolutionInput2 = document.getElementById('resolution2');

//Кол-во поколений
const generationP = document.getElementById('generation')

let resolution = 1;
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
let draw = false;

//Массивы для поля
let TwoGame;

//Размер карты
let widthMap;
let heightMap;

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
    widthMap = Math.ceil(WIDHT / resolution) + 2;
    heightMap = Math.ceil(HEIGHT / resolution) + 2;
    TwoGame = new Bivariate(widthMap, heightMap);  
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

let time = 0;

//По кадровая отрисовка игры
const GameStep = (timestamp) =>{
    const diff = timestamp - time;
    let progress;
    if (startTime === null) startTime = timestamp;
    progress = timestamp - startTime;

    if(progress > stepInMs){
        TwoGame.NextGeneration()
        render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB);
        startTime = timestamp
    }
    time = timestamp;
    generationP.textContent = "Поколение: "+ Math.floor(1000/ diff);
    requestFrameId = requestAnimationFrame(GameStep); 
}

//Обновление экрана игры
const PrintRequstMap = () => {
    render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB)
};

const GameStepMode = () =>{
    TwoGame.NextGeneration()
    render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB);
    generationP.textContent = "Поколение: "+ TwoGame.countGeneration;
}

const render = gpu.createKernel(function(mas, wid, flag, size, color) {
    
    let x = Math.floor(this.thread.x / size);
    let y = Math.floor(this.thread.y / size);
    if(flag){
       if(mas[(x + 1) + (y + 1) * wid] == 0) this.color(color[1][0], color[1][1], color[1][2], 1);
       if(mas[(x + 1) + (y + 1) * wid] == 1) this.color(color[2][0], color[2][1], color[2][2], 1);
       if(mas[(x + 1) + (y + 1) * wid] == 2) this.color(color[3][0], color[3][1], color[3][2], 1);
    }else if(mas[(x + 1) + (y + 1) * wid] == 1){
        this.color(color[0][0], color[0][1], color[0][2], 1);
    }

}).setOutput([WIDHT, HEIGHT]).setGraphical(true);



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

            TwoGame.AddCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(PrintRequstMap)
           
        }else{
            TwoGame.RemoveCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(PrintRequstMap)
        }
    }  
}

//Нажатие на body
const bodyClick = (x, y) =>{
    if(!Bivariate.ReactBelMode){
        let posX =Math.ceil(x / resolution);
        let posY =TwoGame.height - Math.round(y / resolution) - 1;
        if(TwoGame != undefined)
            AddRemoveCell(event.ctrlKey, posX, posY);
    }
}  

canvas.addEventListener("mousemove", (event)=>{
    if(draw && window.innerWidth >= 400) bodyClick(event.clientX, event.clientY);
    
})

canvas.addEventListener("mousedown", ()=>{
    
    draw = true;
})

canvas.addEventListener("mouseup", ()=>{
    draw = false;
})

canvas.addEventListener("touchmove", (event)=>{
    bodyClick(event.touches[0].clientX, event.touches[0].clientY);
})

function bodyClickEvent(event){
bodyClick(event.clientX, event.clientY)
}


