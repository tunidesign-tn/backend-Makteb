//عدل منفذ controller 
var db = require("../database-mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { Executoremail,
            Executorpass,
            Executorname,
            Executorlast_name,
            Executorphone,
            Executoradress,
            Executor_idfiscal,
            Executor_idorder,
            Executor_idrne
        } = req.body;
    const hashedExecutorpass = await bcrypt.hash(Executorpass, 10);

    const sql =
      "INSERT INTO Executor (Executorname, Executorlast_name, Executoremail, Executorpass, Executorphone,Executoradress,Executor_idfiscal,Executor_idorder,Executor_idrne) VALUES (?,?,?,?,?,?,?,?,?) ";
    db.query(
      sql,
      [
        Executorname,
        Executorlast_name,
        Executoremail,
        hashedExecutorpass,
        Executorphone,Executoradress,Executor_idfiscal,Executor_idorder,Executor_idrne,
      ],
      (err, result) => {
       if (err) console.log(err);
       else 
       res.status(201).json({ message: "Admin registered successfully" });
      }
    );

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
  
const login = async (req, res) => {
  try {
    const { Executoremail, Executorpass } = req.body;

    const sql = "SELECT * FROM Executor WHERE Executoremail = ?";
    db.query(sql, [Executoremail], async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else if (result.length === 0) {
        res.status(401).json({ message: "email or pass is incorrect" });
      } else {
        const user = result[0];
        const ExecutorpassMatch = await bcrypt.compare(Executorpass, user.Executorpass);
        if (ExecutorpassMatch) {
            const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '4h' });
            res.status(200).json({ message: "Login successful", token, id: user.idExecutor });
           
        } else {
          res.status(401).json({ message: "Executoremail or Executorpass is incorrect" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


let getAllExecutor = (req, res) => {
  db.query("SELECT * FROM Executor", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
};
const getUserById = (req, res) => {
  const idExecutor = req.params.id; 

  const query = "SELECT * FROM Executor WHERE idExecutor = ?";
  db.query(query, [idExecutor], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(result[0]);
    }
  });
};
const UpdateProfile = async (req, res) => {
    const idExecutor = req.params.id
      const {
    Executorname,
    Executorlast_name,
    Executoremail,
    Executorpass,
    image_url,
  } = req.body;
  const hashedExecutorpass = await bcrypt.hash(Executorpass, 10);

  let updates = [];
  if (Executorname) {
      updates.push({ column: "Executorname", value: Executorname });
  }
  if (image_url) {
    updates.push({ column: "image_url", value: image_url });
}
if (Executorpass) {
    updates.push({ column: "Executorpass", value: hashedExecutorpass });
  }
  if (Executorlast_name) {
      updates.push({ column: "Executorlast_name", value: Executorlast_name });
  }
  if (Executoremail) {
      updates.push({ column: "Executoremail", value: Executoremail });
  }
  if (updates.length === 0) {
      res.status(400).json({ error: "No updates provided" });
      return;
  }

  let sql = "UPDATE Executor SET ";
  let params = [];
  updates.forEach((update, index) => {
      sql += `${update.column} = ?`;
      params.push(update.value);
      if (index !== updates.length - 1) {
          sql += ", ";
      }
  });

  params.push(idExecutor);

  sql += " WHERE idExecutor = ?";

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
  getAllExecutor,
  register,
  login,
  getUserById,
  UpdateProfile
 
};