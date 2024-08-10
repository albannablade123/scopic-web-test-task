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
import { ItemService } from "../utils/actions/ItemService";



export default function ItemTable() {
  const itemService = new ItemService('http://localhost:8000/api');
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [convertedItems, setConvertedItems] = useState<Item[]>([]);


  const fetchItems = async () => {
    const fetchedItems = await itemService.getAllItemActions();
    console.log('Fetched fetchedItems:', fetchedItems); // Print fetchedItems to the console
    setConvertedItems(fetchedItems);
  };

  useEffect(() => {
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
  const rowsPerPage = 10;

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
              <TableCell className="max-w-xs truncate">{renderCell(item, columnKey, fetchItems)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
