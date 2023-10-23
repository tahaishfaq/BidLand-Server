const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const nodemailer = require('nodemailer');



const sendConfirmationEmail = (email) => {
  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // SMTP server hostname
    port: 587,                 // Port for secure SMTP (e.g., 587 for TLS)
    secure: false,             // true for 465, false for other ports
    auth: {
      user: 'tahaishfaq71@@gmail.com',  // Your Gmail email
      pass: 'wyfk chkk hsjh upvr'  // SMTP password (or app password for Gmail)
    }
  });

  const mailOptions = {
    from: 'admin@gmail.com',
    to: email,
    subject: 'Account Confirmation',
    text: 'Thank you for registering. Please click the link to confirm your account.'
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent:', info.response);
    }
  });
};

const registerUser = async (req, res) => {
  const { username, email, password, role, phone, profilePicture } = req.body;

  try {
    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the same email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      phone, 
      profilePicture
    });

    await user.save();
    sendConfirmationEmail(email);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        rating: user.rating
      },
      'HelloWorld',
      {
        expiresIn: '24h'
      }
    );

    const expiresInMilliseconds = 24 * 60 * 60 * 1000;
    res.json({
      token,
      expiresIn: expiresInMilliseconds,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        rating: user.rating
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Generate a password reset token
  const resetToken = await generatePasswordResetToken(email);

  // Send password reset instructions
  await sendPasswordResetInstructions(email, resetToken);

  res.status(200).json({ message: 'Password reset instructions sent to your email.' });
};




const sendPasswordResetInstructions = async (email, resetToken) => {
  const resetLink = `http://localhost:5173/resetpassword/${email}/${resetToken}`; // Adjust the reset link accordingly

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // SMTP server hostname
    port: 587,                 // Port for secure SMTP (e.g., 587 for TLS)
    secure: false,             // true for 465, false for other ports
    auth: {
      user: 'tahaishfaq71@@gmail.com',  // Your Gmail email
      pass: 'wyfk chkk hsjh upvr'  // SMTP password (or app password for Gmail)
    }
  });
  const mailOptions = {
    from: 'admin@gmail.com',
    to: email,
    subject: 'Password Reset Instructions',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent:', info.response);
    }
  });
};
const generatePasswordResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found.');
  }

  const token = jwt.sign({ email }, 'HelloWorld', { expiresIn: '1h' });
  return token;
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, 'HelloWorld');
    if (decoded.email !== email) {
      throw new Error('Invalid token');
    }
    const { email } = decoded;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired reset token.' });
  }
};
const viewSellerProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const seller = await User.findById(userId).select('-password');;

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json({ seller });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const viewUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllSellers = async (req, res) => {
  try {
    // Find all users with role "seller"
    const sellers = await User.find({ role: 'seller' }, { password: 0 });

    res.json({ sellers });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    if (updatedUserData.email || updatedUserData.username) {
      // Check if the new email or username already exists (excluding the current user)
      const existingUser = await User.findOne({
        $or: [
          { email: updatedUserData.email },
          { username: updatedUserData.username },
        ],
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email or username already exists' });
      }
    }
    // Update the user by their ID
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword , viewSellerProfile , getAllSellers, updateUser, viewUserProfile};

