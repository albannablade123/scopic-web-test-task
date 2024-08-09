"use client";

import { useState } from "react";

const AutoBidConfig = () => {
  const [maxBidAmount, setMaxBidAmount] = useState("");
  const [alertPercentage, setAlertPercentage] = useState(90);
  const [autoBiddingActive, setAutoBiddingActive] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (alertPercentage > 100) {
      setError("Alert percentage cannot be more than 100.");
      return;
    }
    const config = {
      maxBidAmount,
      alertPercentage,
      autoBiddingActive,
    };
    localStorage.setItem("autoBidConfig", JSON.stringify(config));
    console.log("Auto-bid configuration saved:", config);
  };

  return (
    <div className="container mx-auto p-4  max-w-md">
      <h1 className="text-2xl font-bold mb-4">Auto-Bid Configuration</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="max_bid_amount"
            className="block text-sm font-medium text-gray-700"
          >
            Max Bid Amount
          </label>
          <input
            type="number"
            id="max_bid_amount"
            value={maxBidAmount}
            onChange={(e) => setMaxBidAmount(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="auto_bid_alert_percentage"
            className="block text-sm font-medium text-gray-700"
          >
            Alert Percentage
          </label>
          <input
            type="number"
            id="auto_bid_alert_percentage"
            value={alertPercentage}
            onChange={(e) => setAlertPercentage(e.target.value)}
            className="h-4 w-4 mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default AutoBidConfig;
