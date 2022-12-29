# Rest Framework
from rest_framework import serializers

# Models
from .models import Campaign

# Serializer for Campaigns
class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('heading', 'description', 'state', 'by_party_ambassador', 'tx_receipt', 'expire_date')