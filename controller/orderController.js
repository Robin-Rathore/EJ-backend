const { Order } = require("../model/orderModel");
const moment = require("moment");
exports.createOrder = async (req, res) => {
  try {
    let {id} = req.params;
    let {phone, address, ...products } = req.body;
    console.log(products);
    products = {
      ...products,
      status:"pending",
      date: moment().calendar(),
    };

    const setOrder = new Order({ id: id, products,address,phone }).save();
    res.status(201).send({
      success: true,
      message: "Succcess in creating Order",
      setOrder,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating order",
      error,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const o = await Order.find({ id: id }).select("products");
    // const order = o[0].products[0].orders
    res.status(200).send({
      success: true,
      message: "Fetched Successfully",
      o,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting orders",
      error,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in deleting Order",
      error,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).send({
      success: true,
      message: "Success in getting Orders",
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in fetching orders",
      error,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const  {newStatus} = req.body;
    console.log(newStatus)
    const order = await Order.findById(id).select("products");
    console.log(order)
    const updatedOrder = await Order.updateOne(
      { _id: id },
      { $set: { "products.0.status": newStatus } }
    );
    console.log( order.products[0].status);
    console.log(updatedOrder);
    await order.save();
    res.status(201).send({
      success: true,
      message: "Updated Order successfully",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating orders",
      error,
    });
  }
};

exports.getPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Order.find({ id: id });
    res.status(200).send({
      success: true,
      message: "Fetched Cart Successfully",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in deleting Order",
      error,
    });
  }
};
