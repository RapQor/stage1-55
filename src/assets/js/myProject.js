const formattedDates = {
    startDate: '',
    endDate: ''
};

function getFullTime(tanggal) {
    const monthList = [
        "January",
        "Febuari",
        "Maret",
        "Apr",
        "Meiiii",
        "Juni",
        "Juli",
        "Augustus",
        "Sep",
        "Okt",
        "Nov",
        "Desember",
];

    const date = tanggal.getDate();
    const month = tanggal.getMonth();
    const year = tanggal.getFullYear();
    let hours = tanggal.getHours();
    let minutes = tanggal.getMinutes();

    if (hours <= 9) {
        hours = "0" + hours;
    }

    // ketika ditampilkan yang tadinya 8:45, menjadi 08:45

    // jam 10:00
    // jam 07:00
    // jam 06:00

    if (minutes <= 9) {
        minutes = "0" + minutes;
    }

    return `${date} ${monthList[month]} ${year} ${hours}:${minutes}`;
}

const inputStart = document.getElementById("inputStart");
const inputEnd = document.getElementById("inputEnd");

inputStart.addEventListener("keyup", addSlash);
inputEnd.addEventListener("keyup", addSlash);

function onFormattedDatesUpdated() {
    useFormattedDates(formattedDates.startDate, formattedDates.endDate);
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

function useFormattedDates(startDate, endDate) {
    if (startDate && endDate) {
        const startYear = parseInt(startDate.slice(0, 4));
        const startMonth = parseInt(startDate.slice(4, 6)) - 1;
        const startDay = parseInt(startDate.slice(6, 8));

        const endYear = parseInt(endDate.slice(0, 4));
        const endMonth = parseInt(endDate.slice(4, 6)) - 1;
        const endDay = parseInt(endDate.slice(6, 8));

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

        return { years: diffYears, months: diffMonths, days: diffDays, tahuns: startYear, tanggals: startDate };
    } else {
        console.log('Tanggal mulai dan/atau akhir belum diisi dengan benar.');
        return null;
    }
}

let selisihTanggal = useFormattedDates(formattedDates.startDate, formattedDates.endDate);

let dataBlog = [];

function submitBlog(event) {
    event.preventDefault();
    let inputTitle = document.getElementById("inputTitle").value;
    let inputStart = document.getElementById("inputStart").value;
    let inputEnd = document.getElementById("inputEnd").value;
    let inputDescription = document.getElementById("inputDescription").value;
    const nodeJs = document.getElementById("nodeJs").checked;
    const reactJs = document.getElementById("reactJs").checked;
    const nextJs = document.getElementById("nextJs").checked;
    const typeScript = document.getElementById("typeScript").checked;
    let inputImage = document.getElementById("inputImage").files;

    if (!inputTitle) {
        alert("Title harus diisi");
    } else if (!inputStart || !inputEnd) {
        alert("Time harus diisi");
    } else if (!inputDescription) {
        alert("Description harus diisi");
    } else if (!nodeJs && !reactJs && !nextJs && !typeScript) {
        alert("Technologies harus diisi");
    } else if (!inputImage.length) {
        alert("File harus diisi");
    } else {
        inputImage = URL.createObjectURL(inputImage[0]);

        selisihTanggal = useFormattedDates(formattedDates.startDate, formattedDates.endDate);

        if (selisihTanggal) {
            const blog = {
                projectname: inputTitle,
                selisih_years: selisihTanggal.years,
                selisih_months: selisihTanggal.months,
                selisih_days: selisihTanggal.days,
                tanggal: selisihTanggal.tanggals,
                tahun: selisihTanggal.tahuns,
                description: inputDescription,
                image: inputImage,
                nodejs: nodeJs,
                reactjs: reactJs,
                nextjs: nextJs,
                typescript: typeScript,
                postAt: new Date(),
            };

            dataBlog.push(blog);
            console.log("dataArray:", dataBlog);
            renderBlog();
        } else {
            alert("Tanggal mulai dan/atau akhir belum diisi dengan benar.");
        }
    }
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
                    <a href="myProjectDetail.html" target="_black">
                    <h1>${dataBlog[index].projectname} - ${dataBlog[index].tahun}</h1>
                    </a>
                    
                    <p>durasi: ${dataBlog[index].selisih_years} Tahun, ${dataBlog[index].selisih_months} Bulan, ${dataBlog[index].selisih_days} Hari</p>
                    <p>${dataBlog[index].description}</p>
                    <div class="languages">
                        ${dataBlog[index].nodejs ? "<img src=\"./assets/img/nodejs.png\" alt=\"Node.js\"/>" : ""}
                        ${dataBlog[index].reactjs ? "<img src=\"./assets/img/developer.png\" alt=\"React\"/>" : ""}
                        ${dataBlog[index].nextjs ? "<img src=\"./assets/img/next.png\" alt='Next.js'/>" : ""}
                        ${dataBlog[index].typescript ? "<img src=\"./assets/img/typescript.png\" alt=\"TypeScript\"/>" : ""}
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

document.getElementById("submitBlogForm").addEventListener("submit", submitBlog);

