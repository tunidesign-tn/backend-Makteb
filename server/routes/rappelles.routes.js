const router = require("express").Router();

const {
    getdata,
    insertrappellesdata,
    deleteRappelleById,
    isUnRead,
  } = require("../controllers/rappelles.controller");

  router.get("/getdatarappeles/:id", getdata);//done  
  router.post("/insertrappellesdata", insertrappellesdata);//done
  router.put ("/isUnRead",isUnRead)
  router.delete("/delete/:id", deleteRappelleById);//done
  module.exports = router;