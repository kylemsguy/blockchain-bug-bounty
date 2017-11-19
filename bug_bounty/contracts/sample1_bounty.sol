pragma solidity ^0.4.0;
import "./bounty.sol";
contract Sample1BugBounty is BugBounty {
    function Sample1BugBounty() BugBounty("URL", "json(https://hackme.me/bounty.php).result", "valid") {
    }
}
