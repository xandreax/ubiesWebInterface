const {log} = require("console");
const {Queue} = require("./queue/queue");
const {TagQueue} = require("./queue/tag.queue");
const models = require("../db/clientCassandra");

let loopCassandra;
let loopQuery;
let initTimestamp;

//find in the db the match's collection and start to send data
exports.findMatchCollectionAndSendData = async (ws, req) => {
    const id = req.params.id;
    const filter = {registration_id: req.params.id};
    let firstTimestampMilliseconds, lastTimestampMilliseconds;
    await models.instance.Metadata.findOne(filter, function (err, metadataFound) {
        if (err) {
            log(err);
        } else {
            log("found the desired metadata!");
            const firstTimestampDate = new Date(metadataFound.timestamp);
            firstTimestampMilliseconds = firstTimestampDate.getTime();
            const lastTimestampDate = new Date(metadataFound.end_registration_timestamp);
            lastTimestampMilliseconds = lastTimestampDate.getTime();
            log("first timestamp: " + firstTimestampMilliseconds);
            log("last timestamp: " + lastTimestampMilliseconds);
        }
    });
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
                clearInterval(loopCassandra);
                clearInterval(loopQuery);
                break;
            case "STOP":
                log("stopped");
                clearInterval(loopCassandra);
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
        loopCassandra = setInterval(function () {
            getDataBetweenTwoDates(ws, initTimestamp, lastTimestampMilliseconds);
            initTimestamp = initTimestamp + 1000;
        }, 1000);
        let intervalTimestamp = initTimestamp - 1000;
        loopQuery = setInterval(function () {
            send_data(intervalTimestamp);
            intervalTimestamp = intervalTimestamp + 100;
        }, 100);
    }

    async function getDataBetweenTwoDates(ws, firstTimestampMilliseconds, lastTimestampMilliseconds) {
        if (firstTimestampMilliseconds > lastTimestampMilliseconds) {
            clearInterval(loopCassandra);
            clearInterval(loopQuery)
            log("sent all data!");
            ws.send("END");
            return;
        }

        let initDate = new Date(firstTimestampMilliseconds);
        let queryDate = new Date((firstTimestampMilliseconds + 1000));
        const smallStart = Date.now();

        let filterIntervalTimestamp = {
            registration_id: id,
            timestamp: {
                $gte: initDate,
                $lt: queryDate
            },
            $orderby: { '$asc' :'timestamp' }
        }
        await models.instance.RegData.find(filterIntervalTimestamp, function(err, messages){
            if (err) {
                log(err);
            } else {
                let arrayTag = messages.filter(tag => tag.position != null);
                console.log("arraytag:"+arrayTag.length);
                tagsQueue.enqueueTags(arrayTag);
            }
        })
        log('Big:' + (Date.now() - smallStart) + ' ms');
    }

    function send_data(timestamp) {
        let results = tagsQueue.dequeueTags(timestamp);
        console.log("arraytag:"+tagsQueue.length);
        console.log("results:"+results.length);
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
    console.log("constellation finding!");
    if (!req.params.id) {
        res.status(400).send({message: "Metadata id can not be empty!"});
        return;
    }
    const filter = {registration_id: req.params.id};
    models.instance.ConfigData.findOne(filter, function (err, config) {
        if (err) {
            res.status(400).send({message: err.message});
            log(err);
        } else {
            log("found the desired configuration data!");
            res.send(config);
        }
    })
};