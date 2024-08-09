"use client";
import CountdownTimer from "@/app/components/countdownTimer";
import { ItemService } from "@/app/lib/actions/ItemService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import imagePlaceHolder from "../../images.png";
import BidComponent from "@/app/components/BidComponent";

const Horizontal = () => {
  return <hr className="w-[30% my-2]" />;
};

interface Item {
  id: String;
  name: String;
  description: String;
  expiry_time: String;
  image_large: String;
  starting_price: String;
}

const initialItemDetail: Item = {
  id: "",
  name: "",
  description: "",
  expiry_time: "",
  image_large: "",
  starting_price: "",
};

function cn(...clasess: string[]) {
  return clasess.filter(Boolean).join(" ");
}
export default function Items() {
  const itemService = new ItemService("http://localhost:8000/api");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [itemDetail, setItemDetail] = useState<Item>(initialItemDetail);
  const [maxBidAmount, setMaxBidAmount] = useState("");
  const [alertPercentage, setAlertPercentage] = useState(0);
  const [configExist, setConfigExist] = useState(false);
  const [autoBidActive, setAutoBidActive] = useState(false);
  const [autoBidStatus, setAutoBidStatus] = useState(false);
  const [highestBid, setHighestBid] = useState({});
  const [userId, setUserId] = useState("");

  const searchParams = useSearchParams();
  const itemIdString = searchParams.get("id");
  const itemId = itemIdString ? Number(itemIdString) : null;

  const [amount, setAmount] = useState("");

  useEffect(() => {
    const getUserId = async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        credentials: "include",
      });

      const content = await response.json();

      if (content.id) {
        setUserId(content.id);
        fetchConfig(content.id);
      }
    };

    const fetchBids = async (itemId: number) => {
      try {
        const bids = await itemService.getAllBidsByItemId(itemId, 1, 1);
        console.log("Fetched bids:", bids);
        if (bids.length > 0) {
          const bid = bids.reduce((acc, bid) =>
            acc.amount > bid.amount ? acc : bid
          );

          setHighestBid({
            "amount" : bid.amount,
            "userId": bid.user
          });
        } else {
          
          setHighestBid({
            "amount" : itemDetail.starting_price,
            "userId": null
          });
        }
      } catch (error) {
        setError("Failed to fetch item details");
        console.error("Error fetching item:", error);
      }
    };

    const fetchItemDetail = async (itemId: number) => {
      try {
        const itemDetail = (await itemService.getItemById(itemId)) as Item;
        setItemDetail(itemDetail);
        console.log(itemDetail.image_large, "____________________")
      } catch (error) {
        setError("Failed to fetch item details");
        console.error("Error fetching item:", error);
      }
    };

    //Check if Auto Bid Object exist
    const fetchAutoBidStatus = async (userId: string, itemId: number) => {
      try {
        if (!userId) return; // Exit if userId is not yet available
        const response = await fetch(
          `http://localhost:8000/api/autobid?user_id=${userId}&item_id=${itemId}`,
          {
            credentials: "include",
          }
        );

        if (response.status === 404) {
          // Auto-bid not found for the user and item
          setAutoBidStatus(false);
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch auto-bid status");
        }

        const data = await response.json();
        setAutoBidActive(data.auto_bidding_active); // Set checkbox state based on response
        setAutoBidStatus(true);
      } catch (err) {
        setError("Failed to fetch auto-bid status");
      }
    };

    const fetchConfig = async (id: number) => {
      try {
        const response = await fetch(`http://localhost:8000/api/config/${id}`);

        if (response.status == 404) {
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }
        const data = await response.json();
        setMaxBidAmount(data.max_bid_amount);
        setAlertPercentage(data.auto_bid_alert_percentage);
        setConfigExist(true);
      } catch (err) {
        setError("Failed to fetch configuration");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      const parsedId = Number(itemId);
      if (!isNaN(parsedId)) {
        fetchItemDetail(parsedId);
        fetchAutoBidStatus(userId, parsedId);
        fetchBids(parsedId);
      } else {
        setError("Invalid item ID");
      }
    } else {
      setError("Item ID is missing");
    }

    getUserId();
  }, [itemId, userId]);

  const handleCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    if (!configExist) {
      alert("No configuration for auto-bid found");
      setError(
        "No configuration for auto-bid found, create one under auto-bid configuration"
      );
      return;
    }
    //If not created, create one
    if (!autoBidStatus && isChecked) {
      const body = {
        auto_bidding_active: isChecked,
        max_bid_amount: maxBidAmount,
        auto_bid_alert_percentage: alertPercentage,
        user: userId,
        item: itemId,
      };
      //Create a new autobid
      const response = await fetch(
        `http://localhost:8000/api/autobid?user_id=${userId}&item_id=${itemId}`,
        {
          method: "POST", // Use POST to create a new auto-bid
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      setAutoBidActive(true);
      return;
    }

    //If created, update the bid
    try {
      const response = await fetch(
        `http://localhost:8000/api/autobid/toggle?user_id=${userId}&item_id=${itemId}`,
        {
          method: "PATCH", // Use POST to enable, DELETE to disable
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ auto_bidding_active: isChecked }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update auto-bid status");
      }

      setAutoBidActive(isChecked);
    } catch (err) {
      console.error("Failed to update auto-bid status", err);
      setError("Failed to update auto-bid status");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const timestamp = new Date().toISOString();

    // You can add more validation logic here if needed
    if (!amount) {
      alert("Please enter a bid amount.");

      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userId, // Pass the user ID
          item: itemId, // Pass the item ID
          amount: parseFloat(amount),
          auto_bidding: false,
          timestamp: timestamp,
        }),
      });

      if (response.ok) {
        alert("Bid placed successfully!");
        setHighestBid(Number(amount))
        // Optionally reset the amount
        setAmount("");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData["message"]["non_field_errors"][0];
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      alert("An error occurred while placing the bid.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12  p-6 mt-10 px-10 mx-10">
      <div>
        <Image
          alt={imagePlaceHolder}
          src={itemDetail.image_large || imagePlaceHolder}
          width={500}
          height={500}
          objectFit="cover"
          className={cn(
            "group-hover:opacity-75 duration-700 ease-in-out",
            loading
              ? "greyscale blur-2xl scale-110"
              : "greyscale-0 blue-0 scale 100"
          )}
          onLoad={() => setLoading(false)}
        />
      </div>
      <div className="mx-10">
        <div className="flex flex-col gap-1 text-slate-500 text-sm">
          <div className="mb-6">
            <h2 className="text-4xl font-large mb-2 text-slate-800">
              {itemDetail.name}
            </h2>
            <h3 className="text-2xl font-medium">
              ${itemDetail.starting_price}
            </h3>
          </div>

          <h3 className=" font-small text-slate-900">Time Left</h3>
          <Horizontal />
          {itemDetail.expiry_time && (
            <CountdownTimer time={itemDetail.expiry_time} />
          )}
          <h3 className=" font-small text-slate-900 mt-6">Bids</h3>
          <Horizontal />
          <div className="mt-3 mb-3 ">
            <div className="grid grid-cols-2 gap-4 ">
              <div className=" grid grid-row-2 text-right p-3 ">
                <BidComponent highestBid={highestBid} userId={userId} />
              </div>
              <div className="mt-4 ">
                <form onSubmit={handleSubmit}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter your bid"
                    className="px-4 py-2 border rounded-lg w-full mb-4"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-beige-dark text-white rounded-lg hover:bg-beige ml-2"
                  >
                    Bid Now
                  </button>
                </form>
              </div>
            </div>
          </div>
          <Horizontal />

          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={autoBidActive}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">Auto Bid</span>
            </label>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <h3 className=" font-small text-slate-900 mt-6">Description</h3>
          <Horizontal />
          <div className="text-justify text-lg">{itemDetail.description}</div>
          <Horizontal />
        </div>
      </div>
    </div>
  );
}
