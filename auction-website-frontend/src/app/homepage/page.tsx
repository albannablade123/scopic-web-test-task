"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ItemService } from "../utils/actions/ItemService";
import { Input, Pagination } from "@nextui-org/react";
import Link from "next/link";
import { SearchIcon } from "../components/icons";

function cn(...clasess: string[]) {
  return clasess.filter(Boolean).join(" ");
}

interface Item {
  id: String;
  name: String;
  description: String;
  expiry_time: String;
  image_large: String;
  starting_price: String;
}

type SortColumn = "name" | "dateCreated" | "startingPrice";

interface SortDescriptor {
  column: SortColumn;
  direction: "ascending" | "descending";
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);

  const itemService = new ItemService("http://localhost:8000/api");

  useEffect(() => {
    const fetchItems = async () => {
      const fetchedItems = await itemService.getAllItemActions();
      console.log("Fetched products:", fetchedItems); // Print products to the console
      setItems(fetchedItems);
    };

    fetchItems();
  }, []);

  // Filter By Search
  const filteredItems = useMemo(() => {
    if (
      Array.isArray(items) ||
      (typeof items === "object" &&
        items !== null &&
        typeof items[Symbol.iterator] === "function")
    ) {
      let filteredListings = [...items];
      const now = new Date(); // Current date and time

      filteredListings = filteredListings.filter((item) => {
        const expiryDate = new Date(item.expiry_time);
        return expiryDate > now;
      });
      if (hasSearchFilter) {
        filteredListings = filteredListings.filter(
          (item) =>
            item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            item.description.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
      return filteredListings;
    } else {
      console.error("items is not iterable");
      return [];
    }
  }, [items, filterValue, hasSearchFilter]);

  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as string;

    // Toggle direction if the column is the same
    setSortDescriptor((prevDescriptor) => ({
      column: value,
      direction:
        prevDescriptor.column === value
          ? prevDescriptor.direction === "ascending"
            ? "descending"
            : "ascending"
          : "ascending",
    }));
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const direction = e.target.value as string;

    // Update the column while keeping the current direction
    setSortDescriptor((prevDescriptor) => ({
      ...prevDescriptor,
      direction: direction,
    }));
  };

  const sortedItems = useMemo(() => {
    if (filteredItems == null) {
      return [];
    }
    if (sortDescriptor.column) {
      return [...filteredItems].sort((a: Item, b: Item) => {
        let firstValue: string | number | Date;
        let secondValue: string | number | Date;
        switch (sortDescriptor.column) {
          case "expiry_time":
            firstValue = new Date(a[sortDescriptor.column] as string);
            secondValue = new Date(b[sortDescriptor.column] as string);
            break;
          case "starting_price":
            firstValue = parseFloat(a[sortDescriptor.column] as string);
            secondValue = parseFloat(b[sortDescriptor.column] as string);
            break;
          default:
            firstValue = a["name"] as string;
            secondValue = b["name"] as string;
            break;
        }

        let cmp: number;
        if (firstValue instanceof Date && secondValue instanceof Date) {
          cmp = firstValue.getTime() - secondValue.getTime();
        } else if (
          typeof firstValue === "number" &&
          typeof secondValue === "number"
        ) {
          cmp = firstValue - secondValue;
        } else if (
          typeof firstValue === "string" &&
          typeof secondValue === "string"
        ) {
          cmp = firstValue.localeCompare(secondValue);
        } else {
          cmp = 0; // Default comparison if types are not as expected
        }
        console.log(sortDescriptor.direction);
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }
    return pageItems;
  }, [sortDescriptor, filteredItems]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(sortedItems.length / rowsPerPage);
  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (items != null) {
      return sortedItems.slice(start, end);
    } else {
      return [];
    }
  }, [page, sortedItems]);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);

      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-between mb-5">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name or description..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="mb-4">
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700"
            >
              Order:
            </label>
            <select
              id="sort"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={sortDescriptor.direction}
              onChange={handleColumnChange}
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700"
            >
              Sort By:
            </label>
            <select
              id="sort"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={sortDescriptor.column}
              onChange={handleSortChange}
            >
              <option value="name">Name</option>
              <option value="expiry_time">Date Created</option>
              <option value="starting_price">Starting Price</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {sortedItems.length === 0 ? (
            <div>No items available</div>
          ) : (
            pageItems.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </div>
        <div className="flex mt-10">
          <div className="justify-center">
            <Pagination
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [isLoading, setLoading] = useState(true);
  const expiryDate = new Date(item.expiry_time);
  const formattedExpiryDate = expiryDate.toLocaleString();
  return (
    <div className="shadow-sm p-3">
      <div className="aspect-w-1 aspect-h-2 bg-red-200 w-full rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-9 ">
        <Image
          alt=""
          src={item?.image_large || "/images.png"}
          width={500}
          height={500}
          objectFit="cover"
          className={cn(
            "group-hover:opacity-75 duration-700 ease-in-out",
            isLoading
              ? "greyscale blur-2xl scale-110"
              : "greyscale-0 blue-0 scale 100"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">
        {new Date(item.expiry_time).toLocaleString()}
      </h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{item.name}</p>
      <p>Starts at: {item.starting_price}</p>
      <div className="flex justify-end mt-2 ">
        <button className="px-4 py-2 bg-beige-dark text-white rounded-lg hover:bg-beige mt-2 mr-6">
          <Link
            href={{
              pathname: `/products/${item.id}`,
              query: {
                search: "search",
                id: item.id,
              },
            }}
          >
            Bid Now
          </Link>
        </button>
      </div>
    </div>
  );
};
