const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");

// Helper: handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      error: errors.array(),
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ include: User });
    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, { include: User });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    return res.json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.createTask = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { title, description, status, priority, category, dueDate, userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      category,
      dueDate,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.updateTask = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const updatedFields = req.body;
    await task.update(updatedFields);

    return res.json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    await task.destroy();
    return res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
