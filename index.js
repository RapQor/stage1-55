const express = require('express')
const hbs = require("hbs")

const { Sequelize, QueryTypes } = require("sequelize")

const config = require("./config/config.json")

const sequelize = new Sequelize(config.development)

const path = require("path")
const { type } = require('os')

const app = express()
const port = 5000

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, 'src/views'))

// hbs.registerPartials(path.join(__dirname, 'src/views/partials'));
hbs.registerPartials(path.join(__dirname, 'src/views/partials'))

// Register helper for duration calculation
hbs.registerHelper('calculateDuration', function(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return duration + ' days';
});

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

async function home(req,res){
    const query = `SELECT * FROM "myProjects"`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})

    res.render("index", {data: obj});
}

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return `${diffDays} days`;
}

async function myProject(req,res){

    const query = `SELECT * FROM "myProjects"`
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
    let { projectName, startDate, endDate, description, nodeJs, reactJs, nextJs, typeScript } = req.body;

    nodeJs = (nodeJs === undefined) ? false : true;
    nextJs = (nextJs === undefined) ? false : true;
    typeScript = (typeScript === undefined) ? false : true;
    reactJs = (reactJs === undefined) ? false : true;


    const date = new Date();
    const dateString = date.toISOString().slice(0, 19).replace("T", " ");

    const query = `INSERT INTO "myProjects"("projectName", "startDate", "endDate", description, "nodeJs", "reactJs", "nextJs", "typeScript", "createdAt", "updatedAt") VALUES ('${projectName}', '${startDate}', '${endDate}', '${description}', '${nodeJs}', '${reactJs}', '${nextJs}', '${typeScript}','${dateString}','${dateString}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("myProject"); 
}
async function myProjectDetail(req, res) {
    const { id } = req.params;

    const query = `SELECT * FROM "myProjects" WHERE id='${id}'`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})

    res.render("myProjectDetail", { detail:obj[0] });
}

async function editProjectDetail(req,res){
    const { id } = req.params;

    const query = `SELECT * FROM "myProjects" WHERE id=${id}`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})

    res.render("update-project", { data: obj[0] });
}

async function updateProject(req,res){
    let { projectName, startDate, endDate, description, nodeJs, reactJs, nextJs, typeScript, id } = req.body;

    // Convert checkbox values to boolean
    const nodeJsBoolean = nodeJs === 'on';
    const reactJsBoolean = reactJs === 'on';
    const nextJsBoolean = nextJs === 'on';
    const typeScriptBoolean = typeScript === 'on';
    
    const date = new Date();
    const dateString = date.toISOString().slice(0, 19).replace("T", " ");

    const query = `
    UPDATE "myProjects" SET
    "projectName"='${projectName}',
    "startDate"='${startDate}',
    "endDate"='${endDate}',
    "description"='${description}',
    "nodeJs"=${nodeJsBoolean},
    "reactJs"=${reactJsBoolean},
    "nextJs"=${nextJsBoolean},
    "typeScript"=${typeScriptBoolean},
    "updatedAt"='${dateString}'
    WHERE id=${id}
`;

    await sequelize.query(query, { type: QueryTypes.UPDATE });

    res.redirect("/myProject");
}

async function deleteProject(req, res) {
    const { id } = req.params;
    const query = `DELETE FROM "myProjects" WHERE id=${id}`
    await sequelize.query(query, { type: QueryTypes.DELETE });

    res.redirect("/myProject");
}

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return `${diffDays} days`;
}

const durasi = 

app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
});