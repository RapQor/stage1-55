class car{
    color = ""
    roda = ""
    merk = ""
    chasis = ""

    constructor(color, roda, merk, chasis){
        this.color = color
        this.roda = roda
        this.merk = merk
        this.chasis = chasis
    }

    getInfo(){
        return `This car have ${this.color}, roda ${this.roda}, ${this.merk}, ${this.chasis}`;
    }
}