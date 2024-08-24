"use client";
import CountdownTimer, { parseDateString } from "@/app/components/countdownTimer";
import { ItemService } from "@/app/utils/actions/ItemService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const Horizontal = () => {
  return <hr className="w-[30% my-2]" />;
};

interface Item {
  id: String;
  name: String;
  description: String;
  expiry_time: String;
  start_time: String;
  image_large: String;
  starting_price: String;
}

interface Bid {
  id: string;
  user: number;
  item: number;
  amount: string;
  auto_bidding: boolean;
  timestamp: string; // or Date if you prefer to handle it as a Date object
  status: string;
}

const initialItemDetail: Item = {
  id: "",
  name: "",
  description: "",
  expiry_time: "",
  start_time: "",
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
  const [bids, setBids] = useState<Bid[]>([]);
  const [isOpen, setIsOpen] = useState(false)

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
        // User is authenticated and logged out
        setUserId(content.id);
      }
    };
    const fetchItemDetail = async (itemId: number) => {
      try {
        const itemDetail = (await itemService.getItemById(itemId)) as Item;
        console.log("Fetched item detail:", itemDetail);
        setItemDetail(itemDetail);
        const start = parseDateString(itemDetail.start_time.toString());
        const now = new Date();
        if (now < start) {setIsOpen(now<start)}


      } catch (error) {
        setError("Failed to fetch item details");
        console.error("Error fetching item:", error);
      }
    };
    
    const fetchBids = async (itemId: number) => {
      try {
        const bids = await itemService.getAllBidsByItemId(itemId, 10, 10);
        setBids(bids);
      } catch (error) {
        setError("Failed to fetch item details");
        console.error("Error fetching item:", error);
      }
    };

    if (itemId) {
      const parsedId = Number(itemId);
      if (!isNaN(parsedId)) {
        fetchItemDetail(parsedId);
        fetchBids(parsedId);
      } else {
        setError("Invalid item ID");
      }
    } else {
      setError("Item ID is missing");
    }

    getUserId();
  }, [itemId]);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const timestamp = new Date().toISOString();

    // You can add more validation logic here if needed
    if (!amount) {
      alert("Please enter a bid amount.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/bid", {
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

      console.log(response);

      if (response.ok) {
        alert("Bid placed successfully!");
        // Optionally reset the amount
        setAmount("");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData["message"]["non_field_errors"][0];
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      console.log(error);
      alert("An error occurred while placing the bid.");
    }
  };

  const sortedBids = bids.sort((a, b) => {
    // Convert timestamps to Date objects
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);

    // Calculate difference as a number
    return dateB.getTime() - dateA.getTime(); // Use getTime() for milliseconds since epoch
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12  p-6 mt-10 px-10 mx-10">
      <div>
        <Image
          alt=""
          src={(itemDetail?.image_large as string) || "/images.png"}
          width={500}
          height={500}
          objectFit="cover"
          className={cn(
            "w-full object-contain group-hover:opacity-75 duration-700 ease-in-out",
            loading
              ? "greyscale blur-2xl scale-110"
              : "greyscale-0 blue-0 scale 100"
          )}
          onLoad={() => setLoading(false)}
        />
        <div>
          <h2>Bid History</h2>
          <div className="max-h-48 overflow-y-auto">
            {bids.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                <p>No bids have been placed yet.</p>
              </div>
            ) : (
              sortedBids.map((bid, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Amount:{" "}
                    <span className="text-green-600">${bid.amount}</span>
                  </h3>
                  <div className="flex justify-between text-gray-600">
                    <p>User ID: {bid.user}</p>
                    <p>Created: {new Date(bid.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-600">
                    Is Auto Bid:{" "}
                    <span className="text-blue-600">
                      {bid.auto_bidding ? "True" : "False"}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
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
            <CountdownTimer time={itemDetail.expiry_time.toString()} start_time={itemDetail.start_time.toString()} />
          )}
          <h3 className=" font-small text-slate-900 mt-6">Bids</h3>
          <Horizontal />
          <div className="mt-3 mb-3 ">
            <div className="grid grid-cols-2 gap-4 ">
              <div className=" grid grid-row-2 text-right p-3 ">
                <h2 className="text-left text-base font-medium p-2">
                  Latest Bid
                </h2>
                <h3 className="text-left text-lg font-medium p-2">$18.00</h3>
              </div>
            </div>
          </div>
          <Horizontal />

          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={false}
                onChange={() => {}}
              />
              <span className="ml-2">Auto Bid</span>
            </label>
          </div>
          <h3 className=" font-small text-slate-900 mt-6">Description</h3>
          <Horizontal />
          <div className="text-justify text-lg">{itemDetail.description}</div>
          <Horizontal />
        </div>
      </div>
      <div></div>
    </div>
  );
}
