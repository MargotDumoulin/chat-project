import './NoSelectedRoom.css';
import MeetingImage from '../../../assets/undraw_meeting.svg';

const NoSelectedRoom  = () => {

    return (
        <div className="no-room-image-container">
            <img className="no-room-image" src={MeetingImage} alt="meeting" /> 
            <h2>No room selected... Start <span style={{color: '#7b2689' }}>chatting</span> now !</h2>
        </div>
    )
}

export default NoSelectedRoom;