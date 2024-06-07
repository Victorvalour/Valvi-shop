"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import Input from "../components/inputs/input";
import { FieldValues, useForm } from "react-hook-form";
import Button from "../components/Button";

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (cartProducts) {
      setLoading(true);
      setError(false);

      fetch("/api/create-payment-inten", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({
          items: cartProducts,
          reference: paymentIntent,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }

          return res.json();
        })
        /*  .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        }) */
        .catch((error) => {
          setError(true);
          console.log("Error", error);
          toast.error("Something went wrong");
        });
    }
  }, [cartProducts, paymentIntent]);

  const isLoading = false;

  return (
    <>
      <div className="flex flex-col">
        <div className="mx-auto ">
          <Heading title="Checkout" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          <div className="col-span-1 md:col-span-7 w-full">
            <div className="shadow-xl shadow-slate-200 rounded-md p-4 flex flex-col space-y-2 ">
              <div className="">
                <p className="text-lg font-semibold text-slate-600">
                  Delivery Details
                </p>
              </div>
              <hr />
              <p className="text-sm  text-red-500">
                Delivery is within Nigeria *
              </p>
              <Input
                id="phone"
                label="Phone Number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <Input
                id="street-address"
                label="Street Address"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <Input
                id="city"
                label="City / Town"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <Input
                id="state"
                label="State"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>
            <div className="shadow-xl shadow-slate-200 rounded-md p-4 flex flex-col space-y-2 ">
              <div className="">
                <p className="text-lg font-semibold text-slate-600">
                  Payment Method
                </p>
              </div>
              <hr />
              <Input
                id="street-address"
                label="Street Address"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <Input
                id="city"
                label="City"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-5">
            <div className="shadow-xl shadow-slate-200 rounded-md p-4">
              <div className="">
                <p className="text-lg font-semibold text-slate-600">
                  Order Summary
                </p>
              </div>
              <hr />

              <div className="flex justify-between">
                <p className="">Items Total (12)</p>
                <p className="">#200.00</p>
              </div>
              <hr />
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>#1200</p>
              </div>
              <hr />
              <div className="flex justify-between">
                <p>Shipping fees</p>
                <p>#0.00</p>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>#440.00</p>
              </div>
            </div>

            <Button label="Complete Order" onClick={() => {}}></Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutClient;
