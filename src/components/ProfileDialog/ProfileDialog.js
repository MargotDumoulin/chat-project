import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField, Button, Avatar, IconButton, CircularProgress } from '@material-ui/core';
import imageCompression from 'browser-image-compression';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { useState } from 'react';
import './ProfileDialog.css';

const ProfileDialog = (props) => {

    const [name, setName] = useState(props.name);
    const [picture, setPicture] = useState(props.picture);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFileTooBig, setFileTooBig] = useState(false);
    const { onProfileConfirmed, open } = props;

    const onHandleConfirmed = () => {
        onProfileConfirmed(name, picture);
    };

    const onHandleChangeName = (value) => {
        setName(value);
    }

    const onHandleChangePicture = (value) => {
        setPicture(value);
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const blobToFile = (blob, fileName) => {
        blob.lastModifiedDate = new Date();
        blob.name = fileName;
        return blob;
    }

    const onHandleProfilePictureChange = async (event) => {
        const file = event.target.files[0];

        if (file.size > 850000) {
            setFileTooBig(true);
        } else {
            setFileTooBig(false);
            const options = {
                maxSizeMB: 0.01,
                maxWidthOrHeight: 300,
                useWebWorker: true
            }
    
            try {
                const lighterBlob = await imageCompression(file, options);
                const lighterFile = blobToFile(lighterBlob, file.name);
    
                setLoading(true);
                const base64 = await toBase64(lighterFile);
                setLoading(false);
    
                setPicture(base64);
                console.log(picture);
                setFileName(file.name);
            } catch (error) {
                console.log(error);
            }
        }        
    }

    return (
        <div>
             <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Setup your profile</DialogTitle>
                <DialogContent>
                    <div className="dialog-form-picture">
                        <Avatar className="dialog-form-picture-avatar" alt="Profile" src={picture ? picture : ""} />
                        <TextField
                            variant="outlined"
                            fullWidth
                            disabled
                            error={isFileTooBig}
                            helperText={isFileTooBig ? "Your image is too heavy." : ""}
                            autoFocus
                            value={fileName ? fileName : ""}
                            onChange={(event) => { onHandleChangePicture(event.target.value) }}
                            placeholder="Profile picture link..."
                            margin="dense"
                            id="picture"
                            required
                        />
                        <input
                            accept="image/*"
                            hidden
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={(event) => { onHandleProfilePictureChange(event) }}
                        />
                        <label htmlFor="contained-button-file" className="file-input-label-button">
                            <IconButton color={!isFileTooBig ? 'primary' : 'secondary'} aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </div>
                    <TextField
                        variant="outlined"
                        fullWidth
                        autoFocus
                        value={name}
                        onChange={(event) => { onHandleChangeName(event.target.value) }}
                        placeholder="Name..."
                        margin="dense"
                        id="name"
                        required
                    />
                </DialogContent>
                <DialogActions className="MuiDialogTitle-root">
                    <Button onClick={onHandleConfirmed} type="submit" variant="contained" color="primary" disabled={(loading || !name || !picture || name === "" || picture === "" || isFileTooBig)}>
                        Confirm
                    </Button>
                    {loading && <CircularProgress size={24} />}
                </DialogActions>
            </Dialog>
        </div>
        
    );
}

export default ProfileDialog;