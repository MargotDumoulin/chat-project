import { Avatar } from "@material-ui/core";
import './ProfilePicture.css';
import React from 'react';

const ProfilePicture = (props) => {
    return (
        <Avatar className="profile-picture" src={props.picture} alt="profile" />
    )
}

export default ProfilePicture;