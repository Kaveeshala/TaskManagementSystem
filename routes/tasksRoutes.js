const express = require("express");
const { body } = require("express-validator");
const taskController = require("../controllers/taskController");

const router = express.Router();

// Validators for creating tasks
const createTaskValidators = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
  
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be 'pending', 'in-progress', or 'completed'"),
  
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be 'low', 'medium', or 'high'"),
  
  body("category")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Category must be less than 50 characters"),
  
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be in ISO8601 format (YYYY-MM-DD)")
    .custom((value) => {
      const dueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
      
      if (dueDate <= today) {
        throw new Error("Due date must be in the future");
      }
      return true;
    }),
  
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
];

// Validators for updating tasks (more flexible - fields can be optional)
const updateTaskValidators = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
  
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be 'pending', 'in-progress', or 'completed'"),
  
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be 'low', 'medium', or 'high'"),
  
  body("category")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Category must be less than 50 characters"),
  
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be in ISO8601 format (YYYY-MM-DD)")
    .custom((value) => {
      if (value) {
        const dueDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dueDate <= today) {
          throw new Error("Due date must be in the future");
        }
      }
      return true;
    }),
  
  body("userId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
];

// Routes (WITHOUT /api prefix since it's already added in server.js)
router.get("/tasks", taskController.getTasks);
router.get("/tasks/:id", taskController.getTask);
router.post("/tasks", createTaskValidators, taskController.createTask);
router.put("/tasks/:id", updateTaskValidators, taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

module.exports = router;