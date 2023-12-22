const router = require("express").Router();

const {
  getdata,
  getcasebynumber,
  archive,
  updateContractData,
  insertfolderdata
  } = require("../controllers/folderdata.controller");

  router.get("/getdata/:id", getdata);//done  
  router.post("/InsertFolderData", insertfolderdata);//done
  router.get("/number/:numeroDossier", getcasebynumber)//done
  router.put("/archiver", archive);//done
    router.put("/updateDetails/:numeroDossier",updateContractData)//done
  module.exports = router;