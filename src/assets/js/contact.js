function submitData () {
    const inputName = document.getElementById("inputName").value
    const inputEmail = document.getElementById("inputEmail").value
    const inputNumber = document.getElementById("inputNumber").value
    const inputSubject = document.getElementById("inputSubject").value
    const inputMassage = document.getElementById("inputMassage").value

    if(inputName == ""){
        alert("You must fill your name")
    } else if(inputEmail == ""){
        alert("You must fill your email")
    } else if(inputNumber == ""){
        alert("You must fill your Phone Number")
    } else if(inputSubject == ""){
        alert("You must fill your Subject")
    } else if(inputMassage == ""){
        alert("You must fill your Massage")
    } else{
        alert("Done")
    }

    console.log(`Name : ${inputName}\nEmail : ${inputEmail}\nNumber : ${inputNumber}\nSubject : ${inputSubject}\nMassage : ${inputMassage}`);

    const myMail = "rafi.abqor@gmail.com";
    
    let a = document.createElement("a");
    a.href = `mailto:${myMail}?subject=${inputSubject}&body=Hello My Name is ${inputName}.\nMy Number is ${inputNumber}, and this is my massage : ${inputMassage}`;
    a.click();   
}



