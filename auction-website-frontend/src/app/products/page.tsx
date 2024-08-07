"use client";
import Image from "next/image";
import imagePlaceHolder from "../images.png";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ItemService } from "../lib/actions/ItemService";
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
    let filteredListings = [...items];

    if (hasSearchFilter) {
      filteredListings = filteredListings.filter(
        (item) =>
          item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredListings;
  }, [items, filterValue, hasSearchFilter]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return items.slice(start, end);
  }, [page, filteredItems]);

  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortColumn;

    console.log(sortDescriptor);

    // Update state with the new sort column and default to ascending direction
    setSortDescriptor({
      column: value,
      direction: "ascending", // Default to ascending; you might want to toggle direction here
    });
  };

  const sortedItems = useMemo(() => {
    if (sortDescriptor.column) {
      return [...pageItems].sort((a: Item, b: Item) => {
        let firstValue: string | number | Date;
        let secondValue: string | number | Date;
        console.log(sortDescriptor.column)
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

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }
    return pageItems;
  }, [sortDescriptor, pageItems]);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      console.log(value);

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
          {items.length === 0 ? (
            <div>No items available</div>
          ) : (
            sortedItems.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </div>
      </div>

      <Pagination total={pages} initialPage={1} />
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
    <Link href={{
      pathname: `/products/${item.id}`,
      query: {
        search: "search",
        id: item.id
      },
    }} className="group">
      <div className="aspect-w-1 aspect-h-1 bg-red-200 w-full rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={imagePlaceHolder}
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
      <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">
        {new Date(item.expiry_time).toLocaleString()}
      </p>
      <p>{item.starting_price}</p>
    </Link>
  );
};
