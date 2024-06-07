"use client";
import Container from "../components/Container";
import CartClient from "./CartClient";
import React from "react";
import { usePaystackPayment } from "react-paystack";

const config = {
  reference: new Date().getTime().toString(),
  email: "user@example.com",
  amount: 500000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  publicKey: "pk_test_e93b681bf3ccfcb8aeb664c4dac4dcb852df12c9",
};

// you can call this function anything
const onSuccess = (reference: any) => {
  // Implementation for whatever you want to do with reference and after success call.
  console.log(reference);
};

// you can call this function anything
const onClose = () => {
  // implementation for  whatever you want to do when the Paystack dialog closed.
  console.log("closed");
};

const PaystackHookExample = () => {
  const initializePayment: any = usePaystackPayment(config);
  return (
    <div>
      <button
        onClick={() => {
          initializePayment(onSuccess, onClose);
        }}
      >
        Paystack Hooks Implementation
      </button>
    </div>
  );
};

const Cart = () => {
  return (
    <div className="pt-8">
      <Container>
        <CartClient />
        <PaystackHookExample />
      </Container>
    </div>
  );
};

export default Cart;
