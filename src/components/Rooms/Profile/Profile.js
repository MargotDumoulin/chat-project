import React from 'react';
import Name from '../Name/Name';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import './Profile.css';

// shows person's name and ProfilePicture
const Profile = (props) => {
    return (
        <div className="profile">
            <div>
                <ProfilePicture picture={props.picture} />
            </div>
            <div className="naming">
                <Name firstname={props.firstname} lastname={props.lastname} />
            </div>
        </div>
    )
}

export default Profile;