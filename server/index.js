var express = require("express");
var cors = require("cors");
var app = express();
const matchData = require("./controllers/replayData.controller");

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.options("*", cors()); // da includere prima delle altre routes
port = 8081;
var expressWs = require("express-ws")(app);

app.get("/", (req, res) => {
    res.send("App Works 8081");
});
require("./routes/ubies.routes")(app);

app.listen(port, () => {
    console.log(`Server listening on the port:${port}`);
});

app.ws("/replay/:id", matchData.findMatchCollectionAndSendData);

module.exports = app;
