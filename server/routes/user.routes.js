const router = require("express").Router();
const {
  login,
  getAllUsers,
  register,
  getUserById,
  UpdateProfile,
} = require("../controllers/user.controller");

// auth for all
router.post("/login", login);//done
router.get("/allUsers", getAllUsers);//done
router.post("/registeruser", register);//done
router.get("/getUser/:id", getUserById);//done
router.put("/update/:id", UpdateProfile);//done

module.exports = router;
