import Verify from '../components/Verify'

export default props => (
    <div>
        <Verify verifyToken={props.query.verifyToken}/>
    </div>
)