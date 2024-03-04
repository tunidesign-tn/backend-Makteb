const router = require("express").Router();

const {
    getdataProxy,
    getProxydata,
    insertProxydata,
    getDataProxyWithUserInfo,
    cloudataProxy
  } = require("../controllers/proxy.controller");
  router.get("/cloudataProxy/:numeroDossier/user/:users_id", cloudataProxy);
  router.get("/getdataProxy/:id", getdataProxy);
  router.get("/getDataProxyWithUserInfo/:id", getDataProxyWithUserInfo);
  router.post("/insertProxydata", insertProxydata);
  router.get("/PaymentCaseByNumber/:numeroDossier/user/:users_id", getProxydata);
  module.exports = router;