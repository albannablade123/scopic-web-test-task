export type Bid = {
  user: number;
  item: number;
  amount: string;
  auto_bidding: boolean;
  timestamp: string; // or Date if you prefer to handle it as a Date object
  status: string;
};

export const renderCell = (
  bid: Bid,
  columnKey: React.Key,
) => {
  const cellValue = bid[columnKey as keyof Bid];

  switch (columnKey) {
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
    label: "ACTIONS",
  },
  {
    key: "latest_bid_status",
    label: "STATUS"
  }
];