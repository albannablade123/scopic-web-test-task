import { Pagination } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Input } from "postcss";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Bill, columns, renderCell } from "../profile/column_bill";
import { ItemService } from "../utils/actions/ItemService";
import { SearchIcon } from "./icons";
import { BillService } from "../utils/actions/BillService";

export default function BillTable() {
    const bidService = new BillService();
    const [filterValue, setFilterValue] = useState("");
    const hasSearchFilter = Boolean(filterValue);
    const [convertedBill, setConvertedBill] = useState<Bill[]>([]);
  
    const fetchBill = async () => {
      const fetchedBill = await bidService.getAllBillsByUserId(1);
      console.log("Fetched fetchedBill:", fetchedBill); // Print fetchedBill to the console
      setConvertedBill(fetchedBill);
    };
  
    useEffect(() => {
      fetchBill();
    }, []);
  
    // const filteredBill = useMemo(() => {
    //   let filteredListings = [...convertedBill];
  
    //   if (hasSearchFilter) {
    //     filteredListings = filteredListings.filter((bid) =>
    //       bid.name.toLowerCase().includes(filterValue.toLowerCase())
    //     );
    //   }
  
    //   return filteredListings;
    // }, [convertedBill, filterValue, hasSearchFilter]);
  
    // const [page, setPage] = useState(1);
    // const rowsPerPage = 10;
  
    // const pages = Math.ceil(filteredBill.length / rowsPerPage);
  
    // const pageBill = useMemo(() => {
    //   const start = (page - 1) * rowsPerPage;
    //   const end = start + rowsPerPage;
  
    //   return filteredBill.slice(start, end);
    // }, [page, filteredBill]);
  
    // const [sortDescriptor, setsortDescriptor] = useState({
    //   column: "name",
    //   direction: "ascending",
    // });
  
    // const sortedBill = useMemo(() => {
    //   return [...pageBill].sort((a: Item, b: Item) => {
    //     const first = a[sortDescriptor.column as keyof Item] as string;
    //     const second = b[sortDescriptor.column as keyof Item] as string;
    //     const cmp = first < second ? -1 : first > second ? 1 : 0;
  
    //     return sortDescriptor.direction === "descending" ? -cmp : cmp;
    //   });
    // }, [sortDescriptor, pageBill]);
    // const onSearchChange = useCallback((value?: string) => {
    //   if (value) {
    //     setFilterValue(value);
  
    //     setPage(1);
    //   } else {
    //     setFilterValue("");
    //   }
    // }, []);
  
    const onClear = useCallback(() => {
      setFilterValue("");
    //   setPage(1);
    }, []);

    console.log(fetchBill)
  
    return (
      <Table
        aria-label="Example static collection table"
        className="text-black w-full"
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={convertedBill} emptyContent={"No bid to display"}>
          {(bid) => (
            <TableRow key={bid.id}>
              {(columnKey) => (
                <TableCell className="max-w-xs truncate">
                  {renderCell(bid, columnKey, fetchBill)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
  