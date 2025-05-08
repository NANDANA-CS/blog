import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../models/user_model.js";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, or GIF images are allowed"));
    }
  },
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER || "c02c2fd894074a",
    pass: process.env.MAILTRAP_PASS || "e21d18254c39d7",
  },
});



// Signup function

export const signUp = async (req, res) => {
  try {
    console.log("Signup request received:", req.body, req.file);

    const { username, email, password, confirmPassword } = req.body;
    const file = req.file;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ message: "Username must be 3-20 characters" });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, including one uppercase, one lowercase, one number, and one special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExist = await userSchema.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      username,
      email,
      password: hashedPassword,
      profile_pic: file ? `${file.filename}` : null,
    };

    const newUser = new userSchema(userData);
    await newUser.save();

    const mailOptions = {
      from: "no-reply@yourapp.com",
      to: email,
      subject: "Welcome to Our App!",
      text: `Hi ${username},\n\nYour account has been created successfully!\n\nBest,\nYour App Team`,
    };
    await transporter.sendMail(mailOptions).catch((err) => {
      console.warn("Email sending failed:", err);
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });

    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Login function
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await userSchema.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }


    const isPassMatch = await bcrypt.compare(password, userExist.password);
    if (!isPassMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Logged in successfully", token, id: userExist._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ message: err.message });
  }
};

// getuser fn

export const getuser = async (req, res) => {
  console.log("inside getuser controller")
  const userId = req.params.id;
  console.log(userId,"this is userid");
  

  if (!userId ) {
    return res.status(400).json({ message: 'Invalid or missing user ID' });
  }

  try {
    const user = await userSchema.findOne({_id:userId});
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).send({message: "user fetched", user})
  } catch (error) {
    console.error('Error in getuser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// edit
export const editdata = async (req, res) => {
  console.log(req.body)
  try {
      const { username, email } = req.body;
      const { id } = req.params
      const updatedData = {
          username,
          email,
        };
        if (req.file) {
            updatedData.photo = req.file.filename;
        }
        
        console.log("updatedata function")
        const data = await userSchema.findByIdAndUpdate( id, updatedData, { new: true });

  if (!data) return res.status(404).json({ message: "User not found" });

  res.json(data);
} catch (err) {
  console.error("Error updating profile:", err);
  res.status(500).json({ message: "Failed to update profile" });
}
}


// Export multer
export const uploadMiddleware = upload.single("file");