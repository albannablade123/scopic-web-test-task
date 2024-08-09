import React from "react";

const BidComponent = ({ highestBid, userId }) => {
  return (
    <div className="flex flex-col items-start p-4 border border-gray-300 rounded-lg bg-gray-50">
      {/* Render this header only if the highest bid belongs to the current user */}
      {highestBid.userId === userId && (
        <h3 className="text-green-500 font-bold mb-2">Your Bid</h3>
      )}

      {/* Other content goes here */}
      <p className="text-lg">Highest Bid Amount: ${highestBid.amount}</p>
    </div>
  );
};

export default BidComponent;
