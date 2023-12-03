// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers, artifacts } = require("hardhat");
const token = (n)=>{
  return ethers.parseUnits(n.toString(), 'ether');
}
const fs=require('fs');
const { inspect } = require("util");

const Makefrontenddata=async(contract,contractName)=>{


  const contractDir=__dirname+"../../src/ContractData";
  if(!fs.existsSync(contractDir)){
    fs.mkdirSync(contractDir)
  }

  fs.writeFileSync(
    contractDir+`/${contractName}--address.json`,
    JSON.stringify({address:await contract.getAddress()})
  )
  const contractArtifact=artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractDir+`/${contractName}.json`,
    JSON.stringify(contractArtifact)
  );

}

async function main() {
       let inspector,acc1,acc2,acc3;
        [inspector, acc1, acc2, acc3] = await ethers.getSigners();
        const RealEstate=await ethers.getContractFactory("RealEstate",inspector)

        let realEstate=await RealEstate.deploy();
        console.log("real estate deployed at :",await realEstate.getAddress())


        const Escrow= await ethers.getContractFactory("Escrow",inspector)
        let escrow=await Escrow.deploy(await realEstate.getAddress(),inspector.address)
        let add=await escrow.getAddress()
        console.log("Escrw deployed at :",add)
        for( let i=0;i<9;++i){
          //delux
          let tx=await realEstate.connect(inspector).mint(`https://gray-massive-grasshopper-171.mypinata.cloud/ipfs/QmVu8dmuJkUXbh1rVsmVWptwns3UHkDeYs8NgDwV1dDYze/${i+1}.json`)
          await tx.wait();
        }

        console.log('MInting houses')
        console.log('setting approval for all');
        await realEstate.connect(inspector).setApprovalForAll(add,1);
        
        console.log('listing the houses');

        for (let i =1;i<10;++i){
          if(i<=3){
            let tx= await escrow.connect(inspector).makeItem(i,token(2))
            await tx.wait();
          }
          if(i>3 && i<7){
            let tx= await escrow.connect(inspector).makeItem(i,token(4))
            await tx.wait();
          }
          if(i > 6){
            let tx= await escrow.connect(inspector).makeItem(i,token(6))
            await tx.wait();
          }
        }

        console.log("Making frontend file")
      


        Makefrontenddata(escrow,"Escrow")
        Makefrontenddata(realEstate,"RealEstate")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
