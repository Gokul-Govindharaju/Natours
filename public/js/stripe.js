/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51P9pO1SGzhgIatSnoZAuqcPTjaL6MttxhF5UHv7J4kZhctW6kX9dplDhmq9i1D2tYouYvNExv5KBfJbNQaRt6VO800RkKkInQ0'
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
