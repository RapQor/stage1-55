const express = require('express');
const hbs = require("hbs");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);
const path = require("path");
const multer = require('multer');

const app = express();
const port = 5000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, 'src/views'));

hbs.registerPartials(path.join(__dirname, 'src/views/partials'));

app.use("/assets", express.static(path.join(__dirname, 'src/assets')));

app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/assets/img/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get("/", home);
app.get("/add_provinci", viewprovinci);
app.post("/add_provinci", upload.single('photo'), addprovinci);
app.get("/add_kabupaten", viewkabupaten);
app.post("/add_kabupaten", upload.single('photo'), addkabupaten);
app.get("/detail/:id", detail);
app.get("/detail-kab/:id", detailKab);

async function home(req, res) {
    const { filter } = req.query;
    let query = `
        SELECT
            provinci_tbs.id AS provinsi_id,
            provinci_tbs.nama AS provinsi_nama,
            provinci_tbs.diresmikan AS provinsi_diresmikan,
            provinci_tbs.photo AS provinsi_photo,
            provinci_tbs.pulau AS provinsi_pulau,
            kabupaten_tbs.id AS kabupaten_id,
            kabupaten_tbs.nama AS kabupaten_nama,
            kabupaten_tbs.provinsi_id AS kabupaten_provinsi_id,
            kabupaten_tbs.diresmikan AS kabupaten_diresmikan,
            kabupaten_tbs.photo AS kabupaten_photo
        FROM
            provinci_tbs
        LEFT JOIN
            kabupaten_tbs ON kabupaten_tbs.provinsi_id = provinci_tbs.id
    `;
    
    if (filter === '1') {
        query = `
            SELECT
                id AS provinsi_id,
                nama AS provinsi_nama,
                diresmikan AS provinsi_diresmikan,
                photo AS provinsi_photo,
                pulau AS provinsi_pulau
            FROM
                provinci_tbs
        `;
    } else if (filter === '2') {
        query = `
            SELECT
                kabupaten_tbs.id AS kabupaten_id,
                kabupaten_tbs.nama AS kabupaten_nama,
                kabupaten_tbs.provinsi_id AS kabupaten_provinsi_id,
                kabupaten_tbs.diresmikan AS kabupaten_diresmikan,
                kabupaten_tbs.photo AS kabupaten_photo,
                provinci_tbs.nama AS provinsi_nama
            FROM
                kabupaten_tbs
            LEFT JOIN
                provinci_tbs ON kabupaten_tbs.provinsi_id = provinci_tbs.id
        `;
    }

    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.render("index", { data: obj });
}

function viewprovinci(req, res) {
    res.render("add_provinci");
}

async function addprovinci(req, res) {
    let { nama, resmi, pulau } = req.body;
    const photo = req.file ? `/assets/img/${req.file.filename}` : '';

    const date = new Date();
    const dateString = date.toISOString().slice(0, 19).replace("T", " ");

    const query = `
        INSERT INTO "provinci_tbs"(nama, diresmikan, photo, pulau, "createdAt", "updatedAt")
        VALUES ('${nama}', '${resmi}', '${photo}', '${pulau}', '${dateString}', '${dateString}')
    `;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("/");
}

async function viewkabupaten(req, res) {
    const query = `SELECT id, nama FROM "provinci_tbs"`;
    const provinces = await sequelize.query(query, { type: QueryTypes.SELECT });

    res.render("add_kabupaten", { provinces });
}

async function addkabupaten(req, res) {
    let { nama, resmi, provinsi_id } = req.body;
    const photo = req.file ? `/assets/img/${req.file.filename}` : '';

    const date = new Date();
    const dateString = date.toISOString().slice(0, 19).replace("T", " ");

    const query = `
        INSERT INTO "kabupaten_tbs"(nama, diresmikan, photo, provinsi_id, "createdAt", "updatedAt")
        VALUES ('${nama}', '${resmi}', '${photo}', '${provinsi_id}', '${dateString}', '${dateString}')
    `;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("/");
}

async function detail(req, res) {
    const id = req.params.id;

    const query = `
        SELECT
            provinci_tbs.id AS provinsi_id,
            provinci_tbs.nama AS provinsi_nama,
            provinci_tbs.diresmikan AS provinsi_diresmikan,
            provinci_tbs.photo AS provinsi_photo,
            provinci_tbs.pulau AS provinsi_pulau,
            kabupaten_tbs.id AS kabupaten_id,
            kabupaten_tbs.nama AS kabupaten_nama,
            kabupaten_tbs.provinsi_id AS kabupaten_provinsi_id,
            kabupaten_tbs.diresmikan AS kabupaten_diresmikan,
            kabupaten_tbs.photo AS kabupaten_photo
        FROM
            provinci_tbs
        LEFT JOIN
            kabupaten_tbs ON kabupaten_tbs.provinsi_id = provinci_tbs.id
        WHERE
            provinci_tbs.id = :id;
    `;

    const obj = await sequelize.query(query, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });

    res.render("detail", { data: obj[0] });
}

async function detailKab(req, res) {
    const id = req.params.id;

    const query = `
        SELECT
            provinci_tbs.id AS provinsi_id,
            provinci_tbs.nama AS provinsi_nama,
            provinci_tbs.diresmikan AS provinsi_diresmikan,
            provinci_tbs.photo AS provinsi_photo,
            provinci_tbs.pulau AS provinsi_pulau,
            kabupaten_tbs.id AS kabupaten_id,
            kabupaten_tbs.nama AS kabupaten_nama,
            kabupaten_tbs.provinsi_id AS kabupaten_provinsi_id,
            kabupaten_tbs.diresmikan AS kabupaten_diresmikan,
            kabupaten_tbs.photo AS kabupaten_photo
        FROM
            kabupaten_tbs
        LEFT JOIN
            provinci_tbs ON provinci_tbs.id = kabupaten_tbs.provinsi_id
        WHERE
            kabupaten_tbs.id = :id;
    `;

    const obj = await sequelize.query(query, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });

    res.render("detail-kab", { data: obj[0] });
}

app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`);
});
