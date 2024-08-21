export type Bill = {
    user: number;
    item: number;
    amount: string;
    billing_address: string;
    timestamp: string; // or Date if you prefer to handle it as a Date object
  };
  
  export const renderCell = (
    bill: Bill,
    columnKey: React.Key,
  ) => {
    const cellValue = bill[columnKey as keyof Bill];
    console.log(cellValue,"____________DDDD________________")
  
    switch (columnKey) {
      default:
        return cellValue;
    }
  };
  
  export const columns = [
    {
      key: "user",
      label: "USER",  // Assuming you want to display user ID or username
    },
    {
      key: "item",
      label: "ITEM",  // Assuming you want to display item ID or item name
    },
    {
      key: "amount",
      label: "AMOUNT",
    },
    {
      key: "billing_address",
      label: "BILLING ADDRESS",
    },
    {
      key: "timestamp",
      label: "TIME",
    },
];
  