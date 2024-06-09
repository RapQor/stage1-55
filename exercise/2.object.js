class Car{
    color = ""
    roda = ""
    merk = ""
    chasis = "deltabox"

    constructor(color, roda, merk, chasis){
        this.color = color
        this.roda = roda
        this.merk = merk
        this.chasis = chasis
    }

    getInfo(){
        return `Color: ${this.color}, Roda: ${this.roda}, Merk: ${this.merk}, Chasis: ${this.chasis}`;
    }
}

const car1 = new Car("merah", "4", "Honda", "elderframe");
const car2 = new Car("merah", "4", "Honda");
const car3 = new Car();
console.log(car1.getInfo());
console.log(car2.getInfo());
console.log(car3.getInfo());