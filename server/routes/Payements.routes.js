const router = require("express").Router();

const {
    getdataPayements,
    getPaymentCaseByNumberAndUserId,
    updatePaymentData,
    insertPayementsdata
  } = require("../controllers/Payements.controller");

  router.get("/getdataPayements/:id", getdataPayements);//done  

  router.post("/insertPayementsdata", insertPayementsdata);//done
  router.get("/PaymentCaseByNumber/:numeroDossier/user/:users_id", getPaymentCaseByNumberAndUserId);
  router.put("/updatePaymentData/:users_id/:numeroDossier", updatePaymentData);
  module.exports = router;