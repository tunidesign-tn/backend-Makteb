var db = require("../database-mysql");
let getdata = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from produit where users_id=?`;
    db.query(sql, [id], (err, result) => {
      if (err) res.send(err);
      else res.send(result);
    });
  };
  const getDataCombined = (req, res) => {
    const id = req.params.id;
  
    const produitSql = `SELECT id, nuLecas, Tribunal, ville, Datedelaudience FROM produit WHERE users_id=?`;
    const rappellesSql = `SELECT idrappelles, title, description, deadline, createdAt, null as nuLecas, null as Tribunal, null as ville, null as Datedelaudience FROM rappelles WHERE users_id=?`;
  
    db.query(produitSql, [id], (errProduit, resultProduit) => {
      if (errProduit) {
        res.status(500).send(errProduit);
        return;
      }
  
      db.query(rappellesSql, [id], (errRappelles, resultRappelles) => {
        if (errRappelles) {
          res.status(500).send(errRappelles);
          return;
        }
  
        const combinedData = resultProduit.map(item => ({
          id: item.id,
          title: `${item.nuLecas} ${item.Tribunal} ${item.ville}`,
          date: item.Datedelaudience.toISOString().split('T')[0],
        })).concat(resultRappelles.map(item => ({
          id: item.idrappelles,
          title: `${item.title} ${item.description}`,
          date: item.deadline.toISOString().split('T')[0],
        })));
  
        res.send(combinedData);
      });
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
        Datedujugement,
        Textedujugement,
        users_id
    } = req.body;

    const formattedDatedelaudience = new Date(Datedelaudience).toISOString().split('T')[0];
    const formattedDatedujugement = new Date(Datedujugement).toISOString().split('T')[0];

    let idCounter = 1;

    const currentDate = new Date();

const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);

const firstItem = {
    id: idCounter++,
    created_at: oneHourLater.toISOString(),
    text: "في الإنتظار تعيين الجلسة"
};

const secondItem = {
    id: idCounter++,
    created_at: new Date(oneHourLater.getTime() + 60 * 60 * 1000).toISOString(), 
    text: Textedujugement
};

    const TextedujugementArray = [firstItem, secondItem];

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
        Datedujugement,
        Textedujugement,
        users_id
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

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
            'false',
            formattedDatedujugement,
            JSON.stringify(TextedujugementArray),
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
  
let getCaseByNumberAndUserId = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const users_id = req.params.users_id; 

    const sql = `SELECT * FROM produit WHERE numeroDossier = ? AND users_id = ?`;

    db.query(sql, [numeroDossier, users_id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            result.forEach((caseData) => {
                if (caseData.Textedujugement) {
                    caseData.Textedujugement = JSON.parse(caseData.Textedujugement);
                }
            });

            res.send(result);
        }
    });
}
let archiveByUserId = (req, res) => {
    const numeroDossier = req.body.numeroDossier;
    const users_id = req.params.users_id;

    if (!numeroDossier || !Array.isArray(numeroDossier) || numeroDossier.length === 0 || !users_id) {
        return res.status(400).send("Invalid or empty array of numeroDossier or missing users_id");
    }

    const sql = `UPDATE produit SET archives = 'true' WHERE numeroDossier IN (?) AND users_id = ?`;

    db.query(sql, [numeroDossier, users_id], (err, result) => {
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
    const users_id = req.params.users_id;
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
    
    const fetchExistingTextedujugementSql = "SELECT Textedujugement FROM produit WHERE numeroDossier = ? AND users_id = ?";
    db.query(fetchExistingTextedujugementSql, [numeroDossier, users_id], (fetchError, fetchResult) => {
        if (fetchError) {
            console.error("Error fetching existing record:", fetchError);
            res.status(500).json({
                error: `Internal Server Error: ${fetchError.message}`,
            });
        } else {
            const existingTextedujugementArray = JSON.parse(fetchResult[0].Textedujugement);

            const mergedTextedujugementArray = existingTextedujugementArray.concat({
                id: existingTextedujugementArray.length,
                created_at: new Date().toISOString(),
                text: Textedujugement,
            });

            const mergedTextedujugementString = JSON.stringify(mergedTextedujugementArray);
    
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
        updates.push({ column: "Textedujugement", value: mergedTextedujugementString });
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

            params.push(numeroDossier);
            params.push(users_id);

            sql += " WHERE numeroDossier = ? AND users_id = ?";

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
        }
    });
};




  
  module.exports = {
    getdata,
    getCaseByNumberAndUserId,
    archiveByUserId,
    updateContractData,
    insertfolderdata,
    getDataCombined
  };