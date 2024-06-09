class car{
    model = ""
    type = ""

    constructor(model, type){
        this.model = model;
        this.type = type;
    }

    drive(){
        return `This car is model ${this.model}, with type ${this.type}`
    }
    
}

class electricCar extends car{
    constructor(model, type, batteryCapacity){
        super(model, type);
        this.batteryCapacity = batteryCapacity;
    }

    getInfo(){
        return `${super.drive()}, It has battery Capacity ${this.batteryCapacity}`
    }
    
    
}

class obama extends electricCar{
    driveObama(){
        return `ini dari obama yang extend dari electric car ${super.getInfo()}`
    }
}

const car1 = new car("Toyota", "Innova Zenix")
const electricCar1 = new electricCar("Tesla", "Model-3", "50KwH")
const obama1 = new obama("Nissan", "350Z", "2000cc")

console.log(car1.drive());
console.log(electricCar1.getInfo());
console.log(obama1.driveObama());