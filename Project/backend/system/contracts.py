import json
from web3 import Web3

def initializeGanacheContract1():

    arrayStringABI='''
    [
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_email",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_state_id",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_wallet_address",
                    "type": "address"
                }
            ],
            "name": "addAdmin",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_state",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_first_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_last_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_gender",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_poll_name",
                    "type": "string"
                }
            ],
            "name": "addCandidate",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_email",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_state",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "voter_address",
                    "type": "address"
                }
            ],
            "name": "addVoter",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "admin_count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "admins",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "candidate_count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "candidate_vote_track_count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "candidate_vote_tracks",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "candidate_state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "poll_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "state",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "votes",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "candidates",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "state",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "first_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "last_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "gender",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "poll_name",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "admin_creator",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_voter",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_candidate_state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_poll_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_state",
                    "type": "string"
                }
            ],
            "name": "castVote",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "contract_creator",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_poll_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_state",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_no_days",
                    "type": "uint256"
                }
            ],
            "name": "createNewPoll",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "poll_count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "polls",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "poll_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "state",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "total_votes",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "created_date",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "expire_date",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "admin_creator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "candidates",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "voter_count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "voter_track_count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "voter_tracks",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "voter_state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "poll_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "state",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "candidate_state_id",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "voters",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "state_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "state",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]s
    '''

    # connecting with local Block Chain server
    ganache_url='Enter your Ganache URL in Local Host'
    web = Web3(Web3.HTTPProvider(ganache_url))
    Abi = json.loads(arrayStringABI)
    addressOfContract = web.toChecksumAddress("Enter Deployed Contract Address")

    # Contract Deployer Details
    contract_deployer_address = "Enter Contract Deployer Wallet Address"
    contract_deployer_address_pk = 'Enter Contract Deployer Wallet Address Private'

    # contract initialization
    contract = web.eth.contract(address=addressOfContract, abi=Abi)
    return contract, web, contract_deployer_address, contract_deployer_address_pk
