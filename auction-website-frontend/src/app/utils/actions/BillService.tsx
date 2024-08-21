export class BillService {
    public async getAllBillsByUserId(
        userId: number,
        page?: number,
        page_size?: number
      ) {
        try {
          let url = `http://localhost:8000/api/bill/${userId}`;
          // if (page) {
    
          //   url = `http://localhost:8000/api/bid?item_id=${itemId}&page=${page}&page_size=${page_size}`;
          // }

          console.log("CHECKSUM")
    
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const result = await response.json();
          return result["bills"];
        } catch (error) {
          console.error("Error fetching bids:", error);
          return null;
        }
      }
}