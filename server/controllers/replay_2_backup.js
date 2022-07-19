/*const matchCollection = await db.collection(collection_match_data);
    //query first tag timestamp
    const firstTimeQuery = await matchCollection.find({
        registration_id: id
    }).sort({timestamp: 1}).limit(1);
    let firstTimestamp;
    await firstTimeQuery.forEach(doc => firstTimestamp = doc.timestamp);
    const firstTimestampDate = new Date(firstTimestamp);
    //let firstTimestampMilliseconds = firstTimestampDate.getTime();
    log("first: " + firstTimestampMilliseconds);
    //query last tag timestamp
    const lastTimeQuery = await matchCollection.find({
        registration_id: id
    }).sort({timestamp: -1}).limit(1);
    let lastTimestamp;
    await lastTimeQuery.forEach(doc => lastTimestamp = doc.timestamp);
    const lastTimestampDate = new Date(lastTimestamp);
    //const lastTimestampMilliseconds = lastTimestampDate.getTime();
    log("last: " + lastTimestampMilliseconds);
    */

/*loop = setInterval(function () {
                    getDataBetweenTwoDatesAndSend(ws, initTimestamp, lastTimestampMilliseconds);
                    initTimestamp = initTimestamp + 100;
                }, 100);*/

/*loop = setInterval(function () {
                    getDataBetweenTwoDatesAndSend(ws, initTimestamp, lastTimestampMilliseconds);
                    initTimestamp = initTimestamp + 100;
                }, 100);*/

/*async function getDataBetweenTwoDatesAndSend(ws, firstTimestampMilliseconds, lastTimestampMilliseconds) {
        const initTimestamp = new Date(firstTimestampMilliseconds);
        const endTimestamp = new Date(firstTimestampMilliseconds + 100);
        const query = await matchCollection.find({
            datatype: 'tag',
            registration_id: id,
            timestamp: {
                $gte: initTimestamp,
                $lt: endTimestamp
            }
        }).sort({timestamp: 1});

        if ((firstTimestampMilliseconds + 100) > lastTimestampMilliseconds) {
            clearInterval(loop);
            log("send all data!");
            ws.send("END");
            return;
        }

        await query.forEach((doc) => {
            ws.send(JSON.stringify(doc));
        });
    }*/