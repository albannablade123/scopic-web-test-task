export class ItemService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  private async fetchWrapper(url: string, options: RequestInit): Promise<any> {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  public async getAllBidsByItemId(
    itemId: number,
    page?: number,
    page_size?: number
  ) {
    try {
      let url = `http://localhost:8000/api/bid?item_id=${itemId}`;
      if (page) {
        console.log("copy_pasta");

        url = `http://localhost:8000/api/bid?item_id=${itemId}&page=${page}&page_size=${page_size}`;
      } else {
      }

      console.log("YYYYYYYYYYYYYYYY", url, page, page_size);
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

  public async getAllItemActions() {
    const url = `${this.apiUrl}/item`;

    try {
      const response = await fetch(`http://localhost:8000/api/item`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  }

  public async getItemById(id: number): Promise<any> {
    const url = `${this.apiUrl}/item/${id}`;
    return this.fetchWrapper(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async deleteItem(id: number): Promise<number | null> {
    const url = `${this.apiUrl}/item/${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.status;
    } catch (error) {
      console.error("Error deleting item:", error);
      return null;
    }
  }

  public async createItem(formData: any): Promise<boolean | null> {
    const url = `${this.apiUrl}/item`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.ok;
    } catch (error) {
      console.error("Error creating item:", error);
      return null;
    }
  }

  public async updateItem(formData: any, id: number): Promise<boolean | null> {
    const url = `${this.apiUrl}/item/${id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.ok;
    } catch (error) {
      console.error("Error updating item:", error);
      return null;
    }
  }

  public formatDateToInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
