// src/utils/razorpay.ts
// import * as Razorpay from 'razorpay';
const Razorpay = require('razorpay');

// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY??"rzp_test_FygXdONEKJQmc4",
//   key_secret: process.env.RAZORPAY_SECRET??"izuUw55xkODUArlToWw6gmHK",
// });

export const instance = new Razorpay({
  key_id: "rzp_test_FygXdONEKJQmc4",
  key_secret: "izuUw55xkODUArlToWw6gmHK",
});