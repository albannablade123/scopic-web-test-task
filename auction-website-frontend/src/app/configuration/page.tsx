"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AutoBidConfig = () => {
  const [maxBidAmount, setMaxBidAmount] = useState("");
  const [alertPercentage, setAlertPercentage] = useState(0);
  const [updateConfig, setUpdateConfig] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [configId, setConfigId] = useState("");
  const searchParams = useSearchParams();

  const userIdString = searchParams.get("userId");
  const userId = userIdString ? Number(userIdString) : null;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/config/${userId}`);

        if (response.status == 404) {
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }
        const data = await response.json();
        
        setUpdateConfig(true);
        setMaxBidAmount(data.max_bid_amount || "");
        setAlertPercentage(data.auto_bid_alert_percentage || 90);
        setConfigId(data.id)
      } catch (err) {
        console.error("Failed to fetch configuration", err);
        setError("Failed to fetch configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [userId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (alertPercentage > 100) {
      setError("Alert percentage cannot be more than 100.");
      alert("Alert percentage cannot be more than 100.")
      return;
    }
    const config = {
      "user": userId,
      "max_bid_amount": maxBidAmount,
      "auto_bid_alert_percentage": alertPercentage,
    };
    try {
      if (updateConfig) {
        console.log(configId)
        // If configuration exists, update it
        const updateResponse = await fetch(`http://localhost:8000/api/config/${configId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        });

        if (!updateResponse.ok) {
          throw new Error("Failed to update configuration");
        }

        const result = await updateResponse.json();
        alert("auto-bid configuration updated succesfully")
      } else {
        // Create new configuration
        const createResponse = await fetch(`http://localhost:8000/api/config`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create configuration");
        }

        const result = await createResponse.json();
        console.log("Auto-bid configuration created:", result);
        alert("auto-bid configuration updated succesfully")

      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      setError("Failed to save configuration");
    }
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
            onChange={(e) => setAlertPercentage(parseFloat(e.target.value))}
            className="h-4 w-4 mt-1 block border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-beige-dark text-white rounded-lg hover:bg-beige"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default function ConfigurationPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AutoBidConfig />
    </Suspense>
  );
}