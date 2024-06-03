const { comparePassword, hashPassword } = require("../helper/userHelper");
const { User } = require("../model/userModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { updateProduct } = require("./productController");
const { Order } = require("../model/orderModel");
exports.registerController = async (req, res) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;
    if (!email) {
      return res.send({
        message: "Enter Email",
      });
    }
    if (!password) {
      return res.send({
        message: "Enter Password",
      });
    }
    if (!firstName) {
      return res.send({
        message: "Enter Name",
      });
    }
    if (!lastName) {
      return res.send({
        message: "Enter Name",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(300).send({
        success: false,
        message: "Email Already Registered",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new User({
      firstName,
      email,
      lastName,
      role,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register controller",
      error,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.send({
        message: "Enter Email",
      });
    }
    if (!password) {
      return res.send({
        message: "Enter Password",
      });
    }
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Login First",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(201).send({
        success: false,
        message: "Wrong Credentials",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRETKEY);
    res.status(201).send({
      success: true,
      message: "LoggedIn Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(201).send({
      success: false,
      message: "Success in getting users",
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting Users",
      error,
    });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).send({
      success: true,
      message: "Fetched User Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting Users",
      error,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      uid,
      description,
      color,
      type,
      bluetoothVersion,
      category,
      discount,
      price,
      stock,
      model,
      screenSize,
      charging,
      battery,
      displayType,
      image,
      quantity,
    } = req.fields;
    const user = await User.find({ _id: id }).select("cart");
    const found = user[0].cart.findIndex((item) => item.name === name);
    if (found > -1) {
      console.log(found);
      const cart = user[0].cart;
      let qty = parseInt(user[0].cart[found].quantity);
      // Number(qty);
      const updatedUser = await User.updateOne(
        { _id: id , "cart.uid": uid},
        { $set: { "cart.$.quantity": qty + 1 } }
      );
      console.log(qty)
      return res.status(201).send({
        success: true,
        message: "Success",
      });
    } else {
      console.log("not found");
      const u = await User.findById(id);
      const updateUser = await User.updateOne(
        { _id: id },
        {
          $push: {
            cart: {
              name,
              uid,
              description,
              color,
              type,
              bluetoothVersion,
              category,
              discount,
              price,
              stock,
              model,
              screenSize,
              charging,
              battery,
              displayType,
              image,
              quantity
            },
          },
        }
      );

      // await u.save();
      return res.status(201).send({
        success: true,
        message: "Created Successfully",
        u,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Creating Cart",
      error,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await User.findById(id).select("cart");
    res.status(200).send({
      success: true,
      message: "Fetched Cart Successfully",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Cart",
      error,
    });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await User.findById(id).select("cart");
    res.status(200).send({
      success: true,
      message: "Fetched Cart Successfully",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Cart",
      error,
    });
  }
};

exports.deleteInCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.body;
    const cart = await User.findById(id).select("cart");
    const updatedUser = await User.updateOne(
      { _id: id },
      { $pull: { cart: { uid } } }
    );
    console.log(updatedUser);
    await cart.save();
    res.status(201).send({
      success: true,
      message: "Deleted Successfully",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in deleting cart",
      error,
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty, uid } = req.body;
    const cart = await User.findById(id).select("cart");
    const updatedUser = await User.updateOne(
      { _id: id, "cart.uid": uid },
      { $set: { "cart.$.quantity": qty } }
    );
    console.log(updatedUser);
    await cart.save();
    res.status(200).send({
      success: true,
      message: "Successfull",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating cart",
      error,
    });
  }
};

exports.resetCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const cart = await User.updateOne({ _id: id }, { $set: { cart: [] } });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Sucessfully empty cart",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Reseting Cart",
      error,
    });
  }
};
