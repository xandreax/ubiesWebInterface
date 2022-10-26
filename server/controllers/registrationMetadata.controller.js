const {log} = require("console");
const {MongoClient} = require("mongodb");
const mongoDB_config = require("../db/mongodb_config");
const mongoDB_url = mongoDB_config.url;
const client = new MongoClient(mongoDB_url);
const db = client.db(mongoDB_config.dbName);

//create and save new Metadata
exports.create = async (req, res) => {
    log("start saving new metadata");
    const match = req.body.valueOf();
    //save match in the db
    await client.connect();
    const collection = await db.collection(mongoDB_config.collection_matches_info);
    collection.insertOne(match, (err) => {
        if (err) {
            res.status(400).send({message: err.message});
            return log(err);
        }
    });
    res.status(200).send({message: "metadata saved into Matches"});
    log("metadata saved into Matches");
};

// Retrieve all registrations metadata from the database.
exports.findAll = async (req, res) => {
    await client.connect();
    const collection = await db.collection(mongoDB_config.collection_matches_info);
    collection.find().sort({timestamp: -1}).toArray((err, results) => {
        if (err) {
            res.status(400).send({message: err.message});
            return log(err);
        }
        res.send(results);
    });
};

// Update a metadata in matches metadata collection
exports.update = async (req, res) => {
    const metadata = req.body.valueOf();
    log(metadata);
    await client.connect();
    log("start updating metadata");
    const filter = {registration_id: metadata.registration_id};
    const updateMetadata = {
        $set: {
            name_registration: metadata.name_registration,
            teams: metadata.teams,
            type_registration: metadata.type_registration,
            length_court: metadata.length_court,
            width_court: metadata.width_court
        },
    };

    db.collection(mongoDB_config.collection_matches_info).findOneAndUpdate(filter, updateMetadata, (err) => {
        if (err) {
            res.status(400).send({message: err.message});
            return log(err);
        }
    });

    log("Metadata updated");
    res.send({message: "Metadata updated"});
};

// Delete a Metadata from matches collection and delete all match data
exports.delete = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    log(req.params.id);
    await client.connect();
    log("start deleting Metadata");
    const query = {registration_id: req.params.id};
    await db.collection(mongoDB_config.collection_matches_info)
        .deleteOne(query)
        .then(() => {
            log("Successfully deleted Metadata " + req.params.id)
        })
        .catch(err => res.status(400).send({message: err.message}));
    await db.collection(mongoDB_config.collection_match_data)
        .deleteMany(query)
        .then(() => {
            log("Successfully deleted position data")
        })
        .catch(err => res.status(400).send({message: err.message}));
    await db.collection(mongoDB_config.collection_config_data)
        .deleteMany(query)
        .then(() => {
            res.status(200).send({message: "Metadata deleted"});
            log("Successfully deleted all data")
        })
        .catch(err => res.status(400).send({message: err.message}));
};

//add end timestamp of the registration
exports.addEndTimestamp = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    await client.connect();
    let date = req.body.end_timestamp;
    log("date:" + date);
    const filter = {registration_id: req.params.id};
    const update = {
        $set: {
            end_registration_timestamp: date,
        },
    };
    db.collection(mongoDB_config.collection_matches_info).findOneAndUpdate(filter, update, (err) => {
        if (err) {
            res.status(400).send({message: err.message});
            return log(err);
        }
    });
    log("End Timestamp added to Registration's metadata");
    res.status(200).send({message: "End Timestamp added to metadata"});
}

//find a match by id
exports.findMetadataById = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    await client.connect();
    const collection = await db.collection(mongoDB_config.collection_matches_info);
    await collection.findOne({registration_id: req.params.id})
        .then((result) => res.status(200).send(result))
        .catch(err => res.status(400).send({message: err.message}));
}
