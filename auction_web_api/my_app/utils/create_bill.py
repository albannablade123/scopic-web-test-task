from ..models.bill import Bill
from ..models.bid import Bid
from django.core.exceptions import ValidationError

def create_bill(item, bid):
    """
    Create a Bill for the closed auction.

    Args:
        item (Item): The item associated with the bill.
        bid (Bid): The bid associated with the item.

    Returns:
        Bill: The created Bill instance.
    """
    try:
        bill = Bill.objects.create(
            billing_address="Example Address",  # Replace with actual address
            user=bid.user,  # Assuming the Bid has a user associated
            item=item,
            amount=bid.amount,  # Assuming the Bid has an amount
            bid=bid
        )
        return bill
    except ValidationError as e:
        print(f"Validation error while creating Bill: {e}")
    except Exception as e:
        print(f"Error while creating Bill: {e}")
    return None
