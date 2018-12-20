import UpdateItem from '../components/UpdateItem'
import User from '../components/User'

const Update = ({ query }) => (
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
            else if(!data.data.currentUser.permissions.includes("ITEMUPDATE")){
                return <p>You don't have permission to update items right now.</p>
            }
            return <UpdateItem id={query.id}/>
            }}
        </User>
    </div>
)

export default Update;