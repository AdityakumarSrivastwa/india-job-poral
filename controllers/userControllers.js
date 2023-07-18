/*const User = require("../models/userModel");

exports.updateUserController = async (req, res, next) => {
  const { name, email, lastName, location } = req.body;
  if (!name || !email || !lastName || !location) {
    next("Please Provide All Fields");
  }
  let user = await User.findOne({ _id: req.user.userId });
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();
  const token = user.createJWT();
  res.status(200).json({
    user,
    token,
  });
};*/

const User = require("../models/userModel");

exports.updateUserController = async (req, res, next) => {
  const { name, email, lastName, location } = req.body;
  if (!name || !email || !lastName || !location) {
    return res.status(400).json({ error: "Please provide all fields" });
  }

  try {
    const user = await User.findOne({ _id: req.user.userId });
    //let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   // if product is fond
    //   new: true,
    //   useFindAndModify: true,
    //   runValidators: true,
    // });

    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.location = location;

    // // Save the updated user
    await user.save();

    const token = user.createJWT();
    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};
