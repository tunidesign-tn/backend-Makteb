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
        texthonoraires,
        payement,
        textpayment,
        Datedujugement,
        Textedujugement,
        users_id
    } = req.body;

    const formattedDatedelaudience = new Date(Datedelaudience).toISOString().split('T')[0];
    const formattedDatedujugement = new Date(Datedujugement).toISOString().split('T')[0];

   

    const currentDate = new Date();

    const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);

    const FirstItem = {
        id: 1,
        created_at: oneHourLater.toISOString(), 
        text: Textedujugement
    };
    const firstItemhonoraires = {
        id: 1,
        created_at: oneHourLater.toISOString(),
        sum: honoraires,
        text:texthonoraires
    };

    const firstItempayment = {
        id: 1,
        created_at: oneHourLater.toISOString(),
        sum: payement,
        text:textpayment
    };
    const TextedujugementArray = [FirstItem];
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
        payement,
        Datedujugement,
        Textedujugement,
        users_id
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

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
            JSON.stringify([firstItemhonoraires]),
            reste, 
            JSON.stringify([firstItempayment]),
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

                if (caseData.honoraires) {
                    caseData.honoraires = JSON.parse(caseData.honoraires);
                }

                if (caseData.payement) {
                    caseData.payement = JSON.parse(caseData.payement);
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

const fetchAndMergeArray = (columnName, existingArray, newValue, newText) => {
    let newArrayItem;

    if (columnName === "Textedujugement") {
        newArrayItem = {
            id: existingArray.length + 1,
            created_at: new Date().toISOString(),
            text: newText,
        };
    } else if (columnName === "payement" || columnName === "honoraires") {
        newArrayItem = {
            id: existingArray.length + 1,
            created_at: new Date().toISOString(),
            sum: newValue,
            text: newText,
        };
    } else {
        newArrayItem = {
            id: existingArray.length + 1,
            created_at: new Date().toISOString(),
            sum: newValue,
            text: newText,
        };
    }

    const mergedArray = existingArray.concat(newArrayItem);
    return JSON.stringify(mergedArray);
};

const fetchAndMergeAndUpdate = (columnName, existingValue, newValue, newText, numeroDossier, users_id) => {
    return new Promise((resolve, reject) => {
        const fetchExistingSql = `SELECT ${columnName} FROM produit WHERE numeroDossier = ? AND users_id = ?`;

        db.query(fetchExistingSql, [numeroDossier, users_id], (fetchError, fetchResult) => {
            if (fetchError) {
                console.error("Error fetching existing record:", fetchError);
                reject(fetchError);
            } else {
                const existingArray = JSON.parse(fetchResult[0][columnName]);
                const mergedString = fetchAndMergeArray(columnName, existingArray, newValue, newText);

                let updates = [];
                if (newValue) {
                    updates.push({ column: columnName, value: mergedString });
                }
                

                if (updates.length === 0) {
                    resolve(); 
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
                        reject(err);
                    } else {
                        console.log(result);
                        if (result.affectedRows > 0) {
                            resolve();
                        } else {
                            reject({ message: "No matching record found", result });
                        }
                    }
                });
            }
        });
    });
};

const updateContractData = async (req, res) => {
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
        texthonoraires,
        payement,
        textpayment,
        reste,
        Datedujugement,
        Textedujugement,
    } = req.body;

    try {
        await fetchAndMergeAndUpdate("Textedujugement", Textedujugement, Textedujugement, Textedujugement, numeroDossier, users_id);
        await fetchAndMergeAndUpdate("payement", payement, payement, textpayment, numeroDossier, users_id);
        await fetchAndMergeAndUpdate("honoraires", honoraires, honoraires, texthonoraires, numeroDossier, users_id);

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
                if (reste) {
                    updates.push({ column: "reste", value: reste });
                }
                if (Datedujugement) {
                    updates.push({ column: "Datedujugement", value: Datedujugement });
                }
                console.log('Updates:', updates);

                res.json({ message: "Record updated successfully" });
    } catch (error) {
        console.error("Error in updateContractData:", error);
        res.status(500).json({
            error: `Internal Server Error: ${error.message}`,
        });
    }
};





  
  module.exports = {
    getdata,
    getCaseByNumberAndUserId,
    archiveByUserId,
    updateContractData,
    insertfolderdata
  };