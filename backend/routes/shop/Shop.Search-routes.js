const express = require("express")
const router = express.Router();
const {searchProducts} = require("../../controllers/shop/Search-controller")

router.get("/:keyword", searchProducts)

module.exports = router