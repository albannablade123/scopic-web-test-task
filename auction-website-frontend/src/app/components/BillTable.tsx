import { Pagination } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Input } from "postcss";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Bill, columns, renderCell } from "../profile/column_bill";
import { ItemService } from "../utils/actions/ItemService";
import { SearchIcon } from "./icons";
import { BillService } from "../utils/actions/BillService";
import { BidService } from "../utils/actions/BidService";

interface BillTableProps {
  itemId: number | null; // Adjust the type if itemId should be a different type (e.g., string)
}
export default function BillTable({ itemId }: BillTableProps) {
  const itemService = new ItemService("http://localhost:8000/api");
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [convertedBill, setConvertedBill] = useState<Bill[]>([]);

  const fetchBill = async () => {
    if (itemId != null) {
      const fetchedBill = await itemService.getAllBidsByItemId(itemId);
      console.log(itemId);
      setConvertedBill(fetchedBill);
    }
  };

  useEffect(() => {
    fetchBill();
  }, []);

  useEffect(() => {
    const socketUrl = `ws://localhost:8000/bid/${itemId}/`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const newBid = JSON.parse(event.data);
      setConvertedBill((prevBids) => [newBid, ...prevBids]); // Prepend new bid
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [itemId]);

  const filteredBill = useMemo(() => {
    let filteredListings = [...convertedBill];

    // if (hasSearchFilter) {
    //   filteredListings = filteredListings.filter((bid) =>
    //     bid.name.toLowerCase().includes(filterValue.toLowerCase())
    //   );
    // }

    return filteredListings;
  }, [convertedBill, filterValue, hasSearchFilter]);

  const [page, setPage] = useState(1);
  const [sortDescriptor, setsortDescriptor] = useState({
    column: "amount",
    direction: "descending",
  });

  const sortedBill = useMemo(() => {
    return [...filteredBill].sort((a: Bill, b: Bill) => {
      const first = a[sortDescriptor.column as keyof Bill];
      const second = b[sortDescriptor.column as keyof Bill];
      const firstValue = typeof first === "string" ? parseFloat(first) : first;
      const secondValue =
        typeof second === "string" ? parseFloat(second) : second;
      const cmp =
        firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredBill]);
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);

      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const rowsPerPage = 5;

  const pages = Math.ceil(sortedBill.length / rowsPerPage);
  const pageBill = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedBill.slice(start, end);
  }, [page, sortedBill]);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return (
    <Table
      aria-label="Example static collection table"
      className="text-black w-full"
      classNames={{
        wrapper: "min-h-[222px]",
      }}
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
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={pageBill} emptyContent={"No bid to display"}>
        {(bid) => (
          <TableRow key={bid.id}>
            {(columnKey) => (
              <TableCell className="max-w-xs truncate">
                {renderCell(bid, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
