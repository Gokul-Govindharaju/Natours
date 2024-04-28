/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async tourId => {
    const stripe = Stripe('pk_test_51P9pO1SGzhgIatSnoZAuqcPTjaL6MttxhF5UHv7J4kZhctW6kX9dplDhmq9i1D2tYouYvNExv5KBfJbNQaRt6VO800RkKkInQ0');
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
