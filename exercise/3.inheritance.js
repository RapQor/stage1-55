class car{
    model = ""
    type = ""

    constructor(model, type){
        this.model = model;
        this.type = type;
    }

    getInfo(){
        return `This car is model ${this.model}, with type ${this.type}`
    }
    
}

class electricCar extends car{
    constructor(model, type, batteryCapacity){
        super(model, type);
        this.batteryCapacity = batteryCapacity;
    }

    getInfo(){
        return `${super.getInfo()}, It has battery Capacity ${this.batteryCapacity}`
    }
    
    
}

const car1 = new electricCar("Tesla", "MOdel-3", "20 KWH")
console.log(car1.getInfo());
console.log(car1);
