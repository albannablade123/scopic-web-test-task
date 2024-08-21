from ..models.item import Item

def get_items():
    items = Item.objects.all()

    return items
