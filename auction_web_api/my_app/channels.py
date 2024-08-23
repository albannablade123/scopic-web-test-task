from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

class BidConsumer(JsonWebsocketConsumer):
    def connect(self):
        print("RRRRRRRRRRRRRRRRRRRRRRRR")
        self.item_id = self.scope.get("url_route").get("kwargs").get("item_id")
        print(self.scope)
        self.group_name = f'item_{self.item_id}'

        # Join item group
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave item group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive_json(self, content):
        # Handle messages received from WebSocket, such as a new bid being placed
        # This could include validation, saving the bid to the database, etc.
        pass

    def bid_update(self, event):
        # Send message to WebSocket
        self.send_json(event['bid'])