# Rest Framework
from rest_framework import serializers

# Models
from user.models import Voter, Admin, PartyAmbassador, Temp

# Serializer for voter
class VoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = ('state_id', 'first_name', 'last_name', 'state', 'dob', 'gender', 'email', 'password',
                  'wallet_address', 'tx_receipt')


class ProfileVoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = ('state_id', 'first_name', 'last_name', 'state', 'dob', 'gender', 'email',
                  'wallet_address', 'tx_receipt')


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ('state_id', 'first_name', 'last_name', 'state', 'dob', 'gender', 'email', 'password',
                  'wallet_address', 'wallet_address_pk', 'tx_receipt')


class ProfileAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ('state_id', 'first_name', 'last_name', 'state', 'dob', 'gender', 'email', 'password',
                  'wallet_address', 'wallet_address_pk', 'tx_receipt')

class PartyAmbassadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyAmbassador
        fields = ('state_id', 'first_name', 'last_name', 'state', 'dob', 'gender', 'email', 'password',
                  'wallet_address', 'party_name')


class ProfilePartyAmbassadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyAmbassador
        fields = ('state_id', 'first_name', 'last_name', 'state', 'dob', 'gender', 'email',
                  'wallet_address', 'party_name')

class TempSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temp
        fields = ('state_id', 'image')
