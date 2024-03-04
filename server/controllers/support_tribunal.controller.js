var db = require("../database-mysql");
let getdatasupport_tribunal = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from support_tribunal where users_id=?`;
    db.query(sql, [id], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  let insertsupport_tribunaldata = (req, res) => {
    let {
        numeroDossier,
        path,
        users_id,
    } = req.body;
    
    
    const sql = `INSERT INTO support_tribunal (
        numeroDossier,
        path,
        users_id
    ) VALUES (?,?,?)`;

    db.query(
        sql,
        [
            numeroDossier,
            path,
            users_id,
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




  
let getsupport_tribunalCaseByNumberAndUserId = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const users_id = req.params.users_id; 

    const sql = `SELECT * FROM support_tribunal WHERE numeroDossier = ? AND users_id = ?`;

    db.query(sql, [numeroDossier, users_id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
}




  
  module.exports = {
    getdatasupport_tribunal,
    getsupport_tribunalCaseByNumberAndUserId,
    insertsupport_tribunaldata
  };