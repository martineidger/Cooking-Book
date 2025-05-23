// import { useEffect, useState } from 'react';
// import { Modal, TextField, Button, Avatar, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useDispatch } from 'react-redux';
// import { updateUserProfile } from '../store/slices/profileSlice';


// const EditProfileModal = ({ open, onClose, user }) => {
//     const [username, setUsername] = useState(user.username);
//     const [bio, setBio] = useState(user.bio || '');
//     const [avatar, setAvatar] = useState(user.avatar || '');
//     const [isLoading, setIsLoading] = useState(false);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         setUsername(user?.username || '');
//         setBio(user?.bio || '');
//         setAvatar(user?.avatar || '');
//     }, [user]);

//     const handleFileChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setAvatar(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = async () => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             dispatch(updateUserProfile({ username, bio, avatar }));
//             onClose();
//         } catch (error) {
//             console.error('Ошибка при обновлении профиля:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };


//     return (
//         <Modal open={open} onClose={onClose}>
//             <div className="modal-container">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h2>Редактировать профиль</h2>
//                         <IconButton onClick={onClose}>
//                             <CloseIcon />
//                         </IconButton>
//                     </div>

//                     <form onSubmit={handleSubmit}>
//                         <div className="avatar-upload">
//                             <Avatar
//                                 src={avatar || undefined}
//                                 sx={{ width: 100, height: 100 }}
//                             >
//                                 {username.charAt(0).toUpperCase()}
//                             </Avatar>
//                             <input
//                                 accept="image/*"
//                                 id="avatar-upload"
//                                 type="file"
//                                 style={{ display: 'none' }}
//                                 onChange={handleFileChange}
//                             />
//                             <label htmlFor="avatar-upload">
//                                 <Button variant="outlined" component="span">
//                                     Изменить фото
//                                 </Button>
//                             </label>
//                         </div>

//                         <TextField
//                             label="Имя пользователя"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             fullWidth
//                             margin="normal"
//                             required
//                         />

//                         <TextField
//                             label="О себе"
//                             value={bio}
//                             onChange={(e) => setBio(e.target.value)}
//                             fullWidth
//                             margin="normal"
//                             multiline
//                             rows={4}
//                         />

//                         <div className="modal-actions">
//                             <Button onClick={onClose}>Отмена</Button>
//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 color="primary"
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? 'Сохранение...' : 'Сохранить'}
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default EditProfileModal;

import { useEffect, useState } from 'react';
import { Modal, TextField, Button, Avatar, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/slices/profileSlice';

const EditProfileModal = ({ open, onClose, user }) => {
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setUsername(user?.username || '');
        setBio(user?.bio || '');
        setAvatar(user?.avatar || '');
    }, [user]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {  // Добавлен параметр e
        e.preventDefault();  // Это предотвратит перезагрузку страницы
        if (!username.trim()) return;

        setIsLoading(true);
        try {
            await dispatch(updateUserProfile({
                username: username.trim(),
                bio: bio.trim(),
                avatar
            }));
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Редактировать профиль</h2>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* <div className="avatar-upload">
                            <Avatar
                                src={avatar || undefined}
                                sx={{ width: 100, height: 100 }}
                            >
                                {username.charAt(0).toUpperCase()}
                            </Avatar>
                            <input
                                accept="image/*"
                                id="avatar-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="avatar-upload">
                                <Button variant="outlined" component="span">
                                    Изменить фото
                                </Button>
                            </label>
                        </div> */}

                        <TextField
                            label="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />

                        {/* <TextField
                            label="О себе"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        /> */}

                        <div className="modal-actions">
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onClose();
                                }}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EditProfileModal;