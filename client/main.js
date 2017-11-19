const abi_array = [
  {
    "constant": false,
    "inputs": [],
    "name": "priceForInvokingClaimBounty",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "myid",
        "type": "bytes32"
      },
      {
        "name": "result",
        "type": "string"
      }
    ],
    "name": "__callback",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "myid",
        "type": "bytes32"
      },
      {
        "name": "result",
        "type": "string"
      },
      {
        "name": "proof",
        "type": "bytes"
      }
    ],
    "name": "__callback",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "postData",
        "type": "string"
      }
    ],
    "name": "claimBounty",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "claimAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "msg",
        "type": "string"
      }
    ],
    "name": "bountyLogEvent",
    "type": "event"
  }
];

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var contractEvent = null;
var forceClaim = false;

async function doSubmit(){
    // call web3 and start trying to win
    // 0x5362b90b77e0fb46d7bb2eb5c8769fb849ff6bcf
    if(contractEvent){
        contractEvent.stopWatching();
    }
    $("#status").html("Working...");
    web3.eth.defaultAccount = web3.eth.coinbase;
    var address = $("#bountyAddr").val();
    var exploit = $("#exploit").val();

    console.log("address:", address);

    var oldBalance = web3.eth.getBalance(web3.eth.defaultAccount);

    var BugBounty = web3.eth.contract(abi_array);
    var bb = BugBounty.at(address);

    var claimCost = bb.priceForInvokingClaimBounty.call()

    bb.claimBounty.sendTransaction(exploit, {
        value: claimCost,
        gas: 6721975
    });

    contractEvent = bb.bountyLogEvent({
        claimAddress: web3.eth.defaultAccount
    });

    contractEvent.watch(function(error, result){
        console.log(error, result);
        $("#status").html(result.args.msg);
        if(forceClaim || result.args.msg === "Successfully claimed bounty"){
            $("#status").attr("class", "alert alert-success");
            var result = bb.withdraw.sendTransaction({
                gas: 6721975
            });
            console.log(result);
            var newBalance = web3.eth.getBalance(web3.eth.defaultAccount);

            $("#status").html(result.args.msg + " Old balance: <b>" + web3.fromWei(oldBalance, "ether")
             + "</b> New balance: <b>" + web3.fromWei(newBalance) + "</b>");
        } else {
            $("#status").attr("class", "alert alert-warning");
        }
        contractEvent.stopWatching();
        contractEvent = null;
    })
}

$(function(){
    $("#sendForm").submit(function(e){
        doSubmit();
        return false;
    });
});
