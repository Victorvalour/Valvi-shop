import { getCurrentUser } from "@/actions/getCurrentUser";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import axios from "axios";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb"




const calculateOrderAmount = (items: CartProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
const itemTotal = item.price * item.quantity

return acc + itemTotal
    }, 0)
    return totalPrice
}

export async function POST(request: Request) {

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
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
//make the Api call

  
  await prisma.order.create({
      data: orderData,
  })
 
  
}

catch(error)  {
    // Handle any errors that were thrown
    console.error('Error initializing transaction:', error);
    return NextResponse.json({error: "Internal server errrr"})
  };


    }
