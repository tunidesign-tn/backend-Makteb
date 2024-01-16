var db = require("../database-mysql");

let getdata = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * from rappelles where users_id=?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            const sortedResult = result.sort((a, b) => b.idrappelles - a.idrappelles);
            
            // Filter the items with isUnRead==="false"
            const unreadItems = sortedResult.filter(item => item.isUnRead === "false");
            
            // Get the first six items
            const firstSixUnreadItems = unreadItems.slice(0, 6);
            
            res.send(firstSixUnreadItems);
        }
    });
};
let getallrappels = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * from rappelles where users_id=?`;
  db.query(sql, [id], (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
};

  let insertrappellesdata = (req, res) => {
    let {
      title,
      description,
      deadline,
      users_id
    } = req.body;
    const createdAt = new Date().toISOString().split('T')[0];
    const isUnRead = "false";
  
    // Format the deadline date
    deadline = new Date(deadline).toISOString().split('T')[0];
  
    const sql = `INSERT INTO rappelles (
      createdAt,
      isUnRead,
      title,
      description,
      deadline,
      users_id
    ) VALUES (?,?,?,?,?,?)`;
  
    db.query(
      sql,
      [
        createdAt,
        isUnRead,
        title,
        description,
        deadline,
        users_id
      ],
      (err, result) => {
        if (err) {
          console.error("SQL Error:", err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log("Query Result:", result);
          res.status(200).send(result);
        }
      }
    );
  };
  let deleteRappelleById = (req, res) => {
    const { id } = req.params;
  
    const sql = `DELETE FROM rappelles WHERE id = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        if (result.affectedRows > 0) {
          res.status(200).send(`Successfully deleted rappelle with id ${id}`);
        } else {
          res.status(404).send(`Rappelle with id ${id} not found`);
        }
      }
    });
  };
  let isUnRead = (req, res) => {
    const users_id = req.params.users_id; 
    const idrappelles = req.body.idrappelles; 
    if (!idrappelles || !Array.isArray(idrappelles) || idrappelles.length === 0) {
      return res.status(400).send("Invalid or empty array of idrappelles");
    }
  
    const sql = `UPDATE rappelles SET isUnRead = 'true' WHERE idrappelles IN (?) AND users_id = ?`;
  
    db.query(sql, [idrappelles,users_id], (err, result) => {
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



  module.exports = {
    getdata,
    getallrappels,
    insertrappellesdata,
    deleteRappelleById,
    isUnRead
  };