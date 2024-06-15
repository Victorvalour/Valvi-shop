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
    const {items, payment_reference} = body
    const total = calculateOrderAmount(items) * 100
    const {callback_url} = body

    const orderData: any = {
        user: {connect: {id: currentUser.id}},
        amount: total,
        currency: "NGN",
        status: "",
        deliveryStatus: "pending",
        paymentReference:  "N/A",
        paymentType: "PAY_ON_DELIVERY",
        products: items
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
    callback_url:  callback_url
  };
  
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}`,
      'Content-Type': 'application/json'
    }
  };
  
 
    try {
   

      await prisma.order.create({
        data: orderData,
    })
   


  return NextResponse.json({status: 201,
    message: "Your order has been created successfully"
  });

    
  
  
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error if you need to handle it elsewhere
      } 
    }
  }

catch(error)  {
    // Handle any errors that were thrown
    console.error('Error initializing transaction:', error);
    return NextResponse.json({error: "Internal server errrr"})
  };

  
    }
