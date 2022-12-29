import hashlib
from django.db import models

# Govt Verification Model (Arizona)
class Arizona_Voter(models.Model):
    state_id = models.CharField(max_length=9, default=None, null=False)
    first_name = models.CharField(max_length=30, default=None, null=False)
    last_name = models.CharField(max_length=15, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=False)
    dob = models.DateField(null=True)
    gender = models.CharField(max_length=6, default=None, null=False)
    image = models.ImageField(upload_to='govt/az_voter', default=None)
    finger_print = models.ImageField(upload_to='govt/az_voter/finger_print', default=None)
    email = models.CharField(max_length=100, default=None, null=False)
    

    def __str__(self):
        return self.state_id + ' ' + self.first_name + ' ' + self.last_name + ' ' + self.state + ' ' \
               + self.gender + ' ' + self.email


# Govt Verification Model (California)
class California_Voter(models.Model):
    state_id = models.CharField(max_length=8, default=None, null=False)
    first_name = models.CharField(max_length=30, default=None, null=False)
    last_name = models.CharField(max_length=15, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=False)
    dob = models.DateField(null=True)
    gender = models.CharField(max_length=6, default=None, null=False)
    image = models.ImageField(upload_to='govt/az_voter', default=None)
    email = models.CharField(max_length=100, default=None, null=False)

    def __str__(self):
        return self.state_id + ' ' + self.first_name + ' ' + self.last_name + ' ' + self.state + ' ' \
               + self.gender + ' ' + self.email


# Voter
class Voter(models.Model):
    state_id = models.CharField(max_length=9, default=None, null=False)
    first_name = models.CharField(max_length=30, default=None, null=False)
    last_name = models.CharField(max_length=15, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=False)
    dob = models.DateField(null=True)
    gender = models.CharField(max_length=6, default=None, null=False)
    email = models.CharField(max_length=100, default=None, null=False)
    password = models.CharField(max_length=200)
    wallet_address = models.CharField(max_length=42, default=None, null=False)
    tx_receipt = models.CharField(max_length=66, default=None, null=False)

    # Save passwords with MD5() Hash
    def save(self, *args, **kwargs):
        self.password = hashlib.md5(self.password.encode()).hexdigest()
        super(Voter, self).save(*args, **kwargs)

    def __str__(self):
        return self.state_id + ' ' + self.first_name + ' ' + self.last_name + ' ' + self.state + ' ' \
               + self.gender + ' ' + self.email + ' ' + self.wallet_address + ' ' + self.tx_receipt


# Admin
class Admin(models.Model):
    state_id = models.CharField(max_length=9, default=None, null=False)
    first_name = models.CharField(max_length=30, default=None, null=False)
    last_name = models.CharField(max_length=15, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=False)
    dob = models.DateField(null=True)
    gender = models.CharField(max_length=6, default=None, null=False)
    email = models.CharField(max_length=100, default=None, null=False)
    password = models.CharField(max_length=200)
    wallet_address = models.CharField(max_length=42, default=None, null=False)
    wallet_address_pk = models.CharField(max_length=170, default=None, null=False)
    tx_receipt = models.CharField(max_length=66, default=None, null=False)

    # Save passwords with MD5() Hash
    def save(self, *args, **kwargs):
        self.password = hashlib.md5(self.password.encode()).hexdigest()
        super(Admin, self).save(*args, **kwargs)

    def __str__(self):
        return self.state_id + ' ' + self.first_name + ' ' + self.last_name + ' ' + self.state + ' ' \
               + self.gender + ' ' + self.email + ' ' + self.wallet_address + ' ' + self.tx_receipt


# Party Ambassador
class PartyAmbassador(models.Model):
    state_id = models.CharField(max_length=9, default=None, null=False)
    first_name = models.CharField(max_length=30, default=None, null=False)
    last_name = models.CharField(max_length=15, default=None, null=False)
    state = models.CharField(max_length=2, default=None, null=False)
    dob = models.DateField(null=True)
    gender = models.CharField(max_length=6, default=None, null=False)
    email = models.CharField(max_length=100, default=None, null=False)
    password = models.CharField(max_length=200)
    wallet_address = models.CharField(max_length=42, default=None, null=False)
    party_name = models.CharField(max_length=100, default=None, null=True)

    # Save passwords with MD5() Hash
    def save(self, *args, **kwargs):
        self.password = hashlib.md5(self.password.encode()).hexdigest()
        super(PartyAmbassador, self).save(*args, **kwargs)

    def __str__(self):
        return self.state_id + ' ' + self.first_name + ' ' + self.last_name + ' ' + self.state + ' ' \
               + self.gender + ' ' + self.email + ' ' + self.wallet_address + ' ' + self.party_name


# Party Ambassador
class Temp(models.Model):
    state_id = models.CharField(max_length=9, default=None, null=False)
    image = models.ImageField(upload_to='test/voters_images', default=None, null=True)
    finger_print = models.ImageField(upload_to='test/voters_fingerprints', default=None, null=True)
