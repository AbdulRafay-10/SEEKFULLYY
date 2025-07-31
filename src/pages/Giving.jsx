import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import paypal from "../assets/icons/paypal.png";
import card from "../assets/icons/card.png";
import penciledit from "../assets/icons/penciledit.png";
import AddPaymentModal from "../components/Giving/AddPaymentModel";
import PaymentSuccessful from "../components/Giving/PaymentSuccessful";

const Giving = () => {
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Paypal");
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Close the success popup
  const handleClose = () => {
    setShowPopup(false);
    // Optional: navigate to home or reset form
  };

  return (
    <div className="shadow-xl rounded-3xl p-6 font-sans">
      {/* Header */}
      <div className="flex justify-start gap-2 mb-6">
        <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer mt-3" />
        <h1 className="text-3xl text-gray-800">Gift Seekfully</h1>
      </div>

      {/* Amount Input */}
      <div className="p-12">
        <label className="block text-xl text-[#474747] mb-1">Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="$0"
          className="w-[800px] h-16 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none shadow-lg placeholder:font-semibold placeholder:text-2xl"
        />

        {/* Recurring Toggle */}
        <div className="border border-gray-300 rounded-lg p-3 shadow-lg mt-4 w-[800px] mb-4">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Recurring</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isRecurring}
                onChange={() => setIsRecurring(!isRecurring)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[var(--primary-color)] rounded-full peer transition-all"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
            </label>
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div className="-mt-16 p-12">
        <h2 className="text-xl text-[#474747] mb-2">Payment Method</h2>

        <div className="w-[800px] space-y-3 mb-4">
          <label className="flex items-center justify-between shadow-lg border border-gray-300 rounded-lg px-2 py-2 w-full">
            <div className="flex items-center gap-2">
              <img src={paypal} alt="" />
              <span>Paypal</span>
            </div>
            <input
              type="radio"
              name="payment"
              value="Paypal"
              checked={paymentMethod === "Paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-[var(--primary-color)]"
            />
          </label>

          <label className="flex items-center justify-between shadow-lg border border-gray-300 rounded-lg px-2 py-2 w-full">
            <div className="flex items-center gap-2">
              <img src={card} alt="" />
              <span>Card</span>
            </div>
            <input
              type="radio"
              name="payment"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-[var(--primary-color)]"
            />
          </label>
        </div>

        {/* Add New Payment Method */}
        <div
          className="flex gap-3 ml-80 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img src={penciledit} alt="" className="w-4 h-4 mt-3.5" />
          <p className="text-lg mt-3 text-center text-gray-700">
            Add New Payment Method
          </p>
        </div>
      </div>

      {/* Make Payment Button */}
      <div className="ml-[270px] mb-32">
        <button
          className="w-[400px] bg-[var(--primary-color)] text-white py-3 rounded-full font-medium hover:opacity-90 transition"
          onClick={() => setShowPopup(true)}
        >
          Make Payment
        </button>
      </div>

      {/* Modals */}
      {showModal && <AddPaymentModal onClose={() => setShowModal(false)} />}
      {showPopup && <PaymentSuccessful onClose={handleClose} />}
    </div>
  );
};

export default Giving;
