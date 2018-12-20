import { renderToStringWithData } from "react-apollo";
import CreateItem from '../components/CreateItem'
import Link from 'next/link'

import User from '../components/User'

const Sell = props => (
    <div>
        <User>
        {(data)=> {
            if(!data.data.currentUser){
                return <div>
                    You must be logged in to do this.
                    <Link href="/signup">
                        <a>Login or Sign Up</a>
                    </Link>
                </div>
            }
            else if(!data.data.currentUser.permissions.includes("ITEMCREATE")){
                return <p>You don't have permission to sell items right now.  You may need to create a vendor account.</p>
            }
            return <CreateItem/>
        }}
        </User>
    </div>
)

export default Sell;