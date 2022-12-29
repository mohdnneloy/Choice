import datetime
from django.db import models


# Campaign Model
class Campaign(models.Model):
    image = models.ImageField(upload_to='campaign/images', default=None, null=True)
    heading = models.CharField(max_length=50, default=None, null=False)
    description = models.CharField(max_length=500, default=None, null=True)
    create_date = models.DateField(default=datetime.datetime.now().date(), null=False)
    expire_date = models.DateField(default=datetime.datetime.now().date() + datetime.timedelta(7), null=False)
    by_party_ambassador = models.CharField(max_length=9, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=True)
    tx_receipt = models.CharField(max_length=66, default=None, null=True)

    def __str__(self):
        return self.heading + ' ' + self.description + ' ' + self.by_party_ambassador + ' ' + self.state + ' ' \
               + self.tx_receipt

