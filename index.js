const express = require('express')

const { Sequelize, QueryTypes } = require("sequelize")

const config = require("./config/config.json")

const sequelize = new Sequelize(config.development)

const path = require("path")
const { type } = require('os')

const app = express()
const port = 5000

const data = [];

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, 'src/views'))

app.use("/assets", express.static(path.join(__dirname, 'src/assets')))

app.use(express.urlencoded({ extended: false }));

app.get("/", home);

app.get("/myProject", myProject)
app.get("/add_myProject", viewproject);
app.post("/add_myProject", addproject);
app.get("/myprojectdetail/:id", myProjectDetail);
app.get("/update-project/:id", editProjectDetail);
app.post("/update-project", updateProject);
app.post("/delete-project/:id", deleteProject);

app.get("/testimonial", testimonial)
app.get("/contact", contact)

function home(req,res){
    res.render("index");
}

async function myProject(req,res){

    const query = `SELECT * FROM "myProject"`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})

    
    res.render("myProject", {data: obj});
}

function testimonial(req,res){
    res.render("testimonial");
}
function contact(req,res){
    res.render("contact");
}

function viewproject(req, res) {
    res.render("add_myProject");
}

async function addproject(req, res) {
    const { projectName, description } = req.body;

    const date = new Date();
    const dateString = date.toISOString().slice(0, 19).replace("T", " ");

    const query = `INSERT INTO "myProject"("projectName", description, "createdAt", "updatedAt") VALUES ('${projectName}', '${description}','${dateString}','${dateString}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("myProject"); 
}
async function myProjectDetail(req, res) {
    const { id } = req.params;

    const query = `SELECT * FROM "myProject" WHERE id='${id}'`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})

    res.render("myProjectDetail", { detail:obj[0] });
}

async function editProjectDetail(req,res){
    const { id } = req.params;

    const query = `SELECT * FROM "myProject" WHERE id=${id}`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})

    res.render("update-project", { data: obj[0] });
}

async function updateProject(req,res){
    const { projectName, description, id } = req.body;
    
    const date = new Date();
    const dateString = date.toISOString().slice(0, 19).replace("T", " ");

    const query = `UPDATE "myProject" SET "projectName"='${projectName}',description='${description}',"createdAt"='${dateString}',"updatedAt"='${dateString}' WHERE id=${id}`;
    await sequelize.query(query, { type: QueryTypes.UPDATE });

    res.redirect("/myProject");
}

async function deleteProject(req, res) {
    const { id } = req.params;
    const query = `DELETE FROM "myProject" WHERE id=${id}`
    await sequelize.query(query, { type: QueryTypes.DELETE });

    res.redirect("/myProject");
}


app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
});