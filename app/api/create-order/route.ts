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
    const {items, address} = body
    const total = calculateOrderAmount(items) * 100
    const {callback_url} = body

    const  generateUniqueDateString = () => {
      var now = new Date();
      
      // Format the date and time components to ensure they are zero-padded if needed
      var year = now.getFullYear().toString();
      var month = ('0' + (now.getMonth() + 1)).slice(-2); // Months are 0-based
      var day = ('0' + now.getDate()).slice(-2);
      var hours = ('0' + now.getHours()).slice(-2);
      var minutes = ('0' + now.getMinutes()).slice(-2);
      var seconds = ('0' + now.getSeconds()).slice(-2);
      var milliseconds = ('00' + now.getMilliseconds()).slice(-3);
  

      var uniqueDateStr = year + month + day + hours + minutes + seconds + milliseconds;
      
      return uniqueDateStr;
  }

    const date = generateUniqueDateString()

    const dateRef = "No_ref_" + date
    const orderData: any = {
        user: {connect: {id: currentUser.id}},
        amount: total,
        currency: "NGN",
        status: "pending",
        deliveryStatus: "pending",
        paymentReference:  dateRef,
        paymentType: "PAY_ON_DELIVERY",
        products: items,
        address: address
    }


    
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

catch(error)  {
    // Handle any errors that were thrown
    console.error('Error Creating order:', error);
    return NextResponse.json({error: "Internal server errrr"})
  };

  
    }
