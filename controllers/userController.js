const { validationResult } = require("express-validator");
const User = require("../models/User");

// Helper: handle errors
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

exports.createUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { name, email, role } = req.body;
  try {
    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, role });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.updateUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.update({ name, email, role });
    return res.json({ success: true, message: "User updated", data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();
    return res.json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
