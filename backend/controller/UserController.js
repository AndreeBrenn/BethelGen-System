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

//#region  SUPERUSER FUNCTION
const createSuperUser = async (req, res, next) => {
  const userData = req.body;
  try {
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
    next(error);
  }
};

// @desc    Detect Superuser
// @route   GET /users/detect-superuser
// @access  Public

const detect_Superuser = async (req, res, next) => {
  try {
    const userCount = await Users.count();
    if (userCount !== 0) {
      return res.status(200).json({ count: 1 });
    }

    return res.status(200).json({ count: 0 });
  } catch (error) {
    next(error);
  }
};

//#endregion

//#region USERS FUNCTION
// @desc    Create User
// @route   POST /users/create-users
// @access  Private

const createUser = async (req, res, next) => {
  const userData = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(userData.Password, salt);

    const { Password, ...rest } = userData;
    const result = await Users.create({ ...rest, Password: hashedPassword });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc    Get Users
// @route   GET /users/get-users/:search
// @access  Private

const getAllUsers = async (req, res, next) => {
  const { search, offset, itemsPerPage } = req.query;

  try {
    const result = await Users.findAndCountAll({
      where: {
        ...(search && {
          [Op.or]: [
            { LastName: { [Op.iLike]: `%${search}%` } },
            { FirstName: { [Op.iLike]: `%${search}%` } },
          ],
        }),
      },
      attributes: { exclude: ["Password"] },
      limit: itemsPerPage,
      offset,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc    Update Users
// @route   PUT /users/update-users/
// @access  Private

const updateUser = async (req, res, next) => {
  const userData = req.body;
  try {
    const { ID, ...rest } = userData;

    await Users.update({ ...rest }, { where: { ID } });

    const updatedUser = await Users.findByPk(ID);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc    Login User
// @route   POST /users/login
// @access  Public

const login = async (req, res, next) => {
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
      LastName: user.LastName,
      FirstName: user.FirstName,
      Role: user.Role,
      Department: user.Department,
      Email: user.Email,
      Branch: user.Branch,
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
    next(error);
  }
};

// @desc    Refresh Token
// @route   GET /users/refresh
// @access  Private

const refreshToken = async (req, res, next) => {
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
      LastName: response.LastName,
      FirstName: response.FirstName,
      Access: response.Access,
      Role: response.Role,
      Department: response.Department,
      Email: response.Email,
      Branch: response.Branch,
    });

    return res.status(200).json(newAccessToken);
  } catch (error) {
    console.log(error);
    next(error);
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
//#endregion

module.exports = {
  createSuperUser,
  createUser,
  login,
  refreshToken,
  logout_user,
  detect_Superuser,
  getAllUsers,
  updateUser,
};
