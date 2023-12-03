import { useEffect,useState } from "react";
import { ethers} from "ethers";

const Property=({escrow,realEstate})=>{
    const [items,setItems]=useState([])
    const [loading,setLoading]=useState(true)

    const loadproperty=async ()=>{  
        let items=[]
        for (let i =1;i<=9;++i){
            let itm =await escrow.items(i);
            if (!itm.sold){
                let uri=await realEstate.tokenURI(i);
                let response= await fetch(uri);
                let metadata=await response.json();
                let totalPrice = itm.price;  
                let own=itm.owner           
                items.push({
                    totalPrice,
                    itemId:itm.itemId,
                    name:metadata.name,
                    image:metadata.image,
                    description:metadata.description,
                    address:metadata.address,
                    owner:own

                })
            }

        }
        setItems(items)
        setLoading(false)
    }
    const buyItem = async (itm) => {
        console.log("this isItem")
        console.log(itm);
  
        await(await escrow.purchaseItem(itm.itemId, {
          value: itm.totalPrice 
        })).wait();

        console.log("item Purchased")
  
        loadproperty();

    };
  
      useEffect(() => {
        loadproperty()
      });

      return(<div>
        {
         (loading)?<div className="loading"></div>:       
          (items.length>0)?
           <div className="cards">
           {
               items.map((itm,idx)=>(
   
                 <div className="card"id={idx}  key={idx} >
                 <div className="image">
                    <img src={itm.image} alt="house"></img>
                 </div>
                 <div className="information">
                 <h2>{itm.name} </h2>
                 <p>{itm.description}</p>
                 <p>{itm.address}</p>
                 <p>{itm.owner}</p>
                 
                 </div>
                 <button onClick={()=>{
                   buyItem(itm)
                 }}><i className="fa-brands fa-ethereum"></i>  {ethers.utils.formatEther(itm.totalPrice)}</button>
                 </div>
                   
   
               ))
           }
               
           
           </div>
           :
           <div className="no-items" ><h1>No Items Here</h1> </div>
       }
       </div>
      )
    

}


export default Property;