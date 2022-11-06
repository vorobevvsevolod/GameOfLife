let settings = document.getElementById('settings');
//Режим кисти
let buttonBrushesMode = document.getElementById('brushes__btn')
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
    stepInMs = document.getElementById('speedSelect').value;
}

//Событие изменения цвета клеток
colorInput.addEventListener("input" , () =>{
    colorCell = colorInput.value;
    contextCanvas.fillStyle = colorCell;
    requestAnimationFrame(PrintRequstMap)
}, false);

//Событие на изменения цвета фона
colorBodyInput.addEventListener("input", ()=>{
    document.getElementById('body').style.backgroundColor = colorBodyInput.value;
})


//событие изменения resolution
resolutionInput.addEventListener("input", () => {
    countGeneration = 0
    resolution = resolutionInput.value;
    widthMap = Math.floor(WIDHT / resolution) + 2;
    heightMap = Math.floor(HEIGHT / resolution) + 2;

    restartGame();
    requestAnimationFrame(PrintRequstMap)
});

//Событие открытия настроек
const settingsOpen = () =>{

    if(openSeting) openSeting = false; else openSeting = true;
 
    if(openSeting) {
        settings.classList.remove("displayNone")
        settings.classList.remove("opacityNone")
        settings.classList.add("displayBlock")

        setTimeout(() =>{
            settings.classList.add("opacity")
        }, 5)
        
    }else{
        settings.classList.remove("displayBlock")
        settings.classList.remove("opacity")
        settings.classList.add("opacityNone")
        settings.classList.add("displayNone")
    }
 }

 //Событие нажатия на кнопку смены режима кисти

buttonBrushesMode.addEventListener("click", ()=>{
    modeBrushes = modeBrushes ? false : true;

    if(modeBrushes){ 
        buttonBrushesMode.style.border = "2.5px solid #2ff156"; 
        buttonBrushesMode.textContent = 'Рисование';
    }else{
        buttonBrushesMode.style.border = "2.5px solid #dce442";
        buttonBrushesMode.textContent = 'Стирание';
    }
})


