var db = require("../database-mysql");
let getdataProxy = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from Proxy where idusers=?`;
    db.query(sql, [id], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  let getDataProxyWithUserInfo = (req, res) => {
    const id_seconduser = req.params.id;
    const sql = `
      SELECT 
        Proxy.*, 
        users.name AS userName, 
        users.lastname AS userLastname
      FROM Proxy
      INNER JOIN users ON Proxy.id_seconduser = users.idusers
      WHERE Proxy.id_seconduser = ?
    `;
  
    db.query(sql, [id_seconduser], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  
  let insertProxydata = (req, res) => {
    let {
        idusers,
        path,
        id_seconduser,
        numeroDossier,
        secure_code
    } = req.body;

    const sql = `INSERT INTO Proxy (
        idusers,
        path,
        id_seconduser,
        numeroDossier,
        secure_code
    ) VALUES (?,?,?,?,?)`;

    db.query(
        sql,
        [
            idusers,
            path,
            id_seconduser,
            numeroDossier,
            secure_code
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



  
let getProxydata = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const users_id = req.params.users_id; 

    const sql = `SELECT * FROM Proxy WHERE numeroDossier = ? AND users_id = ?`;

    db.query(sql, [numeroDossier, users_id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
}
let cloudataProxy = (req, res) => {
  const numeroDossier = req.params.numeroDossier;
  const users_id = req.params.users_id;
  const sql1 = `SELECT * FROM support_tribunal WHERE numeroDossier = ? AND users_id = ?`;
  const sql2 = `SELECT * FROM support_text_du_jugement WHERE numeroDossier = ? AND users_id = ?`;
  
  db.query(sql1, [numeroDossier, users_id], (err, result1) => {
    if (err) {
      res.status(500).send(err);
    } else {
      db.query(sql2, [numeroDossier, users_id], (err, result2) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({ support_tribunal: result1, support_text_du_jugement: result2 });
        }
      });
    }
  });
};





  
  module.exports = {
    getDataProxyWithUserInfo,
    getdataProxy,
    getProxydata,
    insertProxydata,
    cloudataProxy
  };