class Bivariate{
    Map;
    NewMap;
    width;
    height;
    countGeneration = 0;

    static ReactBelMode = false;
    static neighborhood = 0;
    static saveTo = 2;
    static saveUp = 3;
    static burnTo = 3;
    static burnUp = 3;
    

    constructor(width, height){
        this.width = width ;
        this.height = height;
        this.Map = new Uint8ClampedArray(width * height);
        this.NewMap = new Uint8ClampedArray(width * height);
        
        if(!Bivariate.ReactBelMode)this.StartLife(); else this.StartLifeBel();
    }
//Прессеты
static PressetChange(burnToValue, burnUpValue, saveToValue, saveUpValue){
    Bivariate.saveTo = saveToValue; 
    Bivariate.saveUp = saveUpValue; 
    Bivariate.burnTo = burnToValue; 
    Bivariate.burnUp = burnUpValue; 
}

//Заполнения игрового поля начальными значениями обычная
    StartLife = () =>{
        this.countGeneration = 0;
        for(let y = 1; y < this.height - 1; y++)
            for(let x = 1; x < this.width - 1; x++)
                this.Map[x + y * this.width] = Math.floor(Math.random() * 2) 
    }

//Реакция Белоусова

    StartLifeBel(){
        this.countGeneration = 0;
        for(let y = 1; y < this.height - 1; y++)
            for(let x = 1; x < this.width - 1; x++)
                this.Map[x + y * this.width] = Math.floor(Math.random() * 3) 
    }

//Вычисления нового поколения
    NextGeneration = () =>{
    this.countGeneration++;
    if(!Bivariate.ReactBelMode){
        for(let y = 1; y < this.height - 1; y++)
        for(let x = 1; x < this.width - 1; x++){
            let pos = (x + y * this.width)

            let buffer =  this.Map[pos + 1];
                buffer += this.Map[pos - 1];
                buffer += this.Map[pos + this.width]; 
                buffer += this.Map[pos - this.width];

                if(buffer < 4 && Bivariate.neighborhood == 0){
                    buffer += this.Map[pos - this.width - 1];
                    buffer += this.Map[pos - this.width + 1]; 
                    buffer += this.Map[pos + this.width + 1];
                    buffer += this.Map[pos + this.width - 1];
                }

                let keepAlive = this.Map[pos] == 1 && (buffer >= Bivariate.saveTo && buffer <= Bivariate.saveUp);
                let makeNewLive = this.Map[pos] == 0 && (buffer >= Bivariate.burnTo && buffer <= Bivariate.burnUp);
                this.NewMap[pos] = keepAlive | makeNewLive ? 1 : 0;
             }
    }else{
        for(let y = 1; y < this.height - 1; y++)
            for(let x = 1; x < this.width - 1; x++){
                let pos = (x + y * this.width)

                switch(this.Map[pos]){
                    case 0: this.Сalculations(1, pos); break;
                    case 1: this.Сalculations(2, pos); break;
                    case 2: this.Сalculations(0, pos); break;
                }
            }
    }
   
    let temp = this.Map;
    this.Map = this.NewMap;
    this.NewMap = temp;
}

 Сalculations (cellFound, pos){
    let count = 0;
    if(this.Map[pos + 1] == cellFound) count++;
    if(this.Map[pos - 1] == cellFound) count++;
    if(this.Map[pos + this.width] == cellFound) count++;
    if(this.Map[pos - this.width] == cellFound) count++;

    if(this.Map[pos - this.width - 1] == cellFound) count++;
    if(this.Map[pos - this.width + 1] == cellFound) count++;
    if(this.Map[pos + this.width + 1] == cellFound) count++;
    if(this.Map[pos + this.width - 1] == cellFound) count++;
    
    if(count >= 3) this.NewMap[pos] = cellFound; else this.NewMap[pos] = this.Map[pos];
}

//Добавление клетки на в массив
    AddCellMap = (x,y) => this.Map[x + y * this.width] = 1;
    

//Удаление клетки на в массив
    RemoveCellMap = (x,y) => this.Map[x + y * this.width] = 0;

//Очистка поля
Clear(){
    this.countGeneration = 0;
    for(let y = 1; y < this.height - 1; y++)
        for(let x = 1; x < this.width - 1; x++)
            this.Map[x + y * this.width] = 0; 
}

}