const axios = require("axios");
const {log} = require("console");

const urlImporterKafka = "http://localhost:4567";

//start registration
exports.start = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    log(req.params.id);
    log("sending start registration event");
    axios
        .post(urlImporterKafka + "/start", req.params.id)
        .then((data) => {
            res.send(data);
            log("Sent importer start signal");
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
            log(err.message);
        });
};

// stop a registration
exports.stop = (req, res) => {
    log("sending stop registration event");
    axios
        .post(urlImporterKafka + "/stop")
        .then((data) => {
            res.send(data);
            log("Sent registration stop signal");
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
            log(err.message);
        });
};

//check if a registration is ongoing
exports.check = (req, res) => {
    log("sending check registration event");
    axios
        .get(urlImporterKafka + "/status")
        .then((data) => {
            res.send(data);
            log("Sent registration status");
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
            log(err.message);
        });
};
