"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import { IoCardSharp } from "react-icons/io5";
import Input from "../components/inputs/input";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Button from "../components/Button";
import RadioButton from "../components/inputs/radio";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RadioInput from "../components/inputs/radio";
import { FaCcVisa } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { formatprice } from "@/utils/formatPrice";
import PaymentSuccess from "./paymentSuccess";
import axios from "axios";
import DottedLoadingSpinner from "../components/loading-spinner/SpinnerDotted";

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const router = useRouter();
  const searchParams: any = useSearchParams();

  const { cartTotalQty, cartTotalAmount } = useCart();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      streetAddress: "",
      city: "",
      state: "",
      phoneNumber: "",
      paymentMethod: "",
    },
  });

  /*   const FormSchema = z.object({
    paymentMethod: z.enum(["pay-on-delivery", "pay-now"], {
      required_error: "You need to select a notification type.",
    }),
    phone: z.string().min(2, {
      message: "Phone number must be at least 2 Characters",
    }),
  }); */

  /*  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  }); */

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    toast(JSON.stringify(data));
    console.log(data);

    if (cartProducts && data.paymentMethod === "pay-now") {
      setLoading(true);
      setError(false);

      fetch("/api/initialize-payment", {
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
        .then((data) => {
          console.log(data.data.authorization_url);
          window.location.href = data.data.authorization_url;

          return null;
        })
        .catch((error) => {
          setError(true);
          console.log("Error", error);
          toast.error("Something went wrong");
        });
    } else if (cartProducts && data.paymentMethod === "pay-on-delivery") {
      setError(false);
      setLoading(true);

      fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({
          items: cartProducts,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }

          return res.json();
        })
        .then((data) => {
          console.log(data);
          toast.success("Your order has been placed successfully.");
          setLoading(false);
          setIsPaymentSuccessful(true);
          return null;
        })
        .catch((error) => {
          setError(true);
          console.log("Error", error);
          toast.error("Something went wrong");
        });
    }
  };
  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      verifyTransaction(reference);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const verifyTransaction = async (reference: string) => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(
        `/api/verify-payment?reference=${reference}`
      );
      if (response.data.status === "success") {
        setIsPaymentSuccessful(true);
        setLoading(false);
        toast.success("Payment was successful!");
      } else {
        setError(true);
        toast.error("Payment verification failed");
      }
    } catch (error) {
      setError(true);
      toast.error("Something went wrong while verifying payment");
    } finally {
      setLoading(false);
    }
  };

  const isLoading = false;

  return (
    <Suspense fallback={<DottedLoadingSpinner />}>
      {loading ? (
        <DottedLoadingSpinner />
      ) : (
        <form /* onSubmit={handleSubmit(onSubmit)} */ className="relative">
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
                    id="streetAddress"
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
                  <Input
                    id="phoneNumber"
                    label="Phone Number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                  />
                </div>
                <div className="shadow-xl shadow-slate-200 rounded-md p-4 flex flex-col space-y-2 gap-2">
                  <div className="">
                    <p className="text-lg font-semibold text-slate-600">
                      Payment Method
                    </p>
                  </div>
                  <hr />

                  <div className="flex flex-col mb-8">
                    <RadioInput
                      id="pay-now"
                      label="Pay now"
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                      type="radio"
                      group="paymentMethod"
                    />
                    <div className="flex justify-between pr-4">
                      <p className="text-sm">
                        Complete payment with your card or a bank transfer.
                      </p>
                      <div className="flex gap-2">
                        <IoCardSharp className="text-lg" />
                        <FaCcVisa className="text-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col mb-6">
                    <RadioInput
                      id="pay-on-delivery"
                      label="Pay on delivery"
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                      type="radio"
                      group="paymentMethod"
                    />
                    <div className="flex justify-between pr-4 mt-1">
                      <p className="text-sm">
                        Pay with cash or transfer on-delivery.
                      </p>
                      <div className="flex gap-2">
                        <BsCashCoin className="text-lg" />
                      </div>
                    </div>
                  </div>

                  {/* 
              <FormField
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <RadioButton
                    field={field}
                    register={register}
                    name="paymentMethod"
                    required
                    options={paymentMethods}
                  />
                )}
              /> */}
                  {/* 
              <Input
                id="street-address"
                label="Street Address"
                -disabled={isLoading}
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
              /> */}
                </div>
              </div>

              <div className="col-span-1 md:col-span-5">
                <div className="shadow-xl flex flex-col gap-6 shadow-slate-200 rounded-md p-4">
                  <div className="">
                    <p className="text-lg font-semibold text-slate-600">
                      Order Summary
                    </p>
                  </div>
                  <hr />

                  <div className="flex justify-between">
                    <p className="">Items Total ({cartTotalQty})</p>
                    <p className="">{formatprice(cartTotalAmount)}</p>
                  </div>
                  <hr className="border-dashed" />
                  <div className="flex justify-between font-semibold">
                    <p>Subtotal</p>
                    <p>{formatprice(cartTotalAmount)}</p>
                  </div>

                  <div className="flex justify-between">
                    <p>Shipping fees</p>
                    <p>{formatprice(0)}</p>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <p>Total</p>
                    <p>{formatprice(cartTotalAmount)}</p>
                  </div>
                </div>

                <Button
                  label={isLoading ? "Processing..." : "Complete Order"}
                  onClick={handleSubmit(onSubmit)}
                ></Button>
              </div>
            </div>
          </div>
          {isPaymentSuccessful && <PaymentSuccess />}
        </form>
      )}
    </Suspense>
  );
};

export default CheckoutClient;
