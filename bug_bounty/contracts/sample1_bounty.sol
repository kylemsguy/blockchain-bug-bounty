pragma solidity ^0.4.0;
import "./bounty.sol";
contract Sample1BugBounty is BugBounty {
    function Sample1BugBounty() BugBounty("URL", "https://quiet-wave-20429.herokuapp.com/login", "flag(YouGotBoostPower)") {
    }
}
