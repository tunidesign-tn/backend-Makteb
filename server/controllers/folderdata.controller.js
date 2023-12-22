var db = require("../database-mysql");
let getdata = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from produit where users_id=?`;
    db.query(sql, [id], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  let insertfolderdata = (req, res) => {
    let {
      numeroDossier,
      demandeur,
      nomdedemandeur,
      Tribunal,
      ville,
      Matière,
      T,
      nuLecas,
      Datedelaudience,
      conclusion,
      Ledéfendeur,
      nomdudéfendeur,
      honoraires,
      reste,
      Datedujugement,
      Textedujugement,
    } = req.body;
  
    // Format date strings to 'YYYY-MM-DD' format
    const formattedDatedelaudience = new Date(Datedelaudience).toISOString().split('T')[0];
    const formattedDatedujugement = new Date(Datedujugement).toISOString().split('T')[0];
  
    const sql = `INSERT INTO produit (
          numeroDossier,
          demandeur,
          nomdedemandeur,
          Tribunal,
          ville,
          Matière,
          T,
          nuLecas,
          Datedelaudience,
          conclusion,
          Ledéfendeur,
          nomdudéfendeur,
          archives,
          honoraires,
          reste,
          Datedujugement,
          Textedujugement,
          users_id
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  
    db.query(
      sql,
      [
        numeroDossier,
        demandeur,
        nomdedemandeur,
        Tribunal,
        ville,
        Matière,
        T,
        nuLecas,
        formattedDatedelaudience,
        conclusion,
        Ledéfendeur,
        nomdudéfendeur,
        'false', // Set the string value 'false' for "archives"
        honoraires,
        reste,
        formattedDatedujugement,
        Textedujugement,
        1, // Assuming users_id is an int
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
  
  let getcasebynumber = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const sql = `SELECT * from produit where numeroDossier = ?`; 
    db.query(sql, [numeroDossier], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  let archive = (req, res) => {
    const numeroDossier = req.body.numeroDossier; 
    if (!numeroDossier || !Array.isArray(numeroDossier) || numeroDossier.length === 0) {
      return res.status(400).send("Invalid or empty array of numeroDossier");
    }
  
    const sql = `UPDATE produit SET archives = 'true' WHERE numeroDossier IN (?)`;
  
    db.query(sql, [numeroDossier], (err, result) => {
      if (err) {
        console.error("Error updating records:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        if (result.changedRows > 0) {
          res.send("Records updated successfully");
        } else {
          res.send("No matching records found");
        }
      }
    });
  };
  const updateContractData = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const {
        Tribunal,
        ville,
        Matière,
        T,
        nuLecas,
        Datedelaudience,
        conclusion,
        honoraires,
        reste,
        Datedujugement,
        Textedujugement,
    } = req.body;

    let updates = [];
    if (Tribunal) {
        updates.push({ column: "Tribunal", value: Tribunal });
    }
    if (ville) {
        updates.push({ column: "ville", value: ville });
    }
    if (Matière) {
        updates.push({ column: "Matière", value: Matière });
    }
    if (T) {
        updates.push({ column: "T", value: T });
    }
    if (nuLecas) {
        updates.push({ column: "nuLecas", value: nuLecas });
    }
    if (Datedelaudience) {
        updates.push({ column: "Datedelaudience", value: Datedelaudience });
    }
    if (conclusion) {
        updates.push({ column: "conclusion", value: conclusion });
    }
    if (honoraires) {
        updates.push({ column: "honoraires", value: honoraires });
    }
    if (reste) {
        updates.push({ column: "reste", value: reste });
    }
    if (Textedujugement) {
        updates.push({ column: "Textedujugement", value: Textedujugement });
    }
    if (Datedujugement) {
        updates.push({ column: "Datedujugement", value: Datedujugement });
    }

    if (updates.length === 0) {
        res.status(400).json({ error: "No updates provided" });
        return;
    }

    let sql = "UPDATE produit SET ";
    let params = [];
    updates.forEach((update, index) => {
        sql += `${update.column} = ?`;
        params.push(update.value);
        if (index !== updates.length - 1) {
            sql += ", ";
        }
    });

    // Add numeroDossier as a parameter
    params.push(numeroDossier);

    sql += " WHERE numeroDossier = ?";

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error updating record:", err);
            res.status(500).json({
                error: `Internal Server Error: ${err.message}`,
                sqlQuery: sql,
                sqlParams: params,
            });
        } else {
            console.log(result);
            if (result.affectedRows > 0) {
                res.json({ message: "Record updated successfully", result });
            } else {
                res.status(404).json({ error: "No matching record found", result });
            }
        }
    });
};


  
  module.exports = {
    getdata,
    getcasebynumber,
    archive,
    updateContractData,
    insertfolderdata
  };