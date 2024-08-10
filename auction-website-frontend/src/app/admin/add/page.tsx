"use client";
import { createItem } from "@/app/utils/actions/items";
import { ItemService } from "@/app/utils/actions/ItemService";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function CreateItem() {
  const itemService = new ItemService("http://localhost:8000/api");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    starting_price: "",
    description: "",
    expiry_time: "",
    start_time: "",
    large_image: "",
  });

  const validateTimes = (startTime: string, expiryTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const expiry = new Date(expiryTime);
  
    if (start < now) {
      return "Start time must be after the current time.";
    }
  
    if (expiry <= start) {
      return "Expiry time must be after the start time.";
    }
  
    return null; // No errors
  };

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
    const response = await itemService.createItem(formData);
    const validationError = validateTimes(formData.start_time, formData.expiry_time);

    if (validationError) {
      // Show validation error to the user
      alert(validationError)
      return;
    }
    if (response) {
      // Redirect or show success message
      router.push("/admin/products");
    } else {
      // Handle error
      console.error("Failed to create item");
    }
  };

  return (
    <div className="p-20 rounded-md mt-5 bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Item</h1>
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4"
      >
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
