const router = require("express").Router();

const {
    getdata,
    insertrappellesdata,
    getallrappels,
    deleteRappelleById,
    isUnRead,
  } = require("../controllers/rappelles.controller");

  router.get("/getdatarappeles/:id", getdata);//done  
  router.get("/getallrappels/:id", getallrappels);//done 
  router.post("/insertrappellesdata", insertrappellesdata);//done
  router.put ("/isUnRead",isUnRead)
  router.delete("/delete/:id", deleteRappelleById);//done
  module.exports = router;