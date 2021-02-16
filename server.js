/* Express to run server and routes */
const express = require('express');

/* Start up an instance of app */
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

/* Initialize the main project folder*/
app.use(express.static(__dirname + '/website'));

const port = 3000;
/* Spin up the server*/
const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

/* project data object,
- acts as API endpoint */
var projectData = [];

/* GET Route 
- returns latest entry of the journal */
app.get("/entry", getEntry)

/* GET Route 
- returns all entries of the journal */
app.get("/all", getAll)

/* POST Route 
- add entry to project endpoint */
app.post('/entry', addEntry);

/* Functions to handle endpoints */
function getAll(req, res) {
    res.send(projectData);
}
function getEntry(req, res) {
    res.send(projectData.pop());
}
function addEntry(req, res) {
    projectData.push(req.body);
};