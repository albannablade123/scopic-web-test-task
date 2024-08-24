import React from "react";
import { Bid } from "../profile/column_awarded";
import { HighestBid } from "../products/[itemId]/page";

interface BidComponentProps {
  highestBid: HighestBid;
  userId: number;
}

const BidComponent: React.FC<BidComponentProps> = ({ highestBid, userId }) => {
  return (
    <div className="flex flex-col items-start p-4 border border-gray-300 rounded-lg bg-gray-50">
      {/* Render this header only if the highest bid belongs to the current user */}
      {highestBid.userId !== null && parseFloat(highestBid.userId) === userId && (
        <h3 className="text-green-500 font-bold mb-2">Your Bid</h3>
      )}

      {/* Other content goes here */}
      <p className="text-lg">Highest Bid Amount: ${highestBid.amount}</p>
    </div>
  );
};

export default BidComponent;
