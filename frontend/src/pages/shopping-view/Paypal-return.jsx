import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/src/store/shop-slice/Shop_Order_slice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
//const paymentId = params.get("paymentId");
  const paymentId = params.get("token");
  const payerId = params.get("PayerID");

  // useEffect(() => {
  //   if (paymentId && payerId) {
  //     const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

  //     dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
  //       if (data?.payload?.success) {
  //         sessionStorage.removeItem("currentOrderId");
  //         window.location.href = "/shop/payment-success";
  //       }
  //     });
  //   }
  // }, [paymentId, payerId, dispatch]);

  const hasCalledCapture = useRef (false); // 1. Create a "lock"

useEffect(() => {
  // 2. Check if we already called it or if data is missing
  if (!paymentId || !payerId || hasCalledCapture.current) return;

  const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

  if (orderId) {
    hasCalledCapture.current = true; // 3. Set the lock to true immediately

    dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
      if (data?.payload?.success) {
        sessionStorage.removeItem("currentOrderId");
        window.location.href = "/shop/payment-success";
      }
    });
  }
}, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;