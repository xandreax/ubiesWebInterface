const {log} = require("console");
const models = require("../db/clientCassandra");

//create and save new Metadata
exports.create = async (req, res) => {
    log("start saving new metadata");
    const reqMetadata = req.body.valueOf();
    let metadata = new models.instance.Metadata({
        name_registration: reqMetadata.name_registration,
        registration_id: reqMetadata.registration_id,
        length_court: reqMetadata.length_court,
        width_court: reqMetadata.width_court,
        timestamp: reqMetadata.timestamp,
        end_registration_timestamp: models.datatypes.unset,
        squads: {
            "teams": reqMetadata.squads.teams,
            "players": reqMetadata.squads.players
        },
    });
    metadata.save(function (err) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);
        } else {
            log("metadata saved into Matches");
            res.status(200).send({message: "metadata saved into Matches"});
        }
    })
};

// Retrieve all registrations metadata from the database.
exports.findAll = async (req, res) => {
    log("start retriving all metadata");
    models.instance.Metadata.find({}, function (err, metadata) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);
        } else {
            log("found all metadata!");
            res.send(metadata);
        }
    })
};

// Update a metadata in matches metadata collection
exports.update = async (req, res) => {
    const metadata = req.body.valueOf();
    log("start updating metadata");
    let filter = {registration_id: metadata.registration_id};
    let updateMetadata = {
        name_registration: metadata.name_registration,
        length_court: metadata.length_court,
        width_court: metadata.width_court,
        squads: {
            "teams": metadata.squads.teams,
            "players": metadata.squads.players
        }
    };
    models.instance.Metadata.update(filter, updateMetadata, function (err) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);

        } else {
            log("Metadata updated");
            res.send({message: "Metadata updated"});
        }
    });
};

// Delete a Metadata from matches collection and delete all match data
exports.delete = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    log(req.params.id);
    log("start deleting Metadata");
    const query = {registration_id: req.params.id};
    //delete metadata
    models.instance.Metadata.delete(query, function (err) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);
        } else {
            log("Metadata deleted");
        }
    });
    //delete reg_data
    models.instance.RegData.delete(query, function (err) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);
        } else {
            log("Reg_data deleted");
        }
    });
    //delete config_data
    models.instance.ConfigData.delete(query, function (err) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);
        } else {
            log("Config_data deleted");
            res.status(200).send({message: "all data deleted"});
        }
    });
};

//add end timestamp of the registration
exports.addEndTimestamp = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    let date = req.body.end_timestamp;
    log("date:" + date);
    const filter = {registration_id: req.params.id};
    const update = {
        end_registration_timestamp: date
    };
    models.instance.Metadata.update(filter, update, function (err) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);

        } else {
            log("End Timestamp added to Registration's metadata");
            res.status(200).send({message: "End Timestamp added to metadata"});
        }
    });
}

//find a match by id
exports.findMetadataById = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    const filter = {registration_id: req.params.id};
    models.instance.Metadata.findOne(filter, function (err, metadata) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);
        } else {
            log("found the desired metadata!");
            res.send(metadata);
        }
    });
}