import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SimpleCardForm from '../ProcessPayment/SimpleCardForm'


const stripePromise = loadStripe('pk_test_51Ie9yeHxZOmstkZd3AWtZXH4XuPglZlGhPGOFhHadZqaAfVMD9nAvz1OO3SHFLWL9GgGlYKol0h58Bg9nnmvGgLm00FhpRhVwR');

const ProcessPayment = ({handlePayment}) => {
    return (
        <Elements stripe={stripePromise}>
            <SimpleCardForm handlePayment={handlePayment}></SimpleCardForm>
        </Elements>
    );
};

export default ProcessPayment;