const bcrypt = require("bcryptjs");
const { Users } = require("../models");
const { Op } = require("sequelize");
const {
  generate_Access_token,
  generate_refresh_token,
} = require("../utils/TokenGenerator");
const jwt = require("jsonwebtoken");

// @desc    Create Superuser
// @route   POST /users/create-super-user
// @access  Public

const createSuperUser = async (req, res) => {
  const userData = req.body;
  try {
    const userExist = await Users.findOne({
      where: {
        [Op.or]: [{ Username: userData.Username }, { Email: userData.Email }],
      },
    });

    if (userExist) {
      return res.status(409).json({ message: "User already exist!" });
    }

    const userCount = await Users.count();
    if (userCount !== 0) {
      return res.status(403).json({ message: "ACCESS DENY" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(userData.Password, salt);

    const { Password, ...rest } = userData;
    const result = await Users.create({ ...rest, Password: hashedPassword });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// @desc    Create User
// @route   POST /users/create-users
// @access  Private

const createUser = async (req, res) => {
  const userData = req.body;
  try {
    const userExist = await Users.findOne({
      where: {
        [Op.or]: [{ Username: UserData.Username }, { Email: UserData.Email }],
      },
    });

    if (userExist) {
      return res.status(409).json({ message: "User already exist!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(userData.Password, salt);

    const { Password, ...rest } = userData;
    const result = await Users.create({ ...rest, Password: hashedPassword });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// @desc    Login User
// @route   POST /users/login
// @access  Public

const login = async (req, res) => {
  const userData = req.body;

  try {
    const user = await Users.findOne({
      where: { Username: userData.Username },
    });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const passwordCorrect = await bcrypt.compareSync(
      userData.Password,
      user.Password
    );

    if (!passwordCorrect) {
      return res.status(403).json({ message: "Credentials are invalid" });
    }

    const refreshToken = generate_refresh_token(user.ID);
    const accessToken = generate_Access_token({
      ID: user.ID,
      Access: user.Access,
      FullName: user.FullName,
      Role: user.Role,
      Department: user.Department,
    });

    res.cookie("r_token", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(accessToken);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// @desc    Refresh Token
// @route   GET /users/refresh
// @access  Private

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  try {
    if (!cookies?.r_token) return res.status(403).json({ message: "No Token" });

    const refreshToken = cookies.r_token;

    const decoded = await jwt.verify(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN
    );

    if (!decoded) return res.status(403).json({ message: "Token Invalid" });

    const response = await Users.findOne({ where: { ID: decoded.ID } });

    const newAccessToken = generate_Access_token({
      ID: response.ID,
      FullName: response.FullName,
      Access: response.Access,
      Role: response.Role,
      Department: response.Department,
    });

    return res.status(200).json(newAccessToken);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// @desc    Logout user
// @route   GET /users/logout
// @access  Private

const logout_user = async (req, res) => {
  res.clearCookie("r_token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
  });

  return res.status(200).json({ message: "User is logout" });
};

module.exports = {
  createSuperUser,
  createUser,
  login,
  refreshToken,
  logout_user,
};
