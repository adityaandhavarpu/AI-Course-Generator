import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};