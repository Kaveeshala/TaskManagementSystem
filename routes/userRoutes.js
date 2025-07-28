const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");

const router = express.Router();

// Validators
const userValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("role").optional().isIn(["user", "admin"]).withMessage("Role must be 'user' or 'admin'"),
];

// Routes
router.post("/users", userValidators, userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUser);
router.put("/users/:id", userValidators, userController.updateUser);
router.delete("/users/:id", userController.deleteUser);




module.exports = router;