import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './component/auth/AuthLayout'
import AuthLogin from './pages/auth/AuthLogin'
import AuthRegister from './pages/auth/AuthRegister'
import AdminLayout from './component/admin-view/AdminLayout'
import AdminDashboard from './pages/admin-view/AdminDashboard'
import AdminProducts from './pages/admin-view/AdminProducts'
import AdminOrders from './pages/admin-view/AdminOrders'
import AdminFeatures from './pages/admin-view/AdminFeatures'
import ShoppingLayout from './component/shopping-view/ShoppingLayout'
import NotFound from './pages/not-found/NotFound'
import ShoppingHome from './pages/shopping-view/ShoppingHome'
import ShoppingListing from './pages/shopping-view/ShoppingListing'
import ShoppingCheckOut from './pages/shopping-view/ShoppingCheckOut'
import ShoppingAccount from './pages/shopping-view/ShoppingAccount'
import AuthCheck from './component/common/AuthCheck'
import UnAuth from './pages/un-auth/UnAuth'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth_slice/auth_slice'
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from './pages/shopping-view/Paypal-return'
import PaymentSuccessPage from './pages/shopping-view/Payment-success'
import SearchProducts from './pages/shopping-view/Search'


export default function App() {
  // const isAuthenticated = false
  // const user=null
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // if (isLoading) return <div className="w-[800px] bg-black/20 h-[600px] animate-pulse rounded-md mx-auto mt-10" />;

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;




  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* <h1>hii</h1> */}
      <Routes>
        <Route path="/" element={<AuthCheck isAuthenticated={isAuthenticated} user={user} />} />
        <Route path="/auth" element={
          <AuthCheck isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </AuthCheck>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route path="/admin" element={
          <AuthCheck isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </AuthCheck>
        }>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route path='/shop' element={
          <AuthCheck isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </AuthCheck>
        }>
          <Route path='home' element={<ShoppingHome />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='checkout' element={<ShoppingCheckOut />} />
          <Route path='account' element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path='*' element={<NotFound />} />
        <Route path="/unauth-page" element={<UnAuth />} />
      </Routes>
    </div>
  )
}
