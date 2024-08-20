export class BidService {
    public async getAllBidsByUserId(
        userId: number,
        page?: number,
        page_size?: number
      ) {
        try {
          let url = `http://localhost:8000/api/bid?user_id=${userId}`;
          if (page) {
    
            url = `http://localhost:8000/api/bid?item_id=${itemId}&page=${page}&page_size=${page_size}`;
          }
    
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          return result["bids"];
        } catch (error) {
          console.error("Error fetching bids:", error);
          return null;
        }
      }
}