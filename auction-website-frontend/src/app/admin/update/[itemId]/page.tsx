"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parse } from "path";
import { ItemService } from "@/app/lib/actions/ItemService";

export default function CreateItem(props: any) {
  const itemService = new ItemService('http://localhost:8000/api');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams();
  const itemIdString =searchParams.get("id")
  const itemId = itemIdString ? Number(itemIdString) : null;

  const [formData, setFormData] = useState({
    name: "",
    starting_price: "",
    description: "",
    expiry_time: "",
    start_time: "",
    large_image: "",
  });
  useEffect(() => {
    const fetchItemDetail = async (itemId: number) => {
      try {
        const itemDetail = await itemService.getItemById(itemId);
        console.log("______________________________________")
        console.log("Fetched products:", itemDetail); // Print products to the console
        setFormData({
          name: itemDetail.name,
          starting_price: itemDetail.starting_price,
          description: itemDetail.description,
          large_image: itemDetail.large_email,
          start_time: await itemService.formatDateToInput(itemDetail.start_time),
          expiry_time: await itemService.formatDateToInput(itemDetail.expiry_time),
        });
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

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setError(null); // Reset any previous errors
    setLoading(true); // Set loading state to true
  
    try {
      if (itemId) {
        const parsedId = Number(itemId);
  
        if (!isNaN(parsedId)) {
          const response = await itemService.updateItem(formData, parsedId);
  
          if (response) {
            // Redirect or show success message
            router.push("/admin/products");
          } else {
            // Handle unsuccessful update
            console.error("Failed to update item");
            setError("Failed to update item");
          }
        } else {
          setError("Invalid item ID");
        }
      } else {
        setError("Item ID is missing");
      }
    } catch (error) {
      // Handle errors during the API call
      console.error("Error updating item:", error);
      setError("An error occurred while updating the item");
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  return (
    <div className="p-20 rounded-md mt-5 bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-6">Update Item</h1>
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4"
      >
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1 text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Item Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="startingPrice" className="mb-1 text-gray-700">
            Starting Price
          </label>
          <input
            type="number"
            id="starting_price"
            name="starting_price"
            placeholder="Starting Price"
            value={formData.starting_price}
            onChange={handleChange}
            min="0"
            step="0.01" // Allows for decimal values
            className="p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-1 text-gray-700">
            Item Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            onChange={handleChange}
            value={formData.description}
            placeholder="Item Description"
            className="p-3 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label htmlFor="imageUrl" className="mt-4 mb-1 text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            id="large_image"
            name="large_image"
            placeholder="Enter image URL"
            onChange={handleChange}
            value={formData.large_image}
            className="p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="expiryTime" className="mb-1 text-gray-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            onChange={handleChange}
            value={formData.start_time}
            required
            className="p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="expiryTime" className="mb-1 text-gray-700">
            Expiry Time
          </label>
          <input
            type="datetime-local"
            id="expiry_time"
            name="expiry_time"
            onChange={handleChange}
            value={formData.expiry_time}
            required
            className="p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
