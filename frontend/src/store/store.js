import { configureStore } from "@reduxjs/toolkit";  
import authreducer from "./auth_slice/auth_slice.js"
import AdminProductsSlice from "./admin-slice/Product_slice.js"
import ShopProductsSlice from "./shop-slice/Shop_Product_slice.js"
import ShopCartSlice from "./shop-slice/Shop_Cart_slice.js"
import CommonSlice from "./common-slice/Common_slice.js"
import ShopAddressSlice from "./shop-slice/Shop_Address_slice.js"
import ShopOrderSlice from "./shop-slice/Shop_Order_slice.js"
import AdminOrderSlice from "./admin-slice/Order_slice.js"
import searchSlice from "./shop-slice/Shop_Search_slice.js"
import shopReviewSlice from "./shop-slice/Shop_Review_slice.js"


const store = configureStore(
    {
        reducer:{
            auth : authreducer,

            adminProducts : AdminProductsSlice,
            adminOrder : AdminOrderSlice,

            shopProducts : ShopProductsSlice,
            shopCart : ShopCartSlice,
            // common : CommonSlice,
            shopAddress : ShopAddressSlice,
            shopOrder : ShopOrderSlice,
            // adminOrder : AdminOrderSlice,
            shopSearch : searchSlice,
            shopReview : shopReviewSlice,

            commonFeature : CommonSlice,
        }
    }
)   

export default store
