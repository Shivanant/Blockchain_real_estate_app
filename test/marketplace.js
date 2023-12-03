const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const token = (n)=>{
    return ethers.parseUnits(n.toString(), 'ether');
}
const fromWei=(num)=>ethers.formatEther(num);
describe("marketplace",()=>{
    let inspector,acc1,acc2,acc3,realEstate,escrow;
    let uri="sometext"
    beforeEach(async () => {
        [inspector, acc1, acc2, acc3] = await ethers.getSigners();
        const RealEstate=await ethers.getContractFactory("RealEstate",inspector)

        realEstate=await RealEstate.deploy();
        // console.log(await realEstate.getAddress())

        const Escrow= await ethers.getContractFactory("Escrow",inspector)
        escrow=await Escrow.deploy(await realEstate.getAddress(),inspector.address);

    
    })
    
    describe('Deployment',async()=>{
        it("describes nft contract details",async()=>{
            expect(await realEstate.name()).to.be.equal("RealEstate")
            expect(await realEstate.symbol()).to.be.equal("RE")
        })
        it("Describes Escrow details",async()=>{
            expect(await escrow.inspector()).to.be.equal(inspector.address)
        })

    })
    describe('Minting of NFT ',async()=>{
        beforeEach(async()=>{
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(acc2).mint(uri);


        })
        it("Mints the nft",async()=>{

            //token cnt increase;
            expect(await realEstate.tokenCount()).to.be.equal(2);

        })
        it("checks owner",async()=>{
            expect(await realEstate.ownerOf(1)).to.be.equal(inspector.address)
            expect(await realEstate.ownerOf(2)).to.be.equal(acc2.address)
        })

    })
    describe("Making of marketplace item",async()=>{
        beforeEach(async()=>{
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).setApprovalForAll(await escrow.getAddress(),true);
            await escrow.connect(inspector).makeItem(1,token(1))
            await escrow.connect(inspector).makeItem(2,token(1))


        })
        it("It transfer nft from owner to marketplace ",async()=>{   
            let item = await escrow.items(1);
            expect(item.owner).to.be.equal(await escrow.getAddress())
            expect(item.price).to.be.equal(token(1))
            expect(item.sold).to.be.equal(false)
            expect(item.itemId).to.be.equal(1)

        })


    })
    describe("Purchase Items ",async()=>{
        let beforetx,aftertx;
        beforeEach(async()=>{
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).setApprovalForAll(await escrow.getAddress(),true);
            await escrow.connect(inspector).makeItem(1,token(1))
            await escrow.connect(inspector).makeItem(2,token(1))
            beforetx=await escrow.balance(inspector);
            // console.log(beforetx)
            // console.log(+fromWei(beforetx))
            // console.log(+fromWei(await escrow.balance(acc1)))
            await escrow.connect(acc1).purchaseItem(1,{value:token(1)})
            // console.log(+fromWei(await escrow.balance(acc1)))

            // console.log(+fromWei(aftertx))


            // console.log(+fromWei(token(1)))

        })
        it('it changes ownership from marketplace to buyer',async()=>{
            const item=await escrow.items(1);
            expect(item.owner).to.be.equal(acc1.address)
            expect(await realEstate.ownerOf(1)).to.be.equal(acc1.address)
            
        })
        it("Sends money to the makers accounts",async()=>{
            aftertx=await escrow.balance(inspector);

            expect(+fromWei(beforetx) + +fromWei(token(1)) ).to.be.equal(+fromWei(aftertx))
            
        })
    })
    describe("Selling a property",async()=>{
        beforeEach(async()=>{
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).setApprovalForAll(await escrow.getAddress(),true);
            await escrow.connect(inspector).makeItem(1,token(1))
            await escrow.connect(inspector).makeItem(2,token(1))

            await escrow.connect(acc1).purchaseItem(1,{value:token(1)})
            await realEstate.connect(acc1).setApprovalForAll(await escrow.getAddress(),true);

            await escrow.connect(acc1).sellItem(1,token(2))
        })
        it('sells item',async()=>{
            const item =await escrow.items(1)
            expect(item.sold).to.be.equal(false)
        })
    })
    describe("Buying a second hand property",async()=>{
        let s_b_b,s_b_a,b_b_b,b_b_a;
        beforeEach(async()=>{
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).mint(uri);
            await realEstate.connect(inspector).setApprovalForAll(await escrow.getAddress(),true);
            await escrow.connect(inspector).makeItem(1,token(1))
            await escrow.connect(inspector).makeItem(2,token(1))
            await escrow.connect(acc1).purchaseItem(1,{value:token(1)})
            await realEstate.connect(acc1).setApprovalForAll(await escrow.getAddress(),true);
            await escrow.connect(acc1).sellItem(1,token(2))
            s_b_b=await escrow.balance(acc1)
            console.log(+fromWei(s_b_b))
            await escrow.connect(acc2).purchaseItem(1,{value:token(2)})
            s_b_a=await escrow.balance(acc1)
            console.log(+fromWei(s_b_a))

        })
        it("Buys second hand property",async()=>{
            expect(await realEstate.ownerOf(1)).to.be.equal(acc2.address)
        })
        it ("It sends money to the seller", async()=>{
            expect(+fromWei(s_b_a)).to.be.equal(+fromWei(s_b_b)+ +fromWei(token(2)))
        })
    })
})