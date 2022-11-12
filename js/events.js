let settings = document.getElementById('settings');

let burnTo = document.getElementById('burnTo');
let burnUp = document.getElementById('burnUp');
let saveTo = document.getElementById('saveTo');
let saveUp = document.getElementById('saveUp');

let pressetRuls = document.getElementById('presset');
let okrRuls = document.getElementById('okrSelect')
//Режим кисти
let buttonBrushesMode = document.getElementById('brushes__btn')

//Реакци белоусова



//Событие изменения правил игры
burnTo.addEventListener("input", (event) =>{
    if(burnTo.value > 8 && Bivariate.neighborhood == 0){
        Bivariate.burnTo = 8;
        burnTo.value = 8;
    }
    if(burnTo.value < 8 && Bivariate.neighborhood == 0) Bivariate.burnTo = burnTo.value;

    if(burnTo.value > 4 && Bivariate.neighborhood == 1){
        Bivariate.burnTo = 4;
        burnTo.value = 4;
    }
    if(burnTo.value < 4 && Bivariate.neighborhood == 1) Bivariate.burnTo = burnTo.value;
    
    
}, false);

burnUp.addEventListener("input", () =>{
    if(burnUp.value > 8 && Bivariate.neighborhood == 0){
        Bivariate.burnUp = 8;
        burnUp.value = 8;
    }
    if(burnUp.value < 8 && Bivariate.neighborhood == 0) Bivariate.burnUp = burnUp.value;
    if(burnUp.value > 4 && Bivariate.neighborhood == 1){
        Bivariate.burnUp = 4;
        burnUp.value = 4;
    }
    if(burnUp.value < 4 && Bivariate.neighborhood == 1) Bivariate.burnUp = burnUp.value;
    
    
}, false);

saveTo.addEventListener("input", () =>{
    if(saveTo.value > 8 && Bivariate.neighborhood == 0){
        Bivariate.saveTo = 8;
        saveTo.value = 8;
    }
    if(saveTo.value < 8 && Bivariate.neighborhood == 0) Bivariate.saveTo = saveTo.value;
    if(saveTo.value > 4 && Bivariate.neighborhood == 1){
        Bivariate.saveTo = 4;
        saveTo.value = 4;
    }
    if(saveTo.value < 4 && Bivariate.neighborhood == 1) Bivariate.saveTo = saveTo.value;
}, false);

saveUp.addEventListener("input", () =>{
    if(saveUp.value > 8 && Bivariate.neighborhood == 0){
        Bivariate.saveUp = 8;
        saveUp.value = 8;
    }
    if(saveUp.value < 8 && Bivariate.neighborhood == 0) Bivariate.saveUp = saveUp.value;
    if(saveUp.value > 4 && Bivariate.neighborhood == 1){
        Bivariate.saveUp = 4;
        saveUp.value = 4;
    }
    if(saveUp.value < 4 && Bivariate.neighborhood == 1) Bivariate.saveUp = saveUp.value;
}, false);

const changePressetRuls = () =>{
    switch(pressetRuls.value){
        case "1": Bivariate.PressetChange(3, 3, 2, 3); burnTo.value = 3; burnUp.value = 3; saveTo.value = 2; saveUp.value = 3;  break;
        case "2": Bivariate.PressetChange(3, 3, 0, 8); burnTo.value = 3; burnUp.value = 3; saveTo.value = 0; saveUp.value = 8; break;
        case "3": Bivariate.PressetChange(5, 8, 4, 8); burnTo.value = 5; burnUp.value = 8; saveTo.value = 4; saveUp.value = 8; break;
        case "4": Bivariate.PressetChange(1, 1, 0, 8); burnTo.value = 1; burnUp.value = 1; saveTo.value = 0; saveUp.value = 8; break;
        case "5": Bivariate.PressetChange(2, 2, 2, 5); burnTo.value = 2; burnUp.value = 2; saveTo.value = 2; saveUp.value = 5; break;
    }
}

const ChangeOkr = () =>{
    console.log(okrRuls.value)
    if(okrRuls.value == 0) {
        Bivariate.neighborhood = 0;
        burnTo.max = 8;
        burnUp.max = 8;
        saveTo.max = 8;
        saveUp.max = 8;
        pressetRuls.style.pointerEvents = 'auto'
        pressetRuls.style.opacity = 1;

    } else {
        Bivariate.neighborhood = 1;
        burnTo.max = 4;
        burnUp.max = 4;
        saveTo.max = 4;
        saveUp.max = 4;
        pressetRuls.style.pointerEvents = 'none'
        pressetRuls.style.opacity = 0.5;
    }
}

//Событие изменения скорости
const changeSelect = () =>{
    if(document.getElementById('reactBelSetings').style.display == 'block')stepInMs = document.getElementById('speedSelect2').value; 
        else stepInMs = document.getElementById('speedSelect').value; 
}

//Событие изменения цвета клеток
colorInput.addEventListener("input" , () =>{
    colorCell = colorInput.value;
    let Color = toRGB(colorCell);
    colorRGB[0][0] = (1/255) * Color[0];
    colorRGB[0][1] = (1/255) * Color[1];
    colorRGB[0][2] = (1/255) * Color[2];
    requestAnimationFrame(PrintRequstMap)
}, false);

//Событие на изменения цвета фона
colorBodyInput.addEventListener("input", ()=>{
    document.getElementById('body').style.backgroundColor = colorBodyInput.value;
})


//событие изменения resolution
resolutionInput.addEventListener("input", () => {
    countGeneration = 0
    resolution = Number(resolutionInput.value);
    restartGame();
    requestAnimationFrame(PrintRequstMap)
});

resolutionInput2.addEventListener("input", () => {
    countGeneration = 0
    resolution = Number(resolutionInput2.value);

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

//Режим шага

const modeStepChecked = () =>{
    modeStepGame = document.getElementById('checkboxStep').checked;
    if(modeStepGame){
        document.getElementById('start').textContent = 'Шаг';
        document.getElementById('start').style.backgroundColor = "#d11544"
        cancelAnimationFrame(requestFrameId);
        gameStop = true;
    }else{
        document.getElementById('start').textContent = 'Стоп'; requestFrameId = requestAnimationFrame(GameStep);
        document.getElementById('start').style.backgroundColor = "#ffffff"
        gameStop = false;
    }
    
    
}


//Реакция белоусова
let heightSetings = '';
const reactBelchange = () =>{

    if(document.getElementById('reactBel').checked){
        Bivariate.ReactBelMode = true;
        restartGame();
        document.getElementById('showSetings').style.display = 'none';
        document.getElementById('reactBelSetings').style.display = 'block';
    }else{
        Bivariate.ReactBelMode = false;
        restartGame();
        document.getElementById('showSetings').style.display = 'block';
        document.getElementById('reactBelSetings').style.display = 'none';
    }
}

//Изменения цвет в реакции белоусова

colorCellOneInput.addEventListener("input", () =>{
    colorCellOne = colorCellOneInput.value;
    let Color = toRGB(colorCellOne);
    colorRGB[1][0] = (1/255) * Color[0];
    colorRGB[1][1] = (1/255) * Color[1];
    colorRGB[1][2] = (1/255) * Color[2];
    requestAnimationFrame(PrintRequstMap);
}, false)

colorCellTwoInput.addEventListener("input", () =>{
    colorCellTwo = colorCellTwoInput.value;
    let Color = toRGB(colorCellTwo);
    colorRGB[2][0] = (1/255) * Color[0];
    colorRGB[2][1] = (1/255) * Color[1];
    colorRGB[2][2] = (1/255) * Color[2];
    requestAnimationFrame(PrintRequstMap);
}, false)

colorCellThreeInput.addEventListener("input", () =>{
    colorCellThree = colorCellThreeInput.value;
    let Color = toRGB(colorCellThree);
    colorRGB[3][0] = (1/255) * Color[0];
    colorRGB[3][1] = (1/255) * Color[1];
    colorRGB[3][2] = (1/255) * Color[2];
    requestAnimationFrame(PrintRequstMap);
}, false)


