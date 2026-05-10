# Stripe Payment Processing Setup Guide

## Overview
This guide walks you through setting up Stripe payment processing for CozyPaw. The checkout.html file has been created with a complete payment form that's ready for Stripe integration.

## Step 1: Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Sign up with your email (getcozypaw@gmail.com recommended)
3. Verify your email
4. Complete your account setup

## Step 2: Get Your API Keys
1. Log in to Stripe Dashboard
2. Go to **Developers** → **API Keys**
3. You'll see two keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

⚠️ **IMPORTANT**: Keep your Secret Key private! Never commit it to GitHub.

### Test Keys vs Live Keys
- **Test Mode**: Use these first to test payments
  - Publishable: `pk_test_...`
  - Secret: `sk_test_...`
  - Use card: `4242 4242 4242 4242`, any future expiry, any CVC

- **Live Mode**: Use these when you're ready to accept real payments
  - Publishable: `pk_live_...`
  - Secret: `sk_live_...`

## Step 3: Update Checkout Page
In `checkout.html`, find this line (around line 186):
```javascript
const stripe = Stripe('pk_test_1234567890'); // PLACEHOLDER - Add real key
```

Replace `pk_test_1234567890` with your **Publishable Key** from Stripe Dashboard.

**Example:**
```javascript
const stripe = Stripe('pk_test_51IxYqBCxxx...');
```

## Step 4: Set Up Backend (For Real Payments)
The current checkout.html shows a demo flow. For real payments, you need a backend to:

### Option A: Use Stripe's Hosted Checkout (Easiest)
1. Create a Stripe Checkout Session on your backend
2. Redirect customers to the Stripe-hosted page
3. Stripe handles all payment security

### Option B: Use Stripe Elements (More Customizable)
1. Create Payment Intent on backend
2. Use Stripe.js to confirm payment
3. Handle success/error responses

### Backend Setup (Node.js/Express Example)
```javascript
// api/create-payment-intent.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    try {
        const { amount } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
```

## Step 5: Environment Variables
For Vercel deployment, add your Stripe keys as environment variables:

1. Go to Vercel Dashboard → Your Project → Settings
2. Click **Environment Variables**
3. Add:
   - Name: `STRIPE_PUBLIC_KEY`, Value: `pk_test_...`
   - Name: `STRIPE_SECRET_KEY`, Value: `sk_test_...`

**DO NOT commit these to GitHub!**

## Step 6: Update Checkout Logic
The current checkout.html has a demo that shows a success message after 2 seconds. To make it actually process Stripe payments:

Replace the payment processing code in checkout.html:
```javascript
// CURRENT (Demo)
setTimeout(() => {
    alert('✅ Thank you for your order!');
    localStorage.removeItem('cozypawCart');
    window.location.href = 'index.html';
}, 2000);
```

With actual Stripe processing:
```javascript
// ACTUAL (With Stripe)
const { clientSecret } = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: totalAmount })
}).then(r => r.json());

const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
        card: cardElement,
        billing_details: { name, email, address: { line1: address, city, state, postal_code: zip } }
    }
});

if (paymentIntent.status === 'succeeded') {
    // Save order to database
    // Send confirmation email
    // Clear cart and redirect
    localStorage.removeItem('cozypawCart');
    window.location.href = 'order-confirmation.html?order=' + paymentIntent.id;
}
```

## Step 7: Testing
Use these test card numbers to verify:

| Card Number | Use Case |
|------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0025 0000 3155 | Requires authentication |
| 5555 5555 5555 4444 | Mastercard success |

**For all test cards:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

## Current Status
✅ Checkout page created with payment form
✅ Form validation
✅ Order summary display
⏳ Stripe integration (needs backend)
⏳ Payment intent creation
⏳ Order confirmation emails

## Next Steps
1. Complete Stripe setup (get API keys)
2. Set up backend for payment intent creation
3. Implement real payment processing
4. Add order confirmation emails
5. Create order history in account page
6. Set up email notifications

## Support Resources
- Stripe Docs: https://stripe.com/docs
- Stripe Dashboard: https://dashboard.stripe.com
- API Reference: https://stripe.com/docs/api

## Security Checklist
- [ ] Publishable key added to checkout.html
- [ ] Secret key stored in environment variables (NOT in code)
- [ ] HTTPS enabled for checkout page
- [ ] Payment form validation working
- [ ] Test mode working before switching to live
- [ ] Error handling implemented
- [ ] Order confirmation emails set up
