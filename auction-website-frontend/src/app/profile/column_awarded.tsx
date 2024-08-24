"use client";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import BillModal from "../components/BillModal";

export type Bid = {
  id: string;
  user: number;
  name: string;
  item: number;
  amount: string;
  auto_bidding: boolean;
  timestamp: string; // or Date if you prefer to handle it as a Date object
  status: string;
  winner: number;
};

export const renderCell = (bid: Bid, columnKey: React.Key) => {
  const cellValue = bid[columnKey as keyof Bid];
  switch (columnKey) {
    case "bill":
      return (
        <>
          <BillModal item_id={parseFloat(bid.id)} name={bid.name}/>
        </>
      );
    default:
      return cellValue;
  }
};

export const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "expiry_time",
    label: "EXPIRY TIME",
  },
  {
    key: "highest_bid_amount",
    label: "BID AMOUNT",
  },
  {
    key: "bill",
    label: "BILL",
  },
];
