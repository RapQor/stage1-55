// ini adalah inisiasi cara pemanggilan package, yaitu express. untuk pemanggilan package lain caranya sama
// tinggal ganti nama sesuai yang mau di panggil

const express = require('express')

// ini variabel yang akan digunakan sebagai pengganti pemanggilan dari package express
const app = express()

const port = 5000

// ini adalah route atau jalur u/ pemanggilan sebuah fungsi
app.get('/home', function (req, res) {
    // ini fungsi untuk mendapatkan sebuah resault dari server
    res.send('Hello World')
})

app.get("/about", (req, res) => {
    res.send("Hello my name is RapQor")
})

app.get("/testimonial", (req, res) =>{
    res.json([
        {
            image:
            "https://banggaikep.go.id/portal/wp-content/uploads/2024/03/jokowi-1.jpg",
            content: "Ndak tau kok tanyak saya!?",
            author: "Joko Widodo",
            rating: 5,
        },
        {
            image:
            "https://library.sportingnews.com/styles/twitter_card_120x120/s3/2021-08/ronaldo-cropped_1jm2feotxjjx41uxa4pnnu68q1.jpg?itok=IvRTnN9V",
            content: "Waka waka ee",
            author: "Ronaldo Brazil",
            rating: 4,
        },
        {
            image:
            "https://asset-2.tstatic.net/style/foto/bank/images/ayah-rozak-jawab-cibiran-yang-sebut-dirinya-tukang-pamer-harta.jpg",
            content: "Ih anak gua mahhh canttiikk, udaahhh kaya",
            author: "Ayah Ojak",
            rating: 1,
        },
        {
            image:
            "https://asset-2.tstatic.net/sultra/foto/bank/images/Lucinta-Luna-setelah-operasi.jpg",
            content: "AKHhhdhakwdhwakdhkawhdkahk....",
            author: "Lucinta Dede Hidayat?",
            rating: 2,
        },
        {
            image:
            "https://assets.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/2023/04/24/Amanda-JKT48-mudik-ke-Malang-1666402919.jpg",
            content: "Warmindo Kuy, Warkop Bang Saykotsss",
            author: "Amanda Puspita JKT48",
            rating: 5,
        }
    ])
})







// berikut adalah inisiasi port
app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
});