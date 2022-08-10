import React from 'react';
import scriptLoader from 'react-async-script-loader';
import axios from 'axios';

const CURRENCY = 'eur';

const toCent = amount => amount * 100;

const StripeForm = ({ isScriptLoaded, isScriptLoadSucceed }) => {
    const [stripe, setStripe] = React.useState(null);

    React.useEffect(() => {
        if (isScriptLoaded && isScriptLoadSucceed) {
            setStripe(window.Stripe('pk_test_51LSOMUAWSmSN13IcFbFAuHzeHEP2XUGZGxN4juEiaK9R0neGILKvY1Bd8KUGeKgZOvRk3BK0aMBuDm56C6cnGRZE00JfRMtX7M'));
        }
    }, [isScriptLoaded, isScriptLoadSucceed]);

    const [amount, setAmount] = React.useState(0);

    const handleSubmit = async event => {
        event.preventDefault();

        const session = await axios.post(
            'http://localhost:8888/payment/session-initiate',
            {
                customerEmail: 'example@gmail.com',
                clientReferenceId:
                    'IDENTIFIER_TO_MAP_YOUR_CUSTOMER_TO_YOUR_PRODUCT_LATER',
                lineItem: {
                    price_data: {
                        // The currency parameter determines which
                        // payment methods are used in the Checkout Session.
                        currency: 'eur',
                        product_data: {
                            name: 'Ethereum',
                        },
                        unit_amount: "2000",
                    }, quantity: 1
                },
                mode: 'payment',
                successUrl: 'http://localhost:3001',
                cancelUrl: 'http://localhost:3001',
            }
        );

        const result = await stripe.redirectToCheckout({
            sessionId: session.data.id,
        });

        console.log(result.error.message);
    };

    if (!stripe) {
        return null;
    }

    return (
        <div className="main">
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={amount}
                    onChange={event => setAmount(event.target.value)}
                />
                ETH
                <div className='buybutton'></div>
                <button type="submit">Buy</button>
            </form>
        </div>
    );
};

export default scriptLoader('https://js.stripe.com/v3/')(StripeForm);
