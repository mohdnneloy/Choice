#======== Package Imports ==========
from django.core.files.base import ContentFile
from PIL import Image
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from web3 import Web3
import hashlib
import cryptocode
from .face_recognition_feature import voterFaceRecognition
import base64
from .fingerprint_match import fingerpMatch

#=============== Contracts ================
from .contracts import initializeGanacheContract1


#=============== Models ================
from user.models import Voter, Admin, PartyAmbassador, Arizona_Voter, Temp
from .models import Poll, Candidate
from campaign.models import Campaign

#=============== Serializers ===========

from user.serializers import VoterSerializer, ProfileVoterSerializer, AdminSerializer, ProfileAdminSerializer, \
                             PartyAmbassadorSerializer, ProfilePartyAmbassadorSerializer, TempSerializer
from campaign.serializers import CampaignSerializer
from .serializers import PollSerializer, CandidateSerializer

#=============== Crypto Key ================
passkey = 'wow'

#=============== Views ================


# API to Register New Voter
@api_view(['POST'])
def addVoter(request):

    # Obtain data from the request
    state_id = request.data.get("state_id", None)
    first_name = request.data.get("first_name", None).capitalize()
    last_name = request.data.get("last_name", None).capitalize()
    state = request.data.get("state", None)
    dob = request.data.get("dob", None)
    gender = request.data.get("gender", None)
    email = request.data.get("email", None)
    password = request.data.get("password", None)
    wallet_address = request.data.get("wallet_address", None)
    image_b64 = request.data.get("image_b64", None)
    fimage_b64 = request.data.get("fimage_b64", None)

    # Filtering Voter with Given Voter ID from the Database
    voter = Voter.objects.filter(state_id=state_id)

    # Admin of the specific state is required to register the voter in to the system
    admin = Admin.objects.filter(state=state)

    # If admin of the state is not registered then voter cannot be registered
    if not admin.exists():
        print("Election Administrator of the State is not Registered!")
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Skip Voter Registration if Voter Already Exists
    if voter.exists():
        print("Voter Already Registered")
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    # Register Voter if Voter does not exist
    else:

        # Checking govt database
        voter_check = Arizona_Voter.objects.filter(state_id=state_id)

        if not voter_check.exists():
            return Response(status=status.HTTP_409_CONFLICT)

        voter_check = Arizona_Voter.objects.get(state_id=state_id)
        voter_check_image = voter_check.image
        voter_check_fprint = voter_check.finger_print


        # Saving incoming base64 image for further use
        format, imgstr = image_b64.split(';base64,')
        ext = format.split('/')[-1]
        data = ContentFile(base64.b64decode(imgstr))
        file_name = state_id + "." + ext

        # Saving incoming base64 fingerprint image for further use
        format, fimgstr = fimage_b64.split(';base64,')
        f_ext = format.split('/')[-1]
        fdata = ContentFile(base64.b64decode(fimgstr))
        f_file_name = state_id + "." + ext


        # Temporary data for voter
        temp = Temp()
        temp.state_id = state_id
        temp.image.save(file_name, data, save=True)  # image is User's model field
        temp.finger_print.save(f_file_name, fdata, save=True)  # image is User's model field
        temp_voter_image = temp.image
        temp_voter_fingerprint = temp.finger_print
        print("Saved")

        # Face recognition Test
        check_face = voterFaceRecognition(temp_voter_image, voter_check_image)

        # Finger print Test
        check_fprint = fingerpMatch(temp_voter_fingerprint, voter_check_fprint)

        test = Image.open(temp_voter_image)
        test2 = Image.open(temp_voter_fingerprint)
        test.close()
        test2.close()

        # Delete Temporary Voter Data After Face Recognition is Complete
        Temp.objects.get(state_id=state_id).image.delete(save=True)
        Temp.objects.get(state_id=state_id).finger_print.delete(save=True)
        temp.delete()

        if check_fprint is False:
            return Response(status=status.HTTP_402_PAYMENT_REQUIRED)

        if check_face is False:
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)


        # Retrieving Wallet Address of the State Admin to register the voter
        admin = Admin.objects.get(state=state)
        admin_wallet_address = admin.wallet_address
        admin_wallet_address_pk = admin.wallet_address_pk

        # Checking if wallet address from request is already registered or not
        wallet_address_check = Voter.objects.filter(wallet_address=wallet_address)

        if wallet_address_check.exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Registering Voter into Blockchain
        contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1()

        # Check if Address is valid
        if not Web3.isChecksumAddress(wallet_address):
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Registering Voter
        addingVoter_tx = contract.functions.addVoter(state_id, email, state, wallet_address).buildTransaction(
                            {'gasPrice': web3.eth.gas_price,
                             'from': web3.toChecksumAddress(admin_wallet_address),
                             'nonce': web3.eth.get_transaction_count(Web3.toChecksumAddress(admin_wallet_address)),
                             }
                        )

        tx_create = web3.eth.account.sign_transaction(addingVoter_tx, cryptocode.decrypt(admin_wallet_address_pk, passkey))
        tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        print(f'Tx successful with hash: {tx_receipt.transactionHash.hex()}')

        # Data to be stored in database
        data = {'state_id': state_id, 'first_name': first_name, 'last_name': last_name, 'state': state, 'dob': dob,
                'gender': gender, 'email': email, 'password': password, 'wallet_address': wallet_address,
                'tx_receipt': str(tx_hash.hex())}

        print(data)
        serializer = VoterSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            # Request field might have some field empty
            return Response(status=status.HTTP_400_BAD_REQUEST)


# API to Login Voter into the System
@api_view(['POST'])
def loginVoter(request):

    email = request.data.get("email", None)
    password = request.data.get("password", None)

    voter = Voter.objects.filter(email=email)

    if voter.exists():
        voter = Voter.objects.get(email=email)
        password_check = voter.password

        if hashlib.md5(password.encode()).hexdigest() == password_check:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    else :
        return Response(status=status.HTTP_400_BAD_REQUEST)


# API to return all the required data of Voter to be displayed in the frontend
@api_view(['POST'])
def profileVoter(request):

    email = request.data.get("email", None)
    voter = Voter.objects.filter(email=email)

    if voter.exists():
        serializer = ProfileVoterSerializer(voter, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# API to register new admin
@api_view(['POST'])
def addAdmin(request):

    # Obtain data from the request
    state_id = request.data.get("state_id", None)
    first_name = request.data.get("first_name", None).capitalize()
    last_name = request.data.get("last_name", None).capitalize()
    state = request.data.get("state", None)
    dob = request.data.get("dob", None)
    gender = request.data.get("gender", None)
    email = request.data.get("email", None)
    password = request.data.get("password", None)
    wallet_address = request.data.get("wallet_address", None)
    wallet_address_pk = request.data.get("wallet_address_pk", None)



    # Filtering Admin with Given State from the Database
    admin = Admin.objects.filter(state=state)

    # Skip Admin Registration if Admin Already Exists
    if admin.exists():
        print("Admin Already Registered for the State")
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    # Register Admin if Admin does not exist
    else:
        # Checking if wallet address from request is already registered or not
        wallet_address_check = Admin.objects.filter(wallet_address=wallet_address)

        if wallet_address_check.exists():
            return Response(status=status.HTTP_403_FORBIDDEN)


        # Registering Admin into Blockchain
        contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1()

        # Check if Address is valid
        if not Web3.isChecksumAddress(wallet_address):
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Checking if the private key is valid
        check = web3.eth.account.from_key(wallet_address_pk).address
        wallet_address_pk = cryptocode.encrypt(wallet_address_pk, passkey)

        if check != wallet_address:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Registering Voter
        addingAdmin_tx = contract.functions.addAdmin(email, state_id, wallet_address).buildTransaction(
            {'gasPrice': web3.eth.gas_price,
             'from': web3.toChecksumAddress(contract_deployer_address),
             'nonce': web3.eth.get_transaction_count(Web3.toChecksumAddress(contract_deployer_address)),
             }
        )

        tx_create = web3.eth.account.sign_transaction(addingAdmin_tx, contract_deployer_address_pk)
        tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        print(f'Tx successful with hash: {tx_receipt.transactionHash.hex()}')

        # Data to be stored in database
        data = {'state_id': state_id, 'first_name': first_name, 'last_name': last_name, 'state': state, 'dob': dob,
                'gender': gender, 'email': email, 'password': password, 'wallet_address': wallet_address,
                'wallet_address_pk': wallet_address_pk, 'tx_receipt': str(tx_hash.hex())}

        print(data)
        serializer = AdminSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            # Request field might have some field empty
            return Response(status=status.HTTP_400_BAD_REQUEST)

# API to Login Admin into the System
@api_view(['POST'])
def loginAdmin(request):

    email = request.data.get("email", None)
    password = request.data.get("password", None)

    admin = Admin.objects.filter(email=email)

    if admin.exists():
        admin = Admin.objects.get(email=email)
        password_check = admin.password

        if hashlib.md5(password.encode()).hexdigest() == password_check:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    else :
        return Response(status=status.HTTP_400_BAD_REQUEST)

# API to return all the required data of Admin to be displayed in the frontend
@api_view(['POST'])
def profileAdmin(request):

    email = request.data.get("email", None)
    admin = Admin.objects.filter(email=email)

    if admin.exists():
        # serializer = ProfileAdminSerializer(admin, many=True)
        admin = Admin.objects.get(email=email)

        data = {'state_id': admin.state_id, 'first_name': admin.first_name, 'last_name': admin.last_name,
                'state': admin.state, 'dob': admin.dob,'gender': admin.gender, 'email': admin.email,
                'wallet_address': admin.wallet_address,
                'wallet_address_pk': cryptocode.decrypt(admin.wallet_address_pk, passkey),
                'tx_receipt': admin.tx_receipt}
        return Response([data], status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# API to create new poll
@api_view(['POST'])
def createPoll(request):

    # Obtain data from the request
    poll_name = request.data.get("poll_name", None)
    poll_exd = request.data.get("pollexd", None)
    poll_exd_no_days = request.data.get("polleno_days", None)
    email = request.data.get("email", None)
    candidates = request.data.get("candidates", None)

    # Retrieving Admin Wallet Address
    admin = Admin.objects.filter(email=email)

    if not admin.exists():
        return Response(status=status.HTTP_400_BAD_REQUEST)

    admin = Admin.objects.get(email=email)
    admin_wallet_address = admin.wallet_address
    admin_wallet_address_pk = admin.wallet_address_pk
    state = admin.state

    # Checking if Poll Already Exist
    poll = Poll.objects.filter(poll_name=poll_name, state=state)

    if poll.exists():
        return Response(status=status.HTTP_403_FORBIDDEN)

    # Registering Poll into Blockchain
    contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1();

    # Registering Poll
    addingPoll_tx = contract.functions.createNewPoll(poll_name, state, poll_exd_no_days).buildTransaction(
        {'gasPrice': web3.eth.gas_price,
         'from': web3.toChecksumAddress(admin_wallet_address),
         'nonce': web3.eth.get_transaction_count(Web3.toChecksumAddress(admin_wallet_address)),
         }
    )

    tx_create = web3.eth.account.sign_transaction(addingPoll_tx, cryptocode.decrypt(admin_wallet_address_pk, passkey))
    tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    print(f'Tx successful with hash: {tx_receipt.transactionHash.hex()}')

    # Data to be stored in database
    data = {'poll_name': poll_name, 'state': state, 'admin_creator_wallet_address': admin_wallet_address,
            'tx_receipt': str(tx_hash.hex()), 'expire_date': poll_exd}

    print(data)
    serializer = PollSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        addCandidate(candidates, admin_wallet_address, admin_wallet_address_pk, poll_name, state)
        return Response(status=status.HTTP_200_OK)
    else:
        # Request field might have some field empty
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


# Function to store candidate details into the database and the blockchain
def addCandidate(candidates, admin_wallet_address, admin_wallet_address_pk, poll_name, state):

    for candidate in candidates:
        candidate_state_id = candidate.get("state_id", None)

        # Checking if candidate exists or not, if not then register candidate
        candidatee = Candidate.objects.filter(state_id=candidate_state_id, poll_name=poll_name)

        if not candidatee.exists():
            state_id = candidate.get("state_id", None)
            first_name = candidate.get("first_name", None)
            last_name = candidate.get("last_name", None)
            state = state
            gender = candidate.get("gender", None)
            poll_name = poll_name
            party_name = candidate.get("party_name", None)

            # Registering Candidate into Blockchain
            contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1();

            # Registering Candidate
            addingCandidate_tx = contract.functions.addCandidate(state_id, state, first_name, last_name, gender,
                                                                 poll_name).buildTransaction(
                {'gasPrice': web3.eth.gas_price,
                 'from': web3.toChecksumAddress(admin_wallet_address),
                 'nonce': web3.eth.get_transaction_count(Web3.toChecksumAddress(admin_wallet_address)),
                 }
            )

            tx_create = web3.eth.account.sign_transaction(addingCandidate_tx, cryptocode.decrypt(admin_wallet_address_pk, passkey))
            tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
            tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

            print(f'Tx successful with hash: {tx_receipt.transactionHash.hex()}')

            # Data to be stored in database
            data = {'state_id': state_id, 'state': state, 'first_name': first_name, 'last_name': last_name,
                    'gender': gender, 'poll_name': poll_name, 'admin_creator_wallet_address': admin_wallet_address,
                    'party_name': party_name, 'tx_receipt': str(tx_hash.hex())}

            print(data)
            serializer = CandidateSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
            else:
                # Request field might have some field empty
                return Response(status=status.HTTP_400_BAD_REQUEST)


# Returns all the polls created by an specific admin along with the respective candidates
@api_view(['POST'])
def pollsAdmin(request):

    email = request.data.get("email", None)
    admin = Admin.objects.get(email=email)
    admin_wallet_address = admin.wallet_address

    poll_send = []

    polls = Poll.objects.filter(admin_creator_wallet_address=admin_wallet_address)

    # If any poll exists we will return the data of the polls along with the candidate details
    if polls.exists():

        # Required for contract calls
        contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1()
        for poll in polls:

            poll_name = poll.poll_name
            state = poll.state
            created_date = poll.created_date
            expire_date = poll.expire_date
            tx_receipt = poll.tx_receipt
            published = poll.published

            # Getting Total Votes of the poll from blockchain
            returned_result = contract.functions.polls(state+poll_name).call()

            # Finding the candidates for the poll
            candidates = Candidate.objects.filter(poll_name=poll_name, admin_creator_wallet_address=admin_wallet_address)
            candidates_send = []

            for candidate in candidates:

                candidate_first_name = candidate.first_name
                candidate_last_name = candidate.last_name
                candidate_gender = candidate.gender
                candidate_state_id = candidate.state_id
                candidate_tx_receipt = candidate.tx_receipt
                candidate_party_name = candidate.party_name

                # Getting Votes of the candidate in the poll from blockchain
                returned_result2 = contract.functions.candidate_vote_tracks(candidate_state_id+poll_name).call()

                candidate_object = {'candidate_first_name': candidate_first_name,
                                    'candidate_last_name': candidate_last_name,
                                    'candidate_gender': candidate_gender,
                                    'candidate_state_id': candidate_state_id,
                                    'candidate_tx_receipt': candidate_tx_receipt,
                                    'candidate_votes': returned_result2[3],
                                    'candidate_party_name': candidate_party_name}

                candidates_send.append(candidate_object)

            poll_object = {'poll_name': poll_name, 'state': state, 'total_votes': returned_result[2],
                           'created_date': created_date, 'expire_date': expire_date, 'tx_receipt': tx_receipt,
                           'poll_published': published, 'candidates': candidates_send}

            poll_send.append(poll_object)

        # Returning data to frontend if serializer is valid
        return Response(poll_send, status=status.HTTP_200_OK)

    # If no poll exists no problem it is still acceptable
    else:
        return Response(status=status.HTTP_200_OK)


# Returns all the polls of a specific state based on the state of the voter along with the respective candidates
@api_view(['POST'])
def pollsVoter(request):

    # Voter Details
    email = request.data.get("email", None)
    voter = Voter.objects.get(email=email)
    voter_state_id = voter.state_id
    voter_wallet_address = voter.wallet_address
    voter_state = voter.state

    # Admin Details
    admin = Admin.objects.get(state=voter_state)
    admin_wallet_address = admin.wallet_address

    # Required for contract calls
    contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1()

    # Checking if voter is a valid voter based on the blockchain database
    returned_result = contract.functions.voters(voter_wallet_address).call()

    # If voter state id is empty from blockchain then he/she is not a valid voter
    if(returned_result[0]==""):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    poll_send = []

    polls = Poll.objects.filter(state=voter_state)

    # If any poll exists we will return the data of the polls along with the candidate details
    if polls.exists():

        for poll in polls:

            poll_name = poll.poll_name
            state = poll.state
            created_date = poll.created_date
            expire_date = poll.expire_date
            tx_receipt = poll.tx_receipt
            published = poll.published

            # Getting Total Votes of the poll from blockchain
            returned_result2 = contract.functions.polls(state + poll_name).call()

            # Finding the candidates for the poll
            candidates = Candidate.objects.filter(poll_name=poll_name,
                                                  admin_creator_wallet_address=admin_wallet_address)
            candidates_send = []

            for candidate in candidates:
                candidate_first_name = candidate.first_name
                candidate_last_name = candidate.last_name
                candidate_gender = candidate.gender
                candidate_state_id = candidate.state_id
                candidate_tx_receipt = candidate.tx_receipt
                candidate_party_name = candidate.party_name

                # Getting Votes of the candidate in the poll from blockchain
                returned_result3 = contract.functions.candidate_vote_tracks(candidate_state_id + poll_name).call()

                candidate_object = {'candidate_first_name': candidate_first_name,
                                    'candidate_last_name': candidate_last_name,
                                    'candidate_gender': candidate_gender,
                                    'candidate_state_id': candidate_state_id,
                                    'candidate_tx_receipt': candidate_tx_receipt,
                                    'candidate_votes': returned_result3[3],
                                    'candidate_party_name': candidate_party_name}

                candidates_send.append(candidate_object)

            # Checking if voter already voted on this poll
            returned_result4 = contract.functions.voter_tracks(voter_state_id+poll_name).call()

            if returned_result4[0] == "":
                voter_can_vote = True
            else:
                voter_can_vote = False

            poll_object = {'poll_name': poll_name, 'state': state, 'total_votes': returned_result2[2],
                           'created_date': created_date, 'expire_date': expire_date, 'tx_receipt': tx_receipt,
                           'candidates': candidates_send, 'voter_can_vote': voter_can_vote, 'poll_published': published}

            poll_send.append(poll_object)

        # Returning data to frontend if serializer is valid
        return Response(poll_send, status=status.HTTP_200_OK)

    # If no poll exists no problem it is still acceptable
    else:
        return Response(status=status.HTTP_200_OK)

# Takes all the required data from the frontend and submits the vote
@api_view(['POST'])
def castVote(request):

    # Voter Details
    email = request.data.get("voter_email", None)
    voter = Voter.objects.get(email=email)
    voter_wallet_address = voter.wallet_address

    # Details for vote submission
    candidate_state_id = request.data.get("candidate_state_id", None)
    poll_name = request.data.get("poll_name", None)
    state = request.data.get("state", None)

    # Admin Details
    admin = Admin.objects.get(state=state)
    admin_wallet_address = admin.wallet_address
    admin_wallet_address_pk = admin.wallet_address_pk

    # Required for contract calls
    contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1()

    # Casting Vote on Blockchain
    castingVote_tx = contract.functions.castVote(voter_wallet_address, candidate_state_id,
                                                 poll_name, state).buildTransaction(
        {'gasPrice': web3.eth.gas_price,
         'from': web3.toChecksumAddress(admin_wallet_address),
         'nonce': web3.eth.get_transaction_count(Web3.toChecksumAddress(admin_wallet_address)),
         }
    )

    tx_create = web3.eth.account.sign_transaction(castingVote_tx, cryptocode.decrypt(admin_wallet_address_pk, passkey))
    tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    print(f'Tx successful with hash: {tx_receipt.transactionHash.hex()}')

    # If the vote casting is successfull then transfer reward to the wallet address of the voter
    if (tx_receipt.transactionHash.hex() != ""):

        nonce = web3.eth.getTransactionCount(admin_wallet_address)
        tx = {
            'nonce': nonce,
            'to': voter_wallet_address,
            'value': web3.toWei(0.1, 'ether'),
            'gas': 2000000,
            'gasPrice': web3.toWei('50', 'gwei')
        }
        signed_tx = web3.eth.account.sign_transaction(tx, cryptocode.decrypt(admin_wallet_address_pk, passkey))
        tx_hash2 = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
        tx_receipt2 = web3.eth.wait_for_transaction_receipt(tx_hash2)

        # If the reward transaction is a success
        if (tx_receipt2.transactionHash.hex() != ""):
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Add new Party Ambassador
@api_view(['POST'])
def addPartyAmbassador(request):

    # Obtain data from the request
    state_id = request.data.get("state_id", None)
    first_name = request.data.get("first_name", None).capitalize()
    last_name = request.data.get("last_name", None).capitalize()
    state = request.data.get("state", None)
    dob = request.data.get("dob", None)
    gender = request.data.get("gender", None)
    email = request.data.get("email", None)
    password = request.data.get("password", None)
    wallet_address = request.data.get("wallet_address", None)
    party_name = request.data.get("party_name", None)

    # Filtering Voter with Given Voter ID from the Database
    party_ambassador = PartyAmbassador.objects.filter(state_id=state_id)

    # Skip Party Ambassador Registration if Voter Already Exists
    if party_ambassador.exists():
        print("Party Ambassador Already Registered")
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    # Register Party Ambassador if Party Ambassador does not exist
    else:

        # Checking if wallet address from request is already registered or not
        wallet_address_check = PartyAmbassador.objects.filter(wallet_address=wallet_address)

        if wallet_address_check.exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Data to be stored in database
        data = {'state_id': state_id, 'first_name': first_name, 'last_name': last_name, 'state': state, 'dob': dob,
                'gender': gender, 'email': email, 'password': password, 'wallet_address': wallet_address,
                'party_name': party_name}

        print(data)
        serializer = PartyAmbassadorSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            # Request field might have some field empty
            return Response(status=status.HTTP_400_BAD_REQUEST)


# API to Login Party Ambassador into the System
@api_view(['POST'])
def loginPartyAmbassador(request):

    email = request.data.get("email", None)
    password = request.data.get("password", None)

    party_ambassador = PartyAmbassador.objects.filter(email=email)

    if party_ambassador.exists():
        party_ambassador = PartyAmbassador.objects.get(email=email)
        password_check = party_ambassador.password

        if hashlib.md5(password.encode()).hexdigest() == password_check:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    else :
        return Response(status=status.HTTP_400_BAD_REQUEST)


# API to return all the required data of Party Ambassador to be displayed in the frontend
@api_view(['POST'])
def profilePartyAmbassador(request):

    email = request.data.get("email", None)
    party_ambassador = PartyAmbassador.objects.filter(email=email)

    if party_ambassador.exists():
        serializer = ProfilePartyAmbassadorSerializer(party_ambassador, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# API to add new Campaign
@api_view(['POST'])
def createCampaign(request):

    # Obtain data from the request
    email = request.data.get("email", None)
    heading = request.data.get("campaign_heading", None)
    description = request.data.get("campaign_description", None)
    campaignexd = request.data.get("campaignexd", None)
    campaigneno_days = request.data.get("campaigneno_days", None)
    party_ambassador_wallet_address_pk = request.data.get("wallet_address_pk", None)
    image_b64 = request.data.get("image", None)

    # Filtering Voter with Given Voter ID from the Database
    party_ambassador = PartyAmbassador.objects.filter(email=email)


    # Skip Campaign creation if party ambassador does not exist
    if not party_ambassador.exists():
        print("Party Ambassador is not registered!")
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    # Obtain some info from the party_ambassador
    party_ambassador = PartyAmbassador.objects.get(email=email)
    by_party_ambassador = party_ambassador.state_id
    party_ambassador_wallet_address = party_ambassador.wallet_address
    state = party_ambassador.state

    # Completing the transaction "Create Campaign, then transfer some ether to admin wallet"
    admin = Admin.objects.get(state=state)
    admin_wallet_address = admin.wallet_address



    contract, web3, contract_deployer_address, contract_deployer_address_pk = initializeGanacheContract1()

    # Checking if the private key is valid
    check = web3.eth.account.from_key(party_ambassador_wallet_address_pk).address

    if check != party_ambassador_wallet_address:
        return Response(status=status.HTTP_403_FORBIDDEN)

    nonce = web3.eth.getTransactionCount(party_ambassador_wallet_address)
    tx = {
        'nonce': nonce,
        'to': admin_wallet_address,
        'value': web3.toWei(campaigneno_days*0.025, 'ether'),
        'gas': 2000000,
        'gasPrice': web3.toWei('50', 'gwei')
    }
    signed_tx = web3.eth.account.sign_transaction(tx, party_ambassador_wallet_address_pk)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    # If the transaction is a success
    if (tx_receipt.transactionHash.hex() == ""):
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Data to be stored in database
    data = {'heading': heading, 'description': description, 'state': state,
            'by_party_ambassador': by_party_ambassador, 'tx_receipt': str(tx_hash.hex()), 'expire_date': campaignexd}


    serializer = CampaignSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

        # Saving incoming base64 image for further use
        format, imgstr = image_b64.split(';base64,')
        ext = format.split('/')[-1]
        data = ContentFile(base64.b64decode(imgstr))
        file_name = by_party_ambassador + state + "." + ext

        # Temporary data for voter
        temp = Campaign.objects.get(tx_receipt=str(tx_hash.hex()))
        temp.image.save(file_name, data, save=True)  # image is User's model field
        return Response(status=status.HTTP_200_OK)
    else:
        print(serializer.errors)
        # Request field might have some field empty
        return Response(status=status.HTTP_400_BAD_REQUEST)

# API return available Campaigns for specific state and creator based
@api_view(['POST'])
def PACampaign(request):

    # Obtain data from the request
    email = request.data.get("email", None)

    # Filtering Voter with Given Voter ID from the Database
    party_ambassador = PartyAmbassador.objects.filter(email=email)

    # Skip Campaign creation if party ambassador does not exist
    if not party_ambassador.exists():
        print("Party Ambassador is not registered!")
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    # Obtain some info from the party_ambassador
    party_ambassador = PartyAmbassador.objects.get(email=email)
    pa_sate_id = party_ambassador.state_id
    state = party_ambassador.state

    campaigns = Campaign.objects.filter(state=state, by_party_ambassador=pa_sate_id)
    data = []

    if campaigns.exists():
        for campaign in campaigns:
            if campaign.image == "":
                campaign_obj = {'heading': campaign.heading, 'description': campaign.description, 'state': campaign.state,
                                'create_date': campaign.create_date, 'expire_date': campaign.expire_date,
                                'tx_receipt': campaign.tx_receipt, 'campaign_creator': campaign.by_party_ambassador,
                                'image': ""}
                data.append(campaign_obj);

            else:
                with open(str(campaign.image), "rb") as img_file:
                    image_b64 = base64.b64encode(img_file.read())
                campaign_obj = {'heading': campaign.heading, 'description': campaign.description,
                                'state': campaign.state,
                                'create_date': campaign.create_date, 'expire_date': campaign.expire_date,
                                'tx_receipt': campaign.tx_receipt, 'campaign_creator': campaign.by_party_ambassador,
                                'image': image_b64}
                data.append(campaign_obj);


        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_200_OK)


# API to return all the campaigns available for a particular state
@api_view(['POST'])
def VoterCampaign(request):

    # Obtain data from the request
    email = request.data.get("email", None)

    # Filtering Voter with Given Voter ID from the Database
    voter = Voter.objects.filter(email=email)

    # Skip Campaign creation if party ambassador does not exist
    if not voter.exists():
        print("Voter is not registered!")
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    voter = Voter.objects.get(email=email)
    state = voter.state
    campaigns = Campaign.objects.filter(state=state)

    data = []

    if campaigns.exists():
        for campaign in campaigns:
            # Obtain some info from the party_ambassador
            party_ambassador = PartyAmbassador.objects.get(state_id=campaign.by_party_ambassador)
            name = party_ambassador.first_name + " " + party_ambassador.last_name

            if campaign.image == "":
                campaign_obj = {'heading': campaign.heading, 'description': campaign.description, 'state': campaign.state,
                                'create_date': campaign.create_date, 'expire_date': campaign.expire_date,
                                'campaign_creator': name, 'image': ""}
                data.append(campaign_obj);

            else:
                with open(str(campaign.image), "rb") as img_file:
                    image_b64 = base64.b64encode(img_file.read())
                campaign_obj = {'heading': campaign.heading, 'description': campaign.description,
                                'state': campaign.state,
                                'create_date': campaign.create_date, 'expire_date': campaign.expire_date,
                                'campaign_creator': name, 'image': image_b64}
                data.append(campaign_obj);

        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_200_OK)


# API to publish results of the poll
@api_view(['POST'])
def pollPublish(request):

    # Obtain data from the request
    email = request.data.get("email", None)
    poll_name = request.data.get("poll_name", None)

    # Obtaining Wallet Address of the Admin
    admin = Admin.objects.get(email=email)
    admin_creator_wallet_address = admin.wallet_address

    poll = Poll.objects.get(admin_creator_wallet_address=admin_creator_wallet_address, poll_name=poll_name)
    poll.published = True
    poll.save()

    return Response(status=status.HTTP_200_OK)

