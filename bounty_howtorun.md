How I'm testing this

`testrpc

this starts the test blockchain


delete the build folder

`truffle compile`

`truffle deploy`

Go to Oraclize's ethereum-bridge and start

`node bridge.js`

Now startup an interactive console:

`truffle console`

Now send money to the bounty, get price required to submit a claim, submit the claim.


```
> var bb = Sample1BugBounty.at(Sample1BugBounty.address);
> bb.sendTransaction({value: web3.toWei(5, "ether")});
> bb.priceForInvokingClaimBounty.call().then(function(a) {this.priceClaim = a;});
> bb.claimBounty.sendTransaction("{'1':1}", {value: priceClaim});
```

Look at the Oraclize local server and see the result of the http request.
