const {log} = require("console");
const {MongoClient} = require("mongodb");
const mongoDB_config = require("../db/mongodb_config");
const {collection_match_data, collection_config_data} = require("../db/mongodb_config");
const {Queue} = require("../model/queue");
const {TagQueue} = require("../model/tag.queue");

const mongoDB_url = mongoDB_config.url;
const client = new MongoClient(mongoDB_url);
const db = client.db(mongoDB_config.dbName);
let loopMongo;
let loopQuery;
let initTimestamp;

//find in the db the match's collection and start to send data
exports.findMatchCollectionAndSendData = async (ws, req) => {
    const id = req.params.id;
    await client.connect();
    const metadataCollection = await db.collection(mongoDB_config.collection_matches_info);
    let metadata = await metadataCollection.findOne({
        registration_id: id
    });
    const firstTimestampDate = new Date(metadata.timestamp);
    let firstTimestampMilliseconds = firstTimestampDate.getTime();
    const lastTimestampDate = new Date(metadata.end_registration_timestamp);
    const lastTimestampMilliseconds = lastTimestampDate.getTime();
    log("first timestamp: " + firstTimestampMilliseconds);
    log("last timestamp: " + lastTimestampMilliseconds);
    const matchCollection = await db.collection(collection_match_data);

    const firstTimeQuery = await matchCollection.find({
        registration_id: id
    }).sort({timestamp: 1}).limit(1);
    let firstTimestamp;
    await firstTimeQuery.forEach(doc => firstTimestamp = doc.timestamp);

    let queue;
    let tagsQueue;

    ws.on('message', async msg => {
        switch (msg) {
            case "START":
                log("started");
                initTimestamp = firstTimestampMilliseconds;
                queue = new Queue();
                tagsQueue = new TagQueue();
                startLoops();
                break;
            case "PAUSE":
                log("paused");
                clearInterval(loopMongo);
                clearInterval(loopQuery);
                break;
            case "STOP":
                log("stopped");
                clearInterval(loopMongo);
                clearInterval(loopQuery);
                break;
            case "RESUME":
                log("resume");
                startLoops();
                break;
            case "CLOSE":
                log("closed");
                ws.close();
                break;
            case "BACK10":
                log("back 10 seconds");
                initTimestamp = Math.max(firstTimestampMilliseconds, initTimestamp - (10 * 1000));
                queue = new Queue();
                tagsQueue = new TagQueue();
                break;
            case "BACK30":
                log("back 30 seconds");
                initTimestamp = Math.max(firstTimestampMilliseconds, initTimestamp - (30 * 1000));
                queue = new Queue();
                tagsQueue = new TagQueue();
                break;
            case "FORWARD10":
                log("forward 10 seconds");
                initTimestamp = Math.min(lastTimestampMilliseconds, initTimestamp + (10 * 1000));
                log(initTimestamp);
                queue = new Queue();
                tagsQueue = new TagQueue();
                break;
            case "FORWARD30":
                log("forward 30 seconds");
                initTimestamp = Math.min(lastTimestampMilliseconds, initTimestamp + (30 * 1000));
                queue = new Queue();
                tagsQueue = new TagQueue();
                break;
            case String(msg.match('^[0-9]+$')):
                log("move to "+msg);
                initTimestamp = parseInt(msg);
                queue = new Queue();
                tagsQueue = new TagQueue();
                break;
            default:
                //log(msg);
                break;
        }
    });


    function startLoops() {
        loopMongo = setInterval(function () {
            getDataBetweenTwoDatesAndSend(ws, initTimestamp, lastTimestampMilliseconds);
            initTimestamp = initTimestamp + 1000;
        }, 1000);
        let intervalTimestamp = initTimestamp - 1000;
        loopQuery = setInterval(function () {
            send_data(intervalTimestamp);
            intervalTimestamp = intervalTimestamp + 100;
        }, 100);
    }

    async function getDataBetweenTwoDatesAndSend(ws, firstTimestampMilliseconds, lastTimestampMilliseconds) {
        if (firstTimestampMilliseconds > lastTimestampMilliseconds) {
            clearInterval(loopMongo);
            clearInterval(loopQuery)
            log("sent all data!");
            ws.send("END");
            return;
        }

        let initDate = new Date(firstTimestampMilliseconds);
        let queryDate = new Date((firstTimestampMilliseconds + 1000));
        await matchCollection.find({
            registration_id: id,
            timestamp: {
                $gte: initDate,
                $lt: queryDate
            }
        }).sort({timestamp: 1}).forEach((doc) => queue.enqueue(doc.messages));

        let arrayTag, arrayMsg;
        if (!queue.isEmpty) {
            log("queue length: " + queue.length);
            arrayMsg = queue.dequeue();
            if (arrayMsg !== undefined) {
                arrayTag = arrayMsg.filter(tag => tag.hasOwnProperty('tag')).sort(compareTimestampTag);
                tagsQueue.enqueueTags(arrayTag);
            }
        }
        else{
            log("queue empty");
        }
    }

    function send_data(timestamp) {
        let results = tagsQueue.dequeueTags(timestamp);
        ws.send(JSON.stringify(results));
    }
};

function compareTimestampTag(a, b) {
    if (a.tag.timestamp < b.tag.timestamp)
        return -1;
    if (a.tag.timestamp > b.tag.timestamp)
        return 1;
    return 0;
}

exports.findConstellation = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({message: "Match id can not be empty!"});
        return;
    }
    await client.connect();
    await db.collection(collection_config_data).find({
        registration_id: req.params.id
    }).limit(1).toArray((err, results) => {
        if (err) return log(err);
        res.status(200).send(results[0]);
    });
};