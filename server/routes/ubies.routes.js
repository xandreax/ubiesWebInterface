const registrationMetadata = require("../controllers/registrationMetadata.controller");
const importing = require("../controllers/importing.controller");
module.exports = (app) => {
  const registrationMetadata = require("../controllers/registrationMetadata.controller");
  const importing = require("../controllers/importing.controller");
  const replayController = require("../controllers/replayData.controller");
  let router = require("express").Router();

  router.post("/metadata", registrationMetadata.create);
  router.get("/metadata", registrationMetadata.findAll);
  router.put("/metadata", registrationMetadata.update);
  router.delete("/metadata/:id", registrationMetadata.delete);
  router.post("/metadata/end/:id", registrationMetadata.addEndTimestamp);
  router.get("/metadata/match/:id", registrationMetadata.findMetadataById);
  router.post("/registration/stop", importing.stop);
  router.post("/registration/start", importing.start);
  router.get("/registration/status", importing.check);
  router.get("/getConstellation/:id", replayController.findConstellation);

  app.use("/api", router);
};
