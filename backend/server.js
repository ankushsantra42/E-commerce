const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./db/dbConnects")
const cookieParser = require("cookie-parser");
// cpnst express.json
const cors = require("cors")


dotenv.config();
const app = express();
app.use(
    cors({
        origin : 'http://localhost:5173',
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        credentials : true,
        allowedHeaders : ['Content-Type', 'Authorization','Cache-Control','expires']  ,
    })
)

app.use(express.json());
app.use(cookieParser());


//connect to mongo db
dbConnect();

const PORT = process.env.PORT || 5000;


//importing auth router
const authRoutes = require("./routes/auth/auth-routes");
const adminProductRoutes = require("./routes/admin/Products-route")
const shopProductRoutes = require("./routes/shop/Shop.Products-routes")
const shopCartRoutes = require("./routes/shop/Shop.Cart-routes")
const shopAddressRoutes = require("./routes/shop/Shop.Address-routes")
const featureImageRoutes = require("./routes/common/Feature-image")
const shopOrderRoutes = require("./routes/shop/Shop.Order-routes")
const adminOrderRoutes = require("./routes/admin/Admin.Order-routes")
const shopSearchRoutes = require("./routes/shop/Shop.Search-routes")
const shopReviewRoutes = require("./routes/shop/Shop.ProductsReview-routes")
const commonFeatureRoutes = require("./routes/common/Feature-image")


//using auth router
app.use("/api/auth", authRoutes);
app.use("/api/admin/products", adminProductRoutes)
app.use("/api/admin/orders", adminOrderRoutes)
app.use("/api/shop/products", shopProductRoutes)
app.use("/api/shop/cart", shopCartRoutes)
app.use("/api/shop/address", shopAddressRoutes)
app.use("/api/common/feature", featureImageRoutes)
app.use("/api/shop/order", shopOrderRoutes)
app.use("/api/shop/search", shopSearchRoutes)
app.use("/api/shop/reviews", shopReviewRoutes)
app.use("/api/common/feature", commonFeatureRoutes)


    

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 