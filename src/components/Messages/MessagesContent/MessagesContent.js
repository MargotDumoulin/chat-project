import './MessagesContent.css';
import { Avatar } from '@material-ui/core';

const MessagesContent  = (props) => {
    
    const renderAvatar = (position) => {
        if (position == 1 && !props.message.isMine) {
            return <Avatar className="speech-bubble-avatar not-mine" src={props.message.picture} alt="profile" />
        } else if (position == 2 && props.message.isMine) {
            return <Avatar className="speech-bubble-avatar mine" src={props.message.picture} alt="profile" />
        }
    }
    
    return (
        <div> 
            <p className={`speech-bubble-info ${props.message.isMine === true ? "mine" : "not-mine"}`}>{props.message.time} - {props.message.author}</p>
            <div className="speech-bubble-container">
                {renderAvatar(1)}
                    <p className={
                        `speech-bubble 
                        ${props.message.isMine === true ? "mine" : "not-mine"} 
                        ${props.message.room === "general" ? "general" : "not-general"}`
                    }>
                        {props.message.content}
                    </p> 
                {renderAvatar(2)}
            </div>
        </div>
        
    )
}

export default MessagesContent;