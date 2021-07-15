# Sally website

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

With [firebase](https://firebase.google.com/) as backend option.

## Web 

### Config

Stripe key location [/src/stripe.ts](./src/stripe.ts)

Firebase config location [/src/fbConfig.json](./src/fbConfig.json)

## Functions

### Config

Setup functions config command

    firebase functions:config:set stripe.key="STRIPE_KEY" stripe.webhook="WEBHOOK_KEY"
    
After it upload functions to firebase

- `stripe.key` - Api keys/Secret key
- `stripe.webhook` - Webhook / Signing secret

### Stripe Webhook events

- customer.subscription.created
- customer.subscription.updated 
- customer.subscription.deleted
- payment_intent.succeeded

Stripe webhook function should be made public. Go to
**Functions / Select webhook function / Details usage stats / Permissions / Add**

    New members: allUsers
    Role: Cloud Functions Invoker
