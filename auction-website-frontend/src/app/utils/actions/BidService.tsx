export class BidService {
  public async getAllBidsByUserId(
    userId: number,
    page?: number,
    page_size?: number,
    itemId?: number
  ) {
    try {
      let url = `http://localhost:8000/api/user/${userId}/bid`;
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
      return result;
    } catch (error) {
      console.error("Error fetching bids:", error);
      return null;
    }
  }
  public async getAllBidsByItemId(
    itemId: number,
    page?: number,
    page_size?: number
  ) {
    try {
      let url = `http://localhost:8000/api/user/${itemId}/bid`;
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
      return result;
    } catch (error) {
      console.error("Error fetching bids:", error);
      return null;
    }
  }
}
