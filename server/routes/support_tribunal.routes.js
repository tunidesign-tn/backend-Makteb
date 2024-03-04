const router = require("express").Router();

const {
    getdatasupport_tribunal,
    getsupport_tribunalCaseByNumberAndUserId,
    insertsupport_tribunaldata
  } = require("../controllers/support_tribunal.controller");

  router.get("/getdatasupport_tribunal/:id", getdatasupport_tribunal);//done  
  router.post("/insertsupport_tribunaldata", insertsupport_tribunaldata);//done
  router.get("/support_tribunal/:numeroDossier/user/:users_id", getsupport_tribunalCaseByNumberAndUserId);//done 
  module.exports = router;