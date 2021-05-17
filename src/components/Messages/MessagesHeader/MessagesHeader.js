import './MessagesHeader.css';
import Profile from '../../Rooms/Profile/Profile';

const MessagesHeader  = (props) => {

    return (
        <div className="header">
            <div className="profile-header">
                <Profile 
                    firstname={props.user.firstname} 
                    lastname={props.user.lastname} 
                    picture={props.user.picture}
                />
            </div>
            <hr className="horizontal-line-header"></hr>
        </div>
        
    )
}

export default MessagesHeader;