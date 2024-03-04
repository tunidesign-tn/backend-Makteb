const router = require("express").Router();

const {
    getdatasupport_Invoice,
    getPaymentinvoiceCaseByNumberAndUserId,
    insertsupport_Invoicedata
  } = require("../controllers/support_Invoice.controller");

  router.get("/getdatasupport_Invoice/:id", getdatasupport_Invoice);//done  
  router.post("/insertsupport_Invoicedata", insertsupport_Invoicedata);//done
  router.get("/supportinvoice/:numeroDossier/user/:users_id", getPaymentinvoiceCaseByNumberAndUserId);//done 
  module.exports = router;