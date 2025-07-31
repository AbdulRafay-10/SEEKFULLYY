import React from "react";
import gradient from "../../assets/images/gradient.png";
import doublecircle from  "../../assets/images/doublecircle.png"

const AddPaymentModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex justify-center items-center z-50 ">


      <div className="bg-white rounded-2xl w-[500px] space-y-6 shadow-2xl relative p-10">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800">Add Payment Method</h2>

        {/* Card Image with Text Overlay */}
        <div className="relative rounded-xl overflow-hidden h-[180px] w-full">
          {/* Placeholder or your image */}
          <div className="absolute inset-0">
            <img src={gradient} alt="" />
          </div>

          <div className="absolute inset-0 text-white p-5 flex flex-col justify-between">
            <div className="flex justify-between text-sm">
              <div>
                <p className="opacity-70">CARD HOLDER</p>
                <p className="font-semibold">Eddy Cusuma</p>
              </div>
              <div>
                <p className="opacity-70">VALID THRU</p>
                <p className="font-semibold">12/22</p>
              </div>
            </div>
            <div className="flex justify-between">
             <span className="text-lg tracking-widest font-medium">3778 **** **** 1234</span>   
             <img src={doublecircle} alt="" />
            </div>
            
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-lg text-black">Card Number</label>
            <input
              type="text"
              placeholder="1234 **** **** ****"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-lg text-black">CVV</label>
              <input
                type="text"
                placeholder="Enter CVV"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-lg text-black">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Add Card Button */}
        <button className="w-full bg-[var(--primary-color)] text-white py-3 rounded-full font-medium hover:opacity-90 transition">
          Add Card
        </button>
      </div>
    </div>
  );
};

export default AddPaymentModal;
