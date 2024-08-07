"use client";
import CountdownTimer from "@/app/components/countdownTimer";
import { ItemService } from "@/app/lib/actions/ItemService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import imagePlaceHolder from "../../images.png";

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

  const searchParams = useSearchParams();
  const itemIdString = searchParams.get("id");
  const itemId = itemIdString ? Number(itemIdString) : null;

  useEffect(() => {
    const fetchItemDetail = async (itemId: number) => {
      try {
        const itemDetail = (await itemService.getItemById(itemId)) as Item;
        console.log("Fetched item detail:", itemDetail);
        setItemDetail(itemDetail);
      } catch (error) {
        setError("Failed to fetch item details");
        console.error("Error fetching item:", error);
      }
    };

    if (itemId) {
      const parsedId = Number(itemId);
      if (!isNaN(parsedId)) {
        fetchItemDetail(parsedId);
      } else {
        setError("Invalid item ID");
      }
    } else {
      setError("Item ID is missing");
    }
  }, [itemId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12  p-6 px-10 mx-10">
      <div>
        <Image
          alt=""
          src={imagePlaceHolder}
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
          <h2 className="text-3xl font-medium  text-slate-800">
            {itemDetail.name}
          </h2>
          <div>10 bids</div>
          <div className="text-justify">{itemDetail.description}</div>
          <Horizontal />
          <div>
            <span>CATEGORY:</span>
          </div>
          <Horizontal />
          {itemDetail.expiry_time && (
            <CountdownTimer time={itemDetail.expiry_time} />
          )}
          <div className="mt-4">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Bid Now
            </button>
          </div>
          <div className="mt-4">
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
        </div>
      </div>
    </div>
  );
}
