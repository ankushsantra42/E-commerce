const express = require("express"); 
const router = express.Router();
const { addProductReview, getProductReviews } = require("../../controllers/shop/Product-review-controller");

router.post("/add-review", addProductReview);
router.get("/get-reviews/:productId", getProductReviews);

module.exports = router;    