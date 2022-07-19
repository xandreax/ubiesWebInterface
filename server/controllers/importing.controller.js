const axios = require("axios");
const {log} = require("console");

const urlMongoDBHandler = "http://localhost:4567";

//start registration
exports.start = (req, res) => {
    console.log(req.body.registration_id);
    if (!req.body.registration_id) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    log("sending start registration event");
    axios
        .post(urlMongoDBHandler + "/start", req.body.registration_id)
        .then((data) => {
            res.send(data);
            log("Sent mongoDb importer start signal");
        })
        .catch((err) => {
            console.log(err.message);
        });
};

// stop a registration
exports.stop = (req, res) => {
    log("sending stop registration event");
    axios
        .post(urlMongoDBHandler + "/stop")
        .then((data) => {
            res.send(data);
            log("Sent registration stop signal");
        })
        .catch((err) => {
            log(err.message);
        });
};

//check if a registration is ongoing
exports.check = (req, res) => {
    log("sending check registration event");
    axios
        .get(urlMongoDBHandler + "/status")
        .then((data) => {
            res.send(data);
            log("Sent registration status");
        })
        .catch((err) => {
            log(err.message);
        });
};
