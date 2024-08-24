import { Tooltip } from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "./icons";
import { FormEvent, MouseEventHandler, useState } from "react";
import { ItemService } from "../utils/actions/ItemService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ItemAction(props: any) {
  const itemService = new ItemService("http://localhost:8000/api");

  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async (
    e:  React.MouseEvent<HTMLButtonElement>
  ) => {
    const response = await itemService.deleteItem(props.id);
    console.log(response);

    if (response == 204) {
      // Redirect or show success message
      setShowConfirm(false);
      props.fetchItems()
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
        <Link
          href={{
            pathname: `/admin/detail/${props.id}`,
            query: {
              search: "search",
              itemDetail: props.item,
              id: props.id,
            },
          }}
        >
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <EyeIcon />
          </span>
        </Link>
      </Tooltip>
      <Tooltip content="Edit user">
        <Link
          href={{
            pathname: `/admin/update/${props.id}`,
            query: {
              search: "search",
              itemDetail: props.item,
              id: props.id,
            },
          }}
        >
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <EditIcon />
          </span>
        </Link>
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
            <p className="mb-4">Are you sure you want to delete this item?</p>
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
