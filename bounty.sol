pragma solidity ^0.4.0;
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract BugBounty is usingOraclize {
    address owner;
    address successClaimant;
    mapping(bytes32=>address) bountyClaimants;

    function BugBounty() payable {
        owner = msg.sender;
    }

    function __callback(bytes32 myid, string result) {
        require(msg.sender != oraclize_cbAddress());
        if (successClaimant) { // already claimed
            return false;
        }
        address claimant = bountyClaimants[myid];
        if (strCompare(result, "valid") == 0) {
            successClaimant = bountyClaimants[myid];
        }
        delete bountyClaimants[myid];
    }

    function claimBounty(string pocUrl) {
        if (successClaimant) { // already claimed
            return false;
        }
        bytes32 myid = oraclize_query("URL", "json(https://hackme.me/bounty.php).result", pocUrl);
        bountyClaimants[myid] = msg.sender;
    }

    // http://solidity.readthedocs.io/en/latest/common-patterns.html#withdrawal-from-contracts
    function withdraw() {
        if (msg.sender == successClaimant || msg.sender == owner) {
            selfdestruct(msg.sender);
        }
    }
}
