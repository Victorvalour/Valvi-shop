import { getCurrentUser } from "@/actions/getCurrentUser";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import axios from "axios";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb"
import { error } from "console";
import { PaymentType } from "@prisma/client";


const calculateOrderAmount = (items: CartProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
const itemTotal = item.price * item.quantity

return acc + itemTotal
    }, 0)

    const price:any =  Math.round((totalPrice + Number.EPSILON) * 100) /100

    return price
}

export async function POST(request: Request) {

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const body = await request.json()
    const {items, payment_reference, address} = body
    const total = calculateOrderAmount(items) * 100
    const {callback_url} = body

    const orderData: any = {
        user: {connect: {id: currentUser.id}},
        amount: total,
        currency: "NGN",
        status: "pending",
        deliveryStatus: "pending",
        paymentReference:  payment_reference,
        paymentType: "PAY_NOW",
        products: items,
        address: address
    }

    if (payment_reference) {
      //upadate an existing payment
    
    }

   else {
    
        //create the intent
//make the Api call
const params = {
    email: currentUser.email,
    amount: total,
    callback_url:  callback_url,
    
  };
  
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}`,
      'Content-Type': 'application/json'
    }
  };
  
 
    try {
      const response = await axios.post('https://api.paystack.co/transaction/initialize', params, options);
      const responseData = response.data;
      // You can use responseData here or return it to use later
  
  
      // Do something with responseData

      console.log('Transaction initialized:', responseData);
  
      orderData.paymentReference = responseData.data.reference

      await prisma.order.create({
        data: orderData,
    })
   


  return NextResponse.json(responseData);

    
  
  
    } catch (error) {
      console.error("Error during Paystack transaction initialization:", error);
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
    
      }
    }
  }

catch(error)  {
    // Handle any errors that were thrown
    console.error('Error initializing transaction:', error);
    return NextResponse.json({error: "Internal server errrr"})
  };

    }
