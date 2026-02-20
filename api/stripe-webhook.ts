import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

// Konfigurace pro Vercel, aby nezpracovával tělo požadavku (potřebujeme ho raw pro Stripe)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Načtení raw body (Vercel ho dává do req.body, pokud je vypnutý parser)
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const clerkUserId = session.client_reference_id;

      if (clerkUserId) {
        console.log(`Pokouším se updatovat uživatele v Clerku: ${clerkUserId}`);
        
        // Zápis do Clerku, že uživatel je PRO - musí tady být PATCH!
        const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}/metadata`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_metadata: { isPro: true }
          }),
        });

        if (!clerkRes.ok) {
          const errorText = await clerkRes.text();
          console.error('Clerk API Error:', clerkRes.status, errorText);
        } else {
          console.log('Clerk update úspěšný!');
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
