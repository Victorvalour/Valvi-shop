import { getCurrentUser } from "@/actions/getCurrentUser";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import axios from "axios";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb"
import { error } from "console";




const calculateOrderAmount = (items: CartProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
const itemTotal = item.price * item.quantity

return acc + itemTotal
    }, 0)

    const price:any =  Math.round((totalPrice + Number.EPSILON) * 100) / 10000

    return price
}

export async function POST(request: Request) {

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.error()
    }

    const body = await request.json()
    const {items} = body
    const total = calculateOrderAmount(items) * 100

    const orderData: any = {
        user: {connect: {id: currentUser.id}},
        amount: total,
        currency: "NGN",
        status: "pending",
        deliveryStatus: "pending",
        products: items
    }

    
        //create the intent
  
 
    try {
      console.log(orderData.amount)
   //Add the order to the database
  
  await prisma.order.create({
      data: orderData,
  })
  return NextResponse.json({status: 201,
    message: "Order has been registered"
  });
  
  
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error if you need to handle it elsewhere
    }
  }

catch(error)  {
    // Handle any errors that were thrown
    console.error('Error adding order to database', error);
    return NextResponse.json({error: "Internal server errrr"})
  };


    }
