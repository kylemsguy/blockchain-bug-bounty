var ContractObject = artifacts.require('./Sample1BugBounty');

module.exports = function(deployer) {
  deployer.deploy(ContractObject);
};
