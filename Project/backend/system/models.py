import datetime
from django.db import models


# Polls
class Poll(models.Model):
    poll_name = models.CharField(max_length=50, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=False)
    created_date = models.DateField(default=datetime.datetime.now().date(), null=True)
    expire_date = models.DateField(default=datetime.datetime.now().date() + datetime.timedelta(days=7), null=True) # Each poll will last for 7 days only
    admin_creator_wallet_address = models.CharField(max_length=42, default=None, null=False)
    candidates = models.IntegerField(default=2)
    published = models.BooleanField(default=False)
    tx_receipt = models.CharField(max_length=66, default=None, null=False)

    def __str__(self):
        return self.poll_name + ' ' + self.state + ' ' + self.admin_creator_wallet_address + ' ' + self.tx_receipt


# Candidates
class Candidate(models.Model):
    state_id = models.CharField(max_length=9, default=None, null=False)
    first_name = models.CharField(max_length=30, default=None, null=False)
    last_name = models.CharField(max_length=15, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=False)
    gender = models.CharField(max_length=6, default=None, null=False)
    poll_name = models.CharField(max_length=50, default=None, null=False)
    admin_creator_wallet_address = models.CharField(max_length=42, default=None, null=False)
    tx_receipt = models.CharField(max_length=66, default=None, null=False)
    party_name = models.CharField(max_length=100, default=None, null=True)

    def __str__(self):
        return self.state_id + ' ' + self.state + ' ' + self.first_name + ' ' + self.last_name + ' ' \
               + self.gender + ' ' + self.poll_name + ' ' + self.admin_creator_wallet_address + ' ' \
               + self.tx_receipt + ' ' + self.party_name

