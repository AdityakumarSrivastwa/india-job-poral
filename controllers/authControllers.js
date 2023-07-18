const User = require("../models/userModel");
exports.registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    //Validate
    if (!name) {
      next("Name is required");
      //   return res
      //     .status(400)
      //     .send({ success: false, message: "Plese provide Name" });
    }
    if (!email) {
      next("Email is required");
      //   return res
      //     .status(400)
      //     .send({ success: false, message: "Plese provide Email" });
    }
    if (!password) {
      next("Password is required and greater than 6 character");
      //   return res
      //     .status(400)
      //     .send({ success: false, message: "Plese provide password" });
    }

    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      next("Email Already Register Plese LogIn");
      //   return res.status(200).send({
      //     success: false,
      //     message: "Email Already Register Plese LogIn",
      //   });
    }
    const user = await User.create({ name, email, password });
    //token
    const token = user.createJWT();
    res.status(201).send({
      success: true,
      message: "User Created Successfully",
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    next(error);
    // console.log(error);
    // res.status(400).send({
    //   message: "Error in Register Controller",
    //   success: false,
    //   error,
    // });
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      next("Please Provide All fields");
    }
    // find user by email
    const user = await User.findOne({ email });
    if (!user) next("User not found");

    //compare password
    const ismatch = await user.comparePassword(password);
    if (!ismatch) {
      next("Invalid Username or password");
    }
    const token = user.createJWT();
    res
      .status(200)
      .json({ success: true, message: "Login successfully", user, token });
  } catch (error) {
    next(error);
  }
};
