const router = require("express").Router();

const {
  getdata,
  getCaseByNumberAndUserId,
  updateContractData,
  insertfolderdata,
  archiveByUserId,
  getDataCombined
  } = require("../controllers/folderdata.controller");

  router.get("/getdata/:id", getdata);//done  
  router.get("/getDataCombined/:id", getDataCombined);//done  
  router.post("/InsertFolderData", insertfolderdata);//done
  router.get("/number/:numeroDossier/user/:users_id", getCaseByNumberAndUserId);
  router.put("/archiver/:users_id", archiveByUserId);
  router.put("/update/:users_id/:numeroDossier", updateContractData);
  module.exports = router;