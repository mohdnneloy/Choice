# Rest Framework
from rest_framework import serializers

# Models
from .models import Poll, Candidate


# Serializer for poll
class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poll
        fields = ('poll_name', 'state', 'admin_creator_wallet_address', 'tx_receipt', 'expire_date')

# Serializer for candidate
class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('state_id', 'state', 'first_name', 'last_name', 'gender', 'poll_name', 'admin_creator_wallet_address',
                  'tx_receipt', 'party_name')
