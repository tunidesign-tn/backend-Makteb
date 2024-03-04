var db = require("../database-mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
  try {
    const { email, pass,name,lastname,phone,idrne,idorder,idfiscal} = req.body;

    const role ="Admin"
    const hashedpass = await bcrypt.hash(pass, 10);
    const created_at = new Date()

    const sql =
      "INSERT INTO users (name, lastname, email, pass, phone, created_at,role,idrne,idorder,idfiscal) VALUES (?,?,?,?,?,?,?,?,?,?) ";
    db.query(
      sql,
      [
        name,
        lastname,
        email,
        hashedpass,
        phone,
        created_at,
        role,
        idrne,idorder,idfiscal
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
    const { email, pass } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else if (result.length === 0) {
        res.status(401).json({ message: "Email or pass is incorrect" });
      } else {
        const user = result[0];
        const passMatch = await bcrypt.compare(pass, user.pass);
        if (passMatch) {
            const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '4h' });
            res.status(200).json({ message: "Login successful", token, id: user.idusers });
           
        } else {
          res.status(401).json({ message: "Email or pass is incorrect" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
// get all users
let getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
};
const getAllUsersExceptOne = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  const query = "SELECT * FROM users WHERE idusers <> ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
};
const getUserById = (req, res) => {
  const idusers = req.params.id; 

  const query = "SELECT * FROM users WHERE idusers = ?";
  db.query(query, [idusers], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(result[0]);
    }
  });
};
const UpdateProfile = (req, res) => {
  const idusers = req.params.idusers;
  const {
    name,
    lastname,
    email,
    phone,
  } = req.body;

  let updates = [];
  if (name) {
      updates.push({ column: "name", value: name });
  }
  if (lastname) {
      updates.push({ column: "lastname", value: lastname });
  }
  if (email) {
      updates.push({ column: "email", value: email });
  }
  if (phone) {
      updates.push({ column: "phone", value: phone });
  }
  if (updates.length === 0) {
      res.status(400).json({ error: "No updates provided" });
      return;
  }

  let sql = "UPDATE users SET ";
  let params = [];
  updates.forEach((update, index) => {
      sql += `${update.column} = ?`;
      params.push(update.value);
      if (index !== updates.length - 1) {
          sql += ", ";
      }
  });

  // Add idusers as a parameter
  params.push(idusers);

  sql += " WHERE idusers = ?";

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
  getAllUsers,
  register,
  login,
  getUserById,
  UpdateProfile,
  getAllUsersExceptOne
};
