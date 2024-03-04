const router = require("express").Router();

const {
    getdatasupport_text_du_jugement,
    getsupport_text_du_jugementCaseByNumberAndUserId,
    insertsupport_text_du_jugementdata
  } = require("../controllers/support_text_du_jugement.controller");

  router.get("/getdatasupport_text_du_jugement/:id", getdatasupport_text_du_jugement);//done  
  router.post("/insertsupport_text_du_jugementdata", insertsupport_text_du_jugementdata);//done
  router.get("/support_text_du_jugement/:numeroDossier/user/:users_id", getsupport_text_du_jugementCaseByNumberAndUserId);//done 
  module.exports = router;