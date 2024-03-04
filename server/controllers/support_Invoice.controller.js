var db = require("../database-mysql");
let getdatasupport_Invoice = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from support_Invoice where users_id=?`;
    db.query(sql, [id], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  let insertsupport_Invoicedata = (req, res) => {
    let {
        numeroDossier,
        path,
        users_id
    } = req.body;

    const sql = `INSERT INTO railway.support_Invoice (
        numeroDossier,
        path,
        users_id
    ) VALUES (?,?,?)`;

    db.query(
        sql,
        [
            numeroDossier,
            path,
            users_id
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(result);
            }
        }
    );
};



  
let getPaymentinvoiceCaseByNumberAndUserId = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const users_id = req.params.users_id; 

    const sql = `SELECT * FROM support_Invoice WHERE numeroDossier = ? AND users_id = ?`;

    db.query(sql, [numeroDossier, users_id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
}




  
  module.exports = {
    getdatasupport_Invoice,
    getPaymentinvoiceCaseByNumberAndUserId,
    insertsupport_Invoicedata
  };