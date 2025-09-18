// function Subscription() {
//   return <div>Subscription Page</div>;
// }   

// export default Subscription;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BuySubscription } from "../services/operations/studentFeaturesAPI";

export default function Subscription() {
  // const { total, cart } = useSelector((state) => state.cart)
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
   
const [plan, setPlan] = useState("monthly");
  const [loding, setLoding] = useState(false);
  const pricing = {
    monthly: {
      title: "Monthly Plan",
      price: "1000 Rs/mo",
      desc: "Perfect for short-term projects."
    },
    quarterly: {
      title: "Quarterly Plan",
      price: "3000 Rs/mo",
      desc: "Great value for growing teams."
    },
    yearly: {
      title: "Yearly Plan",
      price: "8000 Rs/mo",
      desc: "Best for long-term savings."
    }
  };

  // function handlePlanChange(selectedPlan) {
  //   setPlan(selectedPlan);
  // }
  function handleSubscribe() {
     
      // const courses = cart.map((course) => course._id)
      const details=pricing[plan]
      BuySubscription(token, details, user, navigate, dispatch)
    
    // Handle subscription logic here
    
  }

  return (
    loding ? <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">Loading </div>:
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md shadow-xl rounded-2xl p-6 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">Choose Your Plan</h2>

        {/* Plan Selector */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setPlan("monthly")}
            className={`px-4 py-2 rounded-full border transition ${
              plan === "monthly"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPlan("quarterly")}
            className={`px-4 py-2 rounded-full border transition ${
              plan === "quarterly"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setPlan("yearly")}
            className={`px-4 py-2 rounded-full border transition ${
              plan === "yearly"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Yearly
          </button>
        </div>

        {/* Plan Details */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">{pricing[plan].title}</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">{pricing[plan].price}</p>
          <p className="text-gray-600 mb-6">{pricing[plan].desc}</p>

          <button onClick={()=>handleSubscribe()}  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}
