var db = require("../database-mysql");
let getdatasupport_text_du_jugement = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from support_text_du_jugement where users_id=?`;
    db.query(sql, [id], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  let insertsupport_text_du_jugementdata = (req, res) => {
    let {
        numeroDossier,
        path,
        users_id,
        support_date,
        nuLcas
    } = req.body;
    const currentDate = new Date()
    const sql = `INSERT INTO support_text_du_jugement (
        numeroDossier,
        path,
        users_id,
        created_at,
        support_date,
        nuLcas
    ) VALUES (?,?,?,?,?,?)`;

    db.query(
        sql,
        [
            numeroDossier,
            path,
            users_id,
            currentDate,
            support_date,
            nuLcas
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



  
let getsupport_text_du_jugementCaseByNumberAndUserId = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const users_id = req.params.users_id; 

    const sql = `SELECT * FROM support_text_du_jugement WHERE numeroDossier = ? AND users_id = ?`;

    db.query(sql, [numeroDossier, users_id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
}




  
  module.exports = {
    getdatasupport_text_du_jugement,
    getsupport_text_du_jugementCaseByNumberAndUserId,
    insertsupport_text_du_jugementdata
  };