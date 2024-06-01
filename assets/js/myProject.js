const formattedDates = {
    startDate: '',
    endDate: ''
};

const inputStart = document.getElementById("inputStart");
const inputEnd = document.getElementById("inputEnd");

inputStart.addEventListener("keyup", addSlash);
inputEnd.addEventListener("keyup", addSlash);

function onFormattedDatesUpdated() {
    console.log('Start Date:', formattedDates.startDate);
    console.log('End Date:', formattedDates.endDate);;
}

function addSlash(event) {
    const input = event.target;
    let inputValue = input.value;

    inputValue = inputValue.replace(/\D/g, '');

    if (inputValue.length >= 4 && inputValue.length < 6) {
        inputValue = inputValue.slice(0, 4) + '/' + inputValue.slice(4);
    } else if (inputValue.length >= 6) {
        inputValue = inputValue.slice(0, 4) + '/' + inputValue.slice(4, 6) + '/' + inputValue.slice(6, 8);

        const year = parseInt(inputValue.slice(0, 4));
        const month = parseInt(inputValue.slice(5, 7));
        const day = parseInt(inputValue.slice(8, 10));

        if (month > 12) {
            inputValue = inputValue.slice(0, 5) + '12';
        } else if (month < 1) {
            inputValue = inputValue.slice(0, 5) + '01';
        }

        const maxDaysInMonth = new Date(year, month, 0).getDate();
        if (day > maxDaysInMonth) {
            inputValue = inputValue.slice(0, 8) + maxDaysInMonth;
        }
    }

    input.value = inputValue;

    const formattedValue = inputValue.replace(/\//g, '');
    if (input.id === 'inputStart') {
        formattedDates.startDate = formattedValue;
    } else if (input.id === 'inputEnd') {
        formattedDates.endDate = formattedValue;
    }

    onFormattedDatesUpdated();
}

function onFormattedDatesUpdated() {
    useFormattedDates(formattedDates.startDate, formattedDates.endDate);
}

function useFormattedDates(startDate, endDate, startYear) {
    const mulai = startDate;
    const akhir = endDate;
    
    if (mulai && akhir) {
        const startYear = parseInt(mulai.slice(0, 4));
        const startMonth = parseInt(mulai.slice(4, 6)) - 1;
        const startDay = parseInt(mulai.slice(6, 8));

        const endYear = parseInt(akhir.slice(0, 4));
        const endMonth = parseInt(akhir.slice(4, 6)) - 1;
        const endDay = parseInt(akhir.slice(6, 8));

        const start = new Date(startYear, startMonth, startDay);
        const end = new Date(endYear, endMonth, endDay);

        let diffYears = endYear - startYear;
        let diffMonths = endMonth - startMonth;
        let diffDays = endDay - startDay;

        if (diffDays < 0) {
            diffMonths -= 1;
            diffDays += new Date(endYear, endMonth, 0).getDate();
        }

        if (diffMonths < 0) {
            diffYears -= 1;
            diffMonths += 12;
        }

        
        return { years: diffYears, months: diffMonths, days: diffDays, tahuns: startYear};
    } else {
        console.log('Tanggal mulai dan/atau akhir belum diisi dengan benar.');
        return null;
    }
}

const selisihTanggal = useFormattedDates(formattedDates.startDate, formattedDates.endDate);

// if (startYear !== null) {
//     console.log('Start Year:', startYear);
// } else {
//     console.log('Tanggal mulai dan/atau akhir belum diisi dengan benar.');
// }


let dataBlog = [];

function submitBlog(event){
    event.preventDefault();
    let inputTitle = document.getElementById("inputTitle").value
    let inputStart = document.getElementById("inputStart").value;
    let inputEnd = document.getElementById("inputEnd").value;
    let inputDescription = document.getElementById("inputDescription").value
    const nodeJs = document.getElementById("nodeJs").checked
    const reactJs = document.getElementById("reactJs").checked
    const nextJs = document.getElementById("nextJs").checked
    const typeScript = document.getElementById("typeScript").checked
    let inputImage = document.getElementById("inputImage").files

    if (inputTitle == ""){
        alert("Title harus diisi")
    }else if(inputStart == "" && inputEnd == ""){
        alert("Time harus diisi")
    }else if(inputDescription == ""){
        alert("Description harus diisi")
    }else if(nodeJs == false && reactJs == false && nextJs == false && typeScript == false){
        alert("Technologies harus diisi")
    }else{
        alert("File harus diisi")
    }
    
    inputImage = URL.createObjectURL(inputImage[0]);

    const blog = {
        projectname: inputTitle,
        selisih_days: selisihTanggal.days,
        selisih_months: selisihTanggal.months,
        selisih_years: selisihTanggal.years,
        tahun: "2020",
        description: inputDescription,
        image: inputImage,
        nodejs: nodeJs,
        reactjs: reactJs,
        nextjs: nextJs,
        typescript: typeScript,
    };

    dataBlog.push(blog);
    console.log("dataArray:" + dataBlog);
    renderBlog();
}

function renderBlog() {
    document.getElementById("content").innerHTML = "";
    for (let index = 0; index < dataBlog.length; index++) {
        document.getElementById("content").innerHTML += `
        <div class="blog-list">
            <div class="blog-list-items">
                <div class="blog-image">
                    <img src="${dataBlog[index].image}" alt="image upload" />
                </div>
                <div class="blog-content">
                    <h1>${dataBlog[index].projectname} - ${dataBlog[index].tahun}</h1>
                    <p>durasi: ${dataBlog[index].selisih_years} Tahun, ${dataBlog[index].selisih_months} Bulan, ${dataBlog[index].selisih_days} Hari</p>
                    <p>${dataBlog[index].description}</p>
                    <div class="languages">
                        ${dataBlog[index].nodejs ? "<img src=\"/Day5/assets/img/nodejs.png\" alt=\"Node.js\"/>" : ""}
                        ${dataBlog[index].reactjs ? "<img src=\"/Day5/assets/img/developer.png\" alt=\"React\"/>" : ""}
                        ${dataBlog[index].nextjs ? "<img src=\"/Day5/assets/img/next.png\" alt='Next.js'/>" : ""}
                        ${dataBlog[index].typescript ? "<img src=\"/Day5/assets/img/typescript.png\" alt=\"TypeScript\"/>" : ""}
                    </div>
                    <div class="btn-group">
                        <button class="btn-edit">Edit</button>
                        <button class="btn-delete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}


setInterval(function () {
    renderBlog();
}, 1000);