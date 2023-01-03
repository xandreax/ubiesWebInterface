/*const registrationMetadata = require("../controllers/registrationMetadata.controller");
const replayController = require("../controllers/replayData.controller");*/

const importing = require("../controllers/importing.controller");
const metadataCassandra = require("../controllers/metadataCassandra.controller");
const replayCassandra = require("../controllers/replayCassandra.controller");

module.exports = (app) => {

    let router = require("express").Router();

    /*router.post("/metadata", registrationMetadata.create);
    router.get("/metadata", registrationMetadata.findAll);
    router.put("/metadata", registrationMetadata.update);
    router.delete("/metadata/:id", registrationMetadata.delete);
    router.post("/metadata/end/:id", registrationMetadata.addEndTimestamp);
    router.get("/metadata/match/:id", registrationMetadata.findMetadataById);
    router.post("/registration/stop", importing.stop);
    router.post("/registration/start", importing.start);
    router.get("/registration/status", importing.check);
    router.get("/getConstellation/:id", replayController.findConstellation);*/

    router.get("/metadata", metadataCassandra.findAll);
    router.post("/metadata", metadataCassandra.create);
    router.put("/metadata", metadataCassandra.update);
    router.delete("/metadata/:id", metadataCassandra.delete);
    router.post("/metadata/end/:id", metadataCassandra.addEndTimestamp);
    router.get("/metadata/match/:id", metadataCassandra.findMetadataById);
    router.post("/registration/stop", importing.stop);
    router.post("/registration/start/:id", importing.start);
    router.get("/registration/status", importing.check);
    router.get("/getConstellation/:id", replayCassandra.findConstellation);

    app.use("/api", router);
};
