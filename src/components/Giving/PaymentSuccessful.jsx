import React from "react";
import tick from "../../assets/icons/tick.png"
import { Link } from "react-router-dom";

const PaymentSuccessfull = ({ onClose }) => {
  return (
    <div className="fixed inset-0  bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <img src={tick} alt=""className="w-12 h-12"  />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          Payment was Successful <span>🎉</span>
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Thank you for your generous contribution! Your payment has been processed successfully. We are grateful for your support, which helps us continue our mission and make a difference. May your giving be returned to you in abundance. God bless you!
        </p>
       <Link to="/"> <button
          onClick={onClose}
          className="bg-[var(--primary-color)] text-white font-semibold py-2 px-16 rounded-full transition"
        >
          Go Home
        </button></Link>
      </div>
    </div>
  );
};

export default PaymentSuccessfull;
