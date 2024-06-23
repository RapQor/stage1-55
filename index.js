const express = require('express')
const path = require("path")

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
function myProject(req,res){
    res.render("myProject", {data});
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

function addproject(req, res) {
    const { projectname, description, tanggal , tanggalEnd, nodeJs, reactJs, nextJs, typeScript} = req.body;

    // console.log("Title :", projectname);
    // console.log("content :", description);
    // console.log("Date: ", tanggal);

    const dataBlog = { projectname, description, tanggal, tanggalEnd, nodeJs, reactJs, nextJs, typeScript };

    const uwu = data.unshift(dataBlog);

    console.log(uwu);

    res.redirect("myProject"); 
}
function myProjectDetail(req, res) {
    const { id } = req.params;

    const detail = data[id];

    res.render("myProjectDetail", { detail });
}

function editProjectDetail(req,res){
    const { id } = req.params;

    const datafilter = data[parseInt(id)];
    datafilter.id = parseInt(id);

    res.render("update-project", { data: datafilter });
}

function updateProject(req,res){
    const { projectname, description, tanggal, tanggalEnd, id } = req.body;
    
    data[parseInt(id)] = {
        projectname,
        description,
        tanggal,
        tanggalEnd,
    };

    res.redirect("/myProject");
}

function deleteProject(req, res) {
    const { id } = req.params;

    data.splice(id, 1);

    res.redirect("/myProject");
}


app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
});