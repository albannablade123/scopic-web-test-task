import { Tooltip } from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "./icons";
import { FormEvent, MouseEventHandler, useState } from "react";
import { deleteItem } from "../lib/actions/items";
import { useRouter } from "next/navigation";

export default function ItemAction(props: any) {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async (e: MouseEventHandler<HTMLButtonElement>) => {
    const response = await deleteItem(props.id);
    console.log(response)

    if (response == 204) {
        console.log("ReACHED")
      // Redirect or show success message
      setShowConfirm(false);
      router.push("/admin/products");
    } else {
      // Handle error
      console.error("Failed to create item");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EyeIcon />
        </span>
      </Tooltip>
      <Tooltip content="Edit user">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete user">
        <span
          onClick={handleDeleteClick}
          className="text-lg text-danger cursor-pointer active:opacity-50"
        >
          <DeleteIcon />
        </span>
      </Tooltip>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
