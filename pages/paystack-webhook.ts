/* import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from 'micro';
import crypto from 'crypto';


export const config = {
  api: {
    bodyParser: false, // Disable the built-in body parser
  },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
   const secret = process.env.PAYSTACK_PUBLIC_KEY;
    
    const buf = await buffer(req);
    const sig = req.headers['x-paystack-signature'] as string;

    const hash = crypto.createHmac('sha512', secret!)
                       .update(buf)
                       .digest('hex');

                       if (hash !== sig) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(buf.toString());

     // Process the event
    switch (event.event) {
      case 'charge.success':
        // Handle successful charge event
        console.log('Charge was successful:', event.data);
        await prisma?.order.update(
            where: {payment}
        )
        break;
      case 'subscription.create':
        // Handle subscription creation event
        console.log('Subscription was created:', event.data);
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    res.status(200).send('Event received');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }

} */