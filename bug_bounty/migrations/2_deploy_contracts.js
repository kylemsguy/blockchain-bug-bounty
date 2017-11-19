var ContractObject = artifacts.require('./BugBounty');

module.exports = function(deployer) {
  deployer.deploy(ContractObject);
};
