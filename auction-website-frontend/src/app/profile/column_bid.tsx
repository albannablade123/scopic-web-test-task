import { Button } from "@nextui-org/react";

export type Bid = {
  id: string;
  user: number;
  item: number;
  amount: string;
  auto_bidding: boolean;
  timestamp: string; // or Date if you prefer to handle it as a Date object
  status: string;
  name: string;
};

export const renderCell = (
  bid: Bid,
  columnKey: React.Key,
) => {
  const cellValue = bid[columnKey as keyof Bid];

  switch (columnKey) {
    case "latest_bid_status":
      if (cellValue == "won") {
        return <h2 className="text-green-700 font-semibold mx-auto">Won</h2>
      }
      else if(cellValue == "in_progress"){
        return <h2 className="font-semibold mx-auto">In Progress</h2>
      }
      else{
        return <h2 className="text-red-700 font-semibold mx-auto">Lost</h2>
      }
      return (
        <Button>View Item Bill</Button>
      )
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
    key: "latest_bid_status",
    label: "STATUS"
  }
];