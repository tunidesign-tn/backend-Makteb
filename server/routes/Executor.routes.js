////عدل منفذ routes 

const router = require("express").Router();
const {
  login,
  getAllExecutor,
  register,
  getUserById,
  UpdateProfile,
} = require("../controllers/Executor.controller");


router.post("/loginExecutor", login);//done
router.get("/AllExecutor", getAllExecutor);//done
router.post("/registerExecutor", register);//done
router.get("/getExecutor/:id", getUserById);//done
router.put("/updateExecutor/:id", UpdateProfile);//done

module.exports = router;
