import { NavLink } from "react-router-dom";
import '../App'

const Navigation =({web3Handler,account})=>{
    return(
          <nav>
            <div className="logo">
                {/* <i class="fa-solid fa-house"></i> */}
                <h1>BLF</h1>
            </div>

            <div className="nav-elements">
                <NavLink to="/"> Home</NavLink>
                <NavLink to='/Property'>Property</NavLink>
                <NavLink to='/Myproperty'>Myproperty</NavLink>
                {/* <NavLink to='/Listings'>Listings</NavLink> */}
                {/* <NavLink to='/About'>About</NavLink> */}


            </div>

            <div className="nav-btn">
                 {(account)?(<button>{
                        account.slice(0,4)}...{account.slice(12,16)}
                    </button>):<button onClick={web3Handler}>Connect</button>

                 }
            </div>
            


            </nav>


      
    )
}

export default Navigation;