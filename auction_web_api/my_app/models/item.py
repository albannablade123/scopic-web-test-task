from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    expiry_time = models.DateTimeField()
    smallImage = models.URLField(max_length=200, default='', blank=True)
    largeImage = models.URLField(max_length=200, default='', blank=True)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
