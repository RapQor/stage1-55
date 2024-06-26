const express = require('express');
const hbs = require("hbs");
const bcrypt = require('bcrypt');
const session = require("express-session");
const flash = require("express-flash");
// const multer = require("multer")
const upload = require("./src/middleware/uploadFile")
const { Sequelize, QueryTypes } = require("sequelize")

const config = require("./config/config.json")

const sequelize = new Sequelize(config.development)

const path = require("path")

const app = express()
const port = 5000

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, 'src/views'))

hbs.registerPartials(path.join(__dirname, 'src/views/partials'))
hbs.registerHelper('calculateDuration', function(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return duration + ' days';
});

app.use("/assets", express.static(path.join(__dirname, 'src/assets')))

app.use(express.urlencoded({ extended: false }));

app.use(flash())
app.use(
    session({
        name: "data",
        secret: "rahasia",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        }
}))

app.get("/", home);

app.get("/myProject", myProject)
app.get("/add_myProject", viewproject);
app.post("/add_myProject", upload.single('photo'), addproject);
app.get("/myprojectdetail/:id", myProjectDetail);
app.get("/update-project/:id", editProjectDetail);
app.post("/update-project", updateProject);
app.post("/delete-project/:id", deleteProject);

app.get("/testimonial", testimonial)
app.get("/contact", contact)

app.get("/login", loginView)
app.post("/login", login)
app.get("/register", registerView)
app.post("/register", register)
app.get("/logout", logout)

async function home(req,res){
    const query = `SELECT * FROM "myProjects"`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})

    const isLogin = req.session.isLogin;
    const user = req.session.user;

    res.render("index", { user, isLogin , data: obj });
}

async function myProject(req,res){

    const query = `SELECT * FROM "myProjects"`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})
    const isLogin = req.session.isLogin
    const user = req.session.user;
    
    res.render("myProject", { data: obj, isLogin, user });
}

function testimonial(req,res){
    const isLogin = req.session.isLogin
    const user = req.session.user;
    res.render("testimonial", {isLogin,user});
}
function contact(req,res){
    const isLogin = req.session.isLogin
    const user = req.session.user;
    res.render("contact", {isLogin,user});
}

function viewproject(req, res) {
    const isLogin = req.session.isLogin
    const user = req.session.user;
    if(!isLogin){
        req.flash("notLoggedIn", "you need to be logged in to write a review")
        return res.redirect('/login')
    }
    res.render("add_myProject", {isLogin,user});
}

async function addproject(req, res) {
    let { projectName, startDate, endDate, description, nodeJs, reactJs, nextJs, typeScript } = req.body;
    const author = req.session.user.name;
    const photo = req.file ? req.file.filename : '';

    nodeJs = (nodeJs === undefined) ? false : true;
    nextJs = (nextJs === undefined) ? false : true;
    typeScript = (typeScript === undefined) ? false : true;
    reactJs = (reactJs === undefined) ? false : true;


    const date = new Date();
    const dateString = date.toISOString().slice(0, 19).replace("T", " ");

    console.log(photo);

    const query = `INSERT INTO "myProjects"("projectName", "startDate", "endDate", description, "nodeJs", "reactJs", "nextJs", "typeScript", photo, author, "createdAt", "updatedAt") VALUES ('${projectName}', '${startDate}', '${endDate}', '${description}', '${nodeJs}', '${reactJs}', '${nextJs}', '${typeScript}', '${photo}', '${author}','${dateString}','${dateString}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("myProject"); 
}
async function myProjectDetail(req, res) {
    const { id } = req.params;

    const query = `SELECT * FROM "myProjects" WHERE id='${id}'`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})
    const isLogin = req.session.isLogin
    const user = req.session.user;

    res.render("myProjectDetail", { detail:obj[0], isLogin, user });
}

async function editProjectDetail(req,res){
    const { id } = req.params;

    const query = `SELECT * FROM "myProjects" WHERE id=${id}`
    const obj = await sequelize.query(query, {type: QueryTypes.SELECT})
    const isLogin = req.session.isLogin
    const user = req.session.user;

    res.render("update-project", { data: obj[0], isLogin, user });
}

async function updateProject(req,res){
    let { projectName, startDate, endDate, description, nodeJs, reactJs, nextJs, typeScript, img, id } = req.body;

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
    "updatedAt"='${dateString}',
    "img"='${img}'
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

function loginView(req,res){
    res.render("login-form")
}

function registerView(req,res){
    res.render("register-form")
}


async function login (req,res){
    const {email, password} = req.body;
    const query = `SELECT * FROM "users" WHERE email='${email}'`
    const obj = await sequelize.query(query, { type:QueryTypes.SELECT })

    if(!obj.length){
        req.flash("danger", "Login Failed: Email is wrong")
        return res.redirect("/login")
    }

    bcrypt.compare(password, obj[0].password, (err, result) => {
        if (err) {
            req.flash("danger", "Login Failed: Internal Server Error");
            return res.redirect("/login");
        }
    
        if (!result) {
            req.flash("danger", "Login Failed: Password is wrong!");
            return res.redirect("/login");
        }
    
        req.flash("success", "Login Success!");
        req.session.isLogin = true;
        req.session.user = {
            name: obj[0].nama,
            email: obj[0].email
        };
    
        res.redirect("/");
    });
    
}   

async function register(req,res){
    const {nama, email, password} = req.body;
    const query = `SELECT * FROM "users" WHERE email='${email}'`
    // const obj = await sequelize.query(query, { type:QueryTypes.SELECT })

    // if(obj[0].lenght === 1){
    //     req.flash("danger", "Register Failed: Email Already Use");
    //     return res.redirect("/register")
    // }

    bcrypt.hash(password, 10, async(err, hash) => {
        if(err){
            req.flash("danger", "Register Failed: Password failed to be encryptions!")
            return res.redirect("/register")
        }

        const date = new Date();
        const dateString = date.toISOString().slice(0, 19).replace("T", " ");

        const query = `INSERT INTO "users"(nama, email, password, "createdAt", "updatedAt") VALUES('${nama}','${email}','${hash}','${dateString}','${dateString}')`
        await sequelize.query(query, { type:QueryTypes.INSERT });
        req.flash("success", "Register Success!")
        res.redirect("/login")
    })
}

function logout(req,res){
    req.session.destroy(err => {
        if(err){
            console.log(err)
        }
        res.redirect("/login")
    })
}

app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
});