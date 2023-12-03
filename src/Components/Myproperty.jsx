import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Myproperty=({escrow,realEstate,account})=>{
    const [myitm,setmyitm]=useState([])
    const [sellprice,setSellprice]=useState(0)
    const [loading,setLoading]=useState(true)
    const [price,setPrice]=useState('');

    const loaditems=async ()=>{
        let myitm=[]
        for(var i=1;i<=9;++i){  
            let itm=await escrow.items(i)
            let acc=itm.owner.toLowerCase()
            console.log(itm.owner)
            

              
            
            if (acc=== account){
                let uri= await realEstate.tokenURI(itm.itemId);
                let response= await fetch(uri);
                let metadata =await response.json();
                myitm.push({
                    itemId:itm.itemId,
                    name:metadata.name,
                    image:metadata.image,
                    description:metadata.description,
                    address:metadata.address

                })


            }
        }
              
        setmyitm(myitm)
        setLoading(false)
    }
    const sell= async (itm)=>{
        console.log("this is sell")
        await(await escrow.sellItem(itm.itemId,ethers.utils.parseEther(price.toString()))).wait();
        loaditems();
    }
    useEffect(()=>{
        loaditems();
    })

    return(<div>
        {
         (loading)?<div className="loading"></div>:       
          (myitm.length>0)?
           <div className="cards">
           {
               myitm.map((itm,idx)=>(
   
                 <div className="card"id={idx}  key={idx} >
                 <div className="image">
                    <img src={itm.image} alt="house"></img>
                 </div>
                 <div className="information">
                 <h2>{itm.name} </h2>
                 <p>{itm.description}</p>
                 <p>{itm.address}</p>
                 <input type='number'onChange={(e)=>{setPrice(e.target.value)}}></input><button onClick={()=>{
                    sell(itm)
                 }}>sell</button>
                 
                 </div>

                 </div>
                   
   
               ))
           }
               
           
           </div>
           :
           <div className="no-items" ><div>No Items Here</div> </div>
       }
       </div>
      )


}

export default Myproperty;