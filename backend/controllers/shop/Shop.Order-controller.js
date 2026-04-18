// const paypal = require("../../helpers/Paypal");
// const Order = require("../../models/Order.model");
// const Cart = require("../../models/Cart.model");
// const Product = require("../../models/Product");

// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentMethod,
//       paymentStatus,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       paymentId,
//       payerId,
//       cartId,
//     } = req.body;

//     const create_payment_json = {
//       intent: "sale",
//       payer: {
//         payment_method: "paypal",
//       },
//       redirect_urls: {
//         return_url: "http://localhost:5173/shop/paypal-return",
//         cancel_url: "http://localhost:5173/shop/paypal-cancel",
//       },
//       transactions: [
//         {
//           item_list: {
//             items: cartItems.map((item) => ({
//               name: item.title,
//               sku: item.productId,
//               price: item.price.toFixed(2),
//               currency: "USD",
//               quantity: item.quantity,
//             })),
//           },
//           amount: {
//             currency: "USD",
//             total: totalAmount.toFixed(2),
//           },
//           description: "description",
//         },
//       ],
//     };

//     paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
//       if (error) {
//         console.log(error);

//         return res.status(500).json({
//           success: false,
//           message: "Error while creating paypal payment",
//         });
//       } else {
//         const newlyCreatedOrder = new Order({
//           userId,
//           cartId,
//           cartItems,
//           addressInfo,
//           orderStatus,
//           paymentMethod,
//           paymentStatus,
//           totalAmount,
//           orderDate,
//           orderUpdateDate,
//           paymentId,
//           payerId,
//         });

//         await newlyCreatedOrder.save();

//         const approvalURL = paymentInfo.links.find(
//           (link) => link.rel === "approval_url"
//         ).href;

//         res.status(201).json({
//           success: true,
//           approvalURL,
//           orderId: newlyCreatedOrder._id,
//         });
//       }
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const capturePayment = async (req, res) => {
//   try {
//     const { paymentId, payerId, orderId } = req.body;

//     let order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order can not be found",
//       });
//     }

//     order.paymentStatus = "paid";
//     order.orderStatus = "confirmed";
//     order.paymentId = paymentId;
//     order.payerId = payerId;

//     for (let item of order.cartItems) {
//       let product = await Product.findById(item.productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Not enough stock for this product ${product.title}`,
//         });
//       }

//       product.totalStock -= item.quantity;

//       await product.save();
//     }

//     const getCartId = order.cartId;
//     await Cart.findByIdAndDelete(getCartId);

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order confirmed",
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getAllOrdersByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const orders = await Order.find({ userId });

//     if (!orders.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No orders found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getOrderDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// module.exports = {
//   createOrder,
//   capturePayment,
//   getAllOrdersByUser,
//   getOrderDetails,
// };

const { OrdersController } = require("@paypal/paypal-server-sdk");
const client = require("../../helpers/Paypal"); // Your configured client
const Order = require("../../models/Order.model");
const Cart = require("../../models/Cart.model");
const Product = require("../../models/Product");

// Initialize the Orders Controller using your client
const ordersController = new OrdersController(client);

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // V2 Orders Payload
    const orderRequest = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: totalAmount.toFixed(2),
              /* Optional: To pass item-level details, add 'breakdown' and 'items' arrays here */
            },
          },
        ],
        paymentSource: {
          paypal: {
            experienceContext: {
              paymentMethodPreference: "IMMEDIATE_PAYMENT_REQUIRED",
              returnUrl: "http://localhost:5173/shop/paypal-return",
              cancelUrl: "http://localhost:5173/shop/paypal-cancel",
            },
          },
        },
      },
    };

    // Create order using the new SDK
    const { body: paymentInfo } = await ordersController.createOrder(orderRequest);

    // Save order in your database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: paymentInfo.id, // V2 uses order ID for tracking
    });

    await newlyCreatedOrder.save();

    // Extract the approval URL (in V2, the rel is typically "payer-action" or "approve")
    // const approvalURL = paymentInfo.links.find(
    //   (link) => link.rel === "approve" || link.rel === "payer-action"
    // ).href;
    // NEW WAY (More robust)
    // const links = paymentInfo.links || []; // Fallback to empty array if undefined
    // const approvalLink = links.find((link) => link.rel === "approve" || link.rel === "payer-action");

    // if (!approvalLink) {
    //   throw new Error("No approval URL found in PayPal response");
    // }

    // const approvalURL = approvalLink.href;
    // 1. Get the links array safely
  

    // 2. Look for the redirect URL
    // We check for 'payer-action' (V2 standard) OR 'approve' (Fallback)
    // const approvalLink = links.find(
    //   (link) => link.rel === "payer-action" || link.rel === "approve"
    // );

    // 3. If the SDK didn't parse it correctly, it might be in paymentInfo.body.links
    // (This happens in some SDK configurations)
    // if (!approvalLink && paymentInfo.body && paymentInfo.body.links) {
    //    const retryLink = paymentInfo.body.links.find(
    //      (link) => link.rel === "payer-action" || link.rel === "approve"
    //    );
    //    if (retryLink) approvalURL = retryLink.href;
    // }

    // if (!approvalLink) {
    //   console.error("Full Payment Info for debugging:", paymentInfo);
    //   return res.status(500).json({
    //     success: false,
    //     message: "PayPal did not provide an approval URL. Check server logs.",
    //   });
    // }

    // const approvalURL = approvalLink.href;

    // // 1. Force the SDK response into a plain JSON object
    // const paymentData = JSON.parse(JSON.stringify(paymentInfo));
    
    // // 2. Get the links from our clean object
    // const links = paymentData.links || [];
    
    // console.log("Cleaned Links:", links); // Should now show the links clearly!

    // // 3. Find the payer-action link
    // const approvalLink = links.find(
    //   (link) => link.rel === "payer-action" || link.rel === "approve"
    // );

    // // 1. Log the keys to see where the SDK is hiding the data
    // console.log("SDK Response Keys:", Object.keys(paymentInfo));

    // // 2. Try to get links from the result, the body, or the object itself
    // const links = paymentInfo.result?.links || paymentInfo.body?.links || paymentInfo.links || [];
    
    // console.log("Found Links:", JSON.stringify(links));

    // // 3. Find the link (Checking for 'payer-action' first)
    // const approvalLink = links.find(
    //   (link) => link.rel === "payer-action" || link.rel === "approve"
    // );

    // 1. Force the response body to a string and parse it into a real object!
    const paymentData = JSON.parse(paymentInfo.toString());
    
    // 2. Now links will be a real, accessible array!
    const links = paymentData.links || [];
    
    console.log("Found Links:", links);

    // 3. Find the redirect URL
    const approvalLink = links.find(
      (link) => link.rel === "payer-action" || link.rel === "approve"
    );

    if (!approvalLink) {
      return res.status(500).json({
        success: false,
        message: "PayPal did not provide an approval URL.",
      });
    }

    const approvalURL = approvalLink.href;

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error while creating PayPal payment",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // ATOMIC check: Only claim the order if it's still "pending"
    // This prevents two simultaneous requests from both calling PayPal
    const order = await Order.findOneAndUpdate(
      { _id: orderId, orderStatus: { $ne: "confirmed" } }, // Only match if NOT already confirmed
      { $set: { orderStatus: "processing" } },             // Mark as "processing" immediately
      { new: false }                                        // Return the OLD document
    );

    // If no document was returned, the order was already confirmed (another request got here first)
    if (!order) {
      const confirmedOrder = await Order.findById(orderId);
      return res.status(200).json({
        success: true,
        message: "Order already confirmed",
        data: confirmedOrder,
      });
    }

    // Capture the payment using the PayPal order ID
    const { body: captureInfo } = await ordersController.captureOrder({
      id: paymentId,
    });

    // The SDK returns a special object, NOT a plain JS object.
    // We must use toString() + JSON.parse() to access its properties (same as createOrder)
    const captureData = JSON.parse(captureInfo.toString());

    console.log("PayPal Capture Status:", captureData.status);

    // Check if the capture was successful
    if (captureData.status !== "COMPLETED") {
      // Revert order back to "pending" so user can try again
      await Order.findByIdAndUpdate(orderId, { $set: { orderStatus: "pending" } });
      return res.status(400).json({
        success: false,
        message: `Payment capture failed with status: ${captureData.status}`,
      });
    }

    // Update the order with final confirmed status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payerId = payerId;

    // Adjust inventory
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${item.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log("Capture Error:", JSON.stringify(e?.result || e?.message || e));

    // Handle PayPal "already captured" error from SDK
    const issue = e?.result?.details?.[0]?.issue;
    if (issue === "ORDER_ALREADY_CAPTURED") {
      return res.status(200).json({ success: true, message: "Order already processed" });
    }

    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  // ... No changes needed here, DB logic is fine ...
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found!" });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const getOrderDetails = async (req, res) => {
  // ... No changes needed here, DB logic is fine ...
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};