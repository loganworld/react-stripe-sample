import Stripe from 'stripe';

const paymentApi = app => {
    app.get('/', (req, res) => {
        res.send({
            message: 'Ping from Checkout Server',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV,
        });
    });

    app.post('/payment/session-initiate', async (req, res) => {
        try {
            const {
                clientReferenceId,
                customerEmail,
                lineItem,
                successUrl,
                cancelUrl,
            } = req.body;

            const stripe = Stripe('sk_test_51LSOMUAWSmSN13IclfZrRPvl1AUv5cSmxm4h4NP3LzADzNOGqtQZEAEG2QaNhfdXIRH4b8vLrOMkCGVlwBE9bWjo00GZsDKbz1');

            let session;

            try {
                session = await stripe.checkout.sessions.create({
                    client_reference_id: clientReferenceId,
                    customer_email: customerEmail,
                    payment_method_types: ['card'],
                    line_items: [lineItem],
                    payment_intent_data: {
                        description: `buy eth`,
                    },
                    mode: 'payment',
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                });

                console.log(session.id);
            } catch (error) {
                console.log("session error", error.message);
                res.status(500).send({ error });
            }

            return res.status(200).send(session);
        } catch (error) {
            console.log("server", error.message);
            res.status(500).send({ error });
        }
    });

    app.post('/payment/session-complete', async (req, res) => {
        let event;

        try {
            event = Stripe.webhooks.constructEvent(
                req.rawBody,
                req.headers['stripe-signature'],
                'whsec_2c209b234e2d28e5b80d2e8e1aaba02d1b66f9c67bd347dc61a66cf6e5025bf6'
            );
            console.log("req.rawBody", req.rawBody);
        } catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            try {
                console.log(session.id);
                // complete your customer's order
                // e.g. save the purchased product into your database
                // take the clientReferenceId to map your customer to a product
            } catch (error) {
                return res.status(404).send({ error, session });
            }
        }

        return res.status(200).send({ received: true });
    });

    return app;
};

export default paymentApi;
