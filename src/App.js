import './App.css';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import { useState } from 'react';
import EscrowAddress from './ContractData/Escrow--address.json'
import RealEstateAddress from'./ContractData/RealEstate--address.json'
import EscrowABI from './ContractData/Escrow.json'
import RealEstateABI from './ContractData/RealEstate.json'
import { ethers } from 'ethers';
import Navigation from'./Components/Navigation'
import Home from './Components/Home'
import Property from './Components/Property'
import Listings from './Components/Listings'
import Myproperty from './Components/Myproperty'
import About from './Components/About'


function App() {
  const [loading,setLoading]=useState(true)
  const [account,setAccount]=useState(null)
  const [escrow,setEscrow]=useState()
  const [realestate,setrealEstate]=useState()
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });


    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      web3Handler();
    });
    loadcontract(signer);
    setLoading(false)

  };

  const loadcontract= async(signer)=>{
    // let abi1=RealEstateABI.abi
    const realEstate=new ethers.Contract(RealEstateAddress.address,RealEstateABI.abi,signer)  
    setrealEstate(realEstate)

    // let abi2 =EscrowABI.abi

    const escrow= new ethers.Contract(EscrowAddress.address,EscrowABI.abi,signer)
    setEscrow(escrow)

    
    setLoading(false)


  }
  return (
    <BrowserRouter>
   
    <div className='App'>
      <>
     <Navigation web3Handler={web3Handler} account={account} />

      </> 

     {loading?(
      <div className='awaiting' >
        
          <h1>Awaiting Metamask Connection</h1>  
        
      </div>
     ):(
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/Property' element={<Property escrow={escrow} realEstate={realestate} />}/>
        <Route path='/Myproperty' element={<Myproperty escrow={escrow} realEstate={realestate} account={account}/>} />
        <Route path ='/Listings' element={<Listings escrow={escrow} realEstate={realestate}/>} />
        <Route path='/About' element={<About />} />
      </Routes>
     )

     }
     <footer>
      <p>Author: Shivanant Deo Bhagat</p>
      
      <i class="fa-brands fa-github"></i>
      <i class="fa-brands fa-linkedin"></i>
      <i class="fa-brands fa-google"></i>
      
      <a href="mailto:shivanantbhagat7@gmail.com">shivanantbhagat7@gmail.com</a>
    </footer>
    </div>
   
    
    </BrowserRouter>
    
  );
}

export default App;
