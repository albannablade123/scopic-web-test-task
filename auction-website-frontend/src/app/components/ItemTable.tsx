"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { columns, Item, renderCell } from "../admin/column";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Input, Pagination } from "@nextui-org/react";
import { SearchIcon } from "./icons";
import { getAllItemActions } from "../lib/actions/items";

const items = [
  {
    key: "1",
    name: "Sample Item 1",
    description: "This is a description for Sample Item 1.",
    expiry_time: "2024-12-31T23:59:59Z",
    smallImage: "http://example.com/small1.jpg",
    largeImage: "http://example.com/large1.jpg",
    starting_price: "50.00",
  },
  {
    key: "2",
    name: "Sample Item 2",
    description: "This is a description for Sample Item 2.",
    expiry_time: "2025-11-30T23:59:59Z",
    smallImage: "http://example.com/small2.jpg",
    largeImage: "http://example.com/large2.jpg",
    starting_price: "75.00",
  },
  {
    key: "3",
    name: "Sample Item 3",
    description: "This is a description for Sample Item 3.",
    expiry_time: "2023-10-15T23:59:59Z",
    smallImage: "http://example.com/small3.jpg",
    largeImage: "http://example.com/large3.jpg",
    starting_price: "120.00",
  },
  {
    key: "4",
    name: "Sample Item 4",
    description: "This is a description for Sample Item 4.",
    expiry_time: "2026-08-20T23:59:59Z",
    smallImage: "http://example.com/small4.jpg",
    largeImage: "http://example.com/large4.jpg",
    starting_price: "150.00",
  },
];

const convertedItems: Item[] = items.map((item) => ({
  id: item.key,
  name: item.name,
  expiry_time: item.expiry_time,
  starting_price: item.starting_price,
}));



export default function ItemTable() {
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [convertedItems, setConvertedItems] = useState<Item[]>([]);



  useEffect(() => {
    const fetchItems = async () => {
      const products = await getAllItemActions();
      console.log('Fetched products:', products); // Print products to the console
      setConvertedItems(products);
    };
    fetchItems();
  }, []);


  const filteredItems = useMemo(() => {
    let filteredListings = [...convertedItems];

    if (hasSearchFilter) {
      filteredListings = filteredListings.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredListings;
  }, [convertedItems, filterValue, hasSearchFilter]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const [sortDescriptor, setsortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    return [...pageItems].sort((a: Item, b: Item) => {
      const first = a[sortDescriptor.column as keyof Item] as string;
      const second = b[sortDescriptor.column as keyof Item] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, pageItems]);
  const onSearchChange = useCallback((value?: string) => {
    console.log("Test");
    if (value) {
      setFilterValue(value);
      console.log(value);

      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, onClear]);

  return (
    <Table
      aria-label="Example static collection table"
      topContent={topContent}
      className="text-black w-full"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={sortedItems} emptyContent={"No users to display"}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
