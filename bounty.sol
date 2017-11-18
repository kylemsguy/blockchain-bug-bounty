pragma solidity ^0.4.0;
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract BugBounty is usingOraclize {
    /**
     * The address of the account that originally created this bounty.
     * This account can shut down the bounty at any time before it's claimed.
     */
    address owner;
    /**
     * The address of the account that won the bounty and can withdraw,
     * a value of 0 means no-one's gotten the bounty.
     */
    address successClaimant;
    /** The datasource argument for the Oraclize call used to verify the PoC.*/
    string bountyVerifierDataSource;
    /** The query argument for the Oraclize call used to verify the PoC.*/
    string bountyVerifierQuery;
    /** The value that's compared to the result of the Oraclize call:
     * if it's equal, then user won bounty.
     */
    string bountyVerifierFlagResult;
    /**
     * Map of Oraclize callback IDs to addresses of the original senders.
     */
    mapping(bytes32=>address) bountyClaimants;

    function BugBounty(string _bountyVerifierDataSource,
        string _bountyVerifierQuery, string _bountyVerifierFlagResult)
        public payable {
        owner = msg.sender;
        bountyVerifierDataSource = _bountyVerifierDataSource;
        bountyVerifierQuery = _bountyVerifierQuery;
        bountyVerifierFlagResult = _bountyVerifierFlagResult;
    }

    function __callback(bytes32 myid, string result) public {
        require(msg.sender != oraclize_cbAddress());
        require(successClaimant == address(0)); // not already claimed
        if (strCompare(result, bountyVerifierFlagResult) == 0) {
            successClaimant = bountyClaimants[myid];
        }
        delete bountyClaimants[myid];
    }

    /**
     * Allows a user to claim a bounty by providing a specific input that triggers
     * a vulnerability.
     * @param postData the data that triggers the bug: for webpages, this is POST data.
     */
    // TODO: make the person calling this function pay for the query and callback.
    // since right now someone can just keep calling this with bogus data to
    // drain the bounty.
    function claimBounty(string postData) public returns (bool) {
        if (successClaimant != address(0)) { // already claimed
            return false;
        }
        bytes32 myid = oraclize_query(bountyVerifierDataSource, bountyVerifierQuery, postData);
        bountyClaimants[myid] = msg.sender;
    }

    // We use a separate withdraw function per Solidity best practices:
    // http://solidity.readthedocs.io/en/latest/common-patterns.html#withdrawal-from-contracts
    function withdraw() public {
        // Allow withdrawing by the user that won the bounty
        if (msg.sender == successClaimant) {
            selfdestruct(msg.sender);
        }
        // Allow withdrawing by the creator, but only if
        // no-one's won the bounty yet.
        if (msg.sender == owner && successClaimant == address(0)) {
            selfdestruct(msg.sender);
        }
    }
}
