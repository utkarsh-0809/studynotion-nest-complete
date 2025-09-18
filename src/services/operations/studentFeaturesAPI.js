import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
  SUBSCRIPTION_PAYMENT_API,
  SUBSCRIPTION_VERIFY_API,
  SEND_SUBSCRIPTION_SUCCESS_EMAIL_API,
  SUBSCRIBE_COURSE_API,
} = studentEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  console.log("in script")
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
} 

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  discount=0,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try {
    // Loading the script of Razorpay SDK
    console.log("at first step")
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      return
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
        discount
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    console.log(" before creating the options...")
    console.log("it cant bePAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

    // Opening the Razorpay SDK
    console.log("creating the options...")
    const options = {
      key: "rzp_test_FygXdONEKJQmc4",
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
        verifyPayment({ ...response, courses,discount }, token, navigate, dispatch)
      },
    }
    console.log(options)
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error("Could Not make Payment.")
  }
  toast.dismiss(toastId)
}

export async function SubscribeCourse(
  token,
  courseId, 
  navigate
){
  const toastId = toast.loading("Loading...")
  try{
    console.log("subscrive",token,courseId);
    const res=await apiConnector(
      "POST",
      SUBSCRIBE_COURSE_API,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if(!res.data.data){
      throw new Error(res.data.message)
    }
    toast.success(res.data.message)
    // toast.success("see course in subscribed section")
    navigate("/dashboard/subscribed-courses")
    toast.dismiss(toastId)
  }
  catch(error){
    toast.error("Could Not Subscribe the Course.")
    console.log("SUBSCRIBE COURSE ERROR............", error)
  }
  finally{
    toast.dismiss(toastId)
  }
}

export async function BuySubscription(
  token,
  details,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try {
    // Loading the script of Razorpay SDK
    console.log("at first step")
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      return
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      SUBSCRIPTION_PAYMENT_API,
      {
        details,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    console.log(" before creating the options...")
    console.log("it cant bePAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

    // Opening the Razorpay SDK
    console.log("creating the options...")
    const options = {
      key: "rzp_test_FygXdONEKJQmc4",
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
        verifySubscription({ ...response, details }, token, navigate, dispatch)
      },
    }
    console.log(options)
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error(`Could Not make Payment. ${error}` )
  }
  toast.dismiss(toastId)
}

async function verifySubscription(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector("POST", SUBSCRIPTION_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment Successful. You are Added to the course ")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error("Could Not Verify Payment.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}


// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment Successful. You are Added to the course ")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error("Could Not Verify Payment.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
