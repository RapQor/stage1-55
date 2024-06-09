class car{
    isRunning = false

    constructor(model, type){
        this.model = model;
        this.type = type;
    }

    start(){
        this.isRunning = true
    }
    
    stop(){
        this.isRunning = false
    }

    getInfo(){
        return `${this.model} ${this.type}. Now Running is ${this.isRunning}`
    }
    
}

const carM = new car("Mercedes-Benz", "C200")
carM.model = "Honda"
carM.start()
console.log(carM.getInfo());