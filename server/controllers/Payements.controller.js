var db = require("../database-mysql");
let getdataPayements = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from Payements where users_id=?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            result.forEach((caseData) => {
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
  let insertPayementsdata = (req, res) => {
    let {
        numeroDossier,
        honoraires,
        reste,
        payement,
        texthonoraires,
        textpayment,
        users_id
    } = req.body;

    const currentDate = new Date();
    const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);

     const initialIteam={
        id:0,
        created_at: oneHourLater.toISOString(),
        sum:0,
        text: "text initial"
     }
    const firstItemhonoraires = {
        id: 1,
        created_at: oneHourLater.toISOString(),
        sum: honoraires,
        text: texthonoraires
    };

    const firstItempayment = {
        id: 1,
        created_at: oneHourLater.toISOString(),
        sum: payement,
        text: textpayment
    };

    const honorairesArray = [initialIteam, firstItemhonoraires];
    const payementArray = [initialIteam, firstItempayment];

    const honorairesJSON = JSON.stringify(honorairesArray);
    const payementJSON = JSON.stringify(payementArray);

    const sql = `INSERT INTO railway.Payements (
        numeroDossier,
        honoraires,
        reste,
        payement,
        users_id
    ) VALUES (?,?,?,?,?)`;

    db.query(
        sql,
        [
            numeroDossier,
            honorairesJSON,
            reste,
            payementJSON,
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



  
let getPaymentCaseByNumberAndUserId = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const users_id = req.params.users_id; 

    const sql = `SELECT * FROM Payements WHERE numeroDossier = ? AND users_id = ?`;

    db.query(sql, [numeroDossier, users_id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            result.forEach((caseData) => {
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
;
const updatePaymentData = (req, res) => {
    const numeroDossier = req.params.numeroDossier;
    const users_id = req.params.users_id;
    const {
        reste,
        honoraires,
        payement,
        textpayment,
        texthonoraires
    } = req.body;

    const fetchExistingpaymentSql = "SELECT * FROM Payements WHERE numeroDossier = ? AND users_id = ?";
    db.query(fetchExistingpaymentSql, [numeroDossier, users_id], (fetchError, fetchResult) => {
        if (fetchError) {
            console.error("Error fetching existing record:", fetchError);
            res.status(500).json({
                error: `Internal Server Error: ${fetchError.message}`,
            });
        } else {
            const existingRecord = fetchResult[0] || {};
            const existinghonoraires = existingRecord.honoraires ? JSON.parse(existingRecord.honoraires) : [];
            const existingpayment = existingRecord.payement ? JSON.parse(existingRecord.payement) : [];

            const existinghonorairesArray = Array.isArray(existinghonoraires) ? existinghonoraires : [];
            const existingpaymentArray = Array.isArray(existingpayment) ? existingpayment : [];

            const newHonoraires = {
                id: existinghonorairesArray.length + 1,
                created_at: new Date().toISOString(),
                sum: honoraires,
                text: texthonoraires,
            };

            const newPayment = {
                id: existingpaymentArray.length + 1,
                created_at: new Date().toISOString(),
                sum: payement,
                text: textpayment,
            };

            const mergedhonorairesArray = existinghonorairesArray.concat(newHonoraires);
            const mergedpaymentArray = existingpaymentArray.concat(newPayment);

            const mergedhonorairesString = JSON.stringify(mergedhonorairesArray);
            const mergedpaymentString = JSON.stringify(mergedpaymentArray);

            let updates = [];
            if (payement) {
                updates.push({ column: "payement", value: mergedpaymentString });
            }
            if (honoraires) {
                updates.push({ column: "honoraires", value: mergedhonorairesString });
            }
            if (reste) {
                updates.push({ column: "reste", value: reste });
            }

            if (updates.length === 0) {
                res.status(400).json({ error: "No updates provided" });
                return;
            }

            let sql = "UPDATE Payements SET ";
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
    getdataPayements,
    getPaymentCaseByNumberAndUserId,
    updatePaymentData,
    insertPayementsdata
  };