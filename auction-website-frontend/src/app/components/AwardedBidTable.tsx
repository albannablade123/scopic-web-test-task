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
import { Bid, columns, renderCell } from "../profile/column_awarded";
import { ItemService } from "../utils/actions/ItemService";
import { SearchIcon } from "./icons";
import { BidService } from "../utils/actions/BidService";

interface BidTableProps {
  userId: number;
}

export default function AwardedBidTable({userId}: BidTableProps) {
  const bidService = new BidService();
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [convertedBid, setConvertedBid] = useState<Bid[]>([]);

  const fetchBid = async () => {
    const fetchedBid = await bidService.getAllBidsByUserId(userId);
    setConvertedBid(fetchedBid);
  };

  useEffect(() => {
    fetchBid();
  }, []);

  const filteredBid = useMemo(() => {
    let filteredListings = [...convertedBid];

    filteredListings = filteredListings.filter((item) => item.winner == 1);

    return filteredListings;
  }, [convertedBid, filterValue, hasSearchFilter]);

  // console.log("TEST", filteredBid);
  // const [page, setPage] = useState(1);
  // const rowsPerPage = 10;

  // const pages = Math.ceil(filteredBid.length / rowsPerPage);

  // const pageBid = useMemo(() => {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;

  //   return filteredBid.slice(start, end);
  // }, [page, filteredBid]);

  // const [sortDescriptor, setsortDescriptor] = useState({
  //   column: "name",
  //   direction: "ascending",
  // });

  // const sortedBid = useMemo(() => {
  //   return [...pageBid].sort((a: Item, b: Item) => {
  //     const first = a[sortDescriptor.column as keyof Item] as string;
  //     const second = b[sortDescriptor.column as keyof Item] as string;
  //     const cmp = first < second ? -1 : first > second ? 1 : 0;

  //     return sortDescriptor.direction === "descending" ? -cmp : cmp;
  //   });
  // }, [sortDescriptor, pageBid]);
  // const onSearchChange = useCallback((value?: string) => {
  //   if (value) {
  //     setFilterValue(value);

  //     setPage(1);
  //   } else {
  //     setFilterValue("");
  //   }
  // }, []);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(filteredBid.length / rowsPerPage);

  const pageBid = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredBid.slice(start, end);
  }, [page, filteredBid]);

  const onClear = useCallback(() => {
    setFilterValue("");
    //   setPage(1);
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
      <TableBody items={pageBid} emptyContent={"No bid to display"}>
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
