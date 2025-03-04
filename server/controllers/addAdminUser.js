import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { userTypes } from "../utils/constants/constants.js";

export const addAdminUser = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || "admin1@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@12345";

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = new User({
        email,
        name: "Admin User",
        type: userTypes.ADMIN,
        password: hashedPassword
      });

      await newUser.save();
      console.log("✅ Admin user created successfully!");
    } else {
      console.log("⚠️ Admin user already exists.");
    }
  } catch (error) {
    console.error("❌ Error adding admin user:", error);
  }
};

// addAdminUser()