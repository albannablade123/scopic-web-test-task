export class NotificationService {
    private apiUrl: string;
  
    constructor(apiUrl: string) {
      this.apiUrl = apiUrl;
    }

    public async getNotificationByUser(user_id:string) {
        const url = `${this.apiUrl}/notification?user_id=${encodeURIComponent(user_id)}`;

    
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          return result;
        } catch (error) {
          console.error("Error fetching product:", error);
          return null;
        }
      }

}