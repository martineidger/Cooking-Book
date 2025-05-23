// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Switch from '@mui/material/Switch';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Divider from '@mui/material/Divider';
// import { deleteUserCollection, updateCollection, updateExistingCollection } from '../store/slices/collectionsSlice';

// const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '90%',
//     maxWidth: 600,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 2,
// };

// const EditCollectionModal = ({
//     collectionId,
//     open,
//     onClose,
//     onSaveSuccess // callback после успешного сохранения
// }) => {
//     const dispatch = useDispatch();
//     const collections = useSelector(state => state.collections.collections);

//     const collection = collections.find(c => c.id === collectionId);

//     const [name, setName] = useState('');
//     const [isPublic, setIsPublic] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//     useEffect(() => {
//         if (collection) {
//             setName(collection.name);
//             setIsPublic(collection.isPublic);
//         }
//     }, [collection]);

//     const handleSave = () => {
//         if (!collection || !name.trim()) return;


//         const updateDto = {
//             ...collection,
//             name,
//             isPublic,
//         }
//         console.log("MODAL", collectionId, updateDto)
//         dispatch(updateExistingCollection({ id: collectionId, updateCollectionDto: updateDto }));

//         if (onSaveSuccess) {
//             onSaveSuccess();
//         }
//         onClose();
//     };

//     if (!collection) {
//         return (
//             <Modal open={open} onClose={onClose}>
//                 <Box sx={modalStyle}>
//                     <Typography>Коллекция не найдена</Typography>
//                     <Button onClick={onClose} sx={{ mt: 2 }}>
//                         Закрыть
//                     </Button>
//                 </Box>
//             </Modal>
//         );
//     }

//     const onDeleteCollection = () => {
//         dispatch(deleteUserCollection({ collectionId: collectionId }))
//             .then(() => {
//                 onClose()
//             });
//         setIsDeleteModalOpen(false);
//     }

//     return (
//         <>

//             <Modal
//                 isOpen={isDeleteModalOpen}
//                 onRequestClose={() => setIsDeleteModalOpen(false)}
//                 className="modal"
//                 overlayClassName="modal-overlay"
//             >
//                 <h2>Подтверждение удаления</h2>
//                 <p>Вы уверены, что хотите удалить коллекцию?</p>
//                 <div className="modal-buttons">
//                     <button onClick={onDeleteCollection} className="button-danger">
//                         Удалить
//                     </button>
//                     <button onClick={() => setIsDeleteModalOpen(false)} className="button-secondary">
//                         Отмена
//                     </button>
//                 </div>
//             </Modal>
//             <Modal open={open} onClose={onClose}>
//                 <Box sx={modalStyle}>
//                     <Box sx={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         mb: 2
//                     }}>
//                         <Typography variant="h5">Редактировать коллекцию</Typography>
//                         <IconButton onClick={onClose}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>

//                     <Divider sx={{ mb: 3 }} />

//                     <TextField
//                         fullWidth
//                         label="Название коллекции"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         sx={{ mb: 3 }}
//                     />

//                     <FormControlLabel
//                         control={
//                             <Switch
//                                 checked={isPublic}
//                                 onChange={(e) => setIsPublic(e.target.checked)}
//                             />
//                         }
//                         label="Публичная коллекция"
//                         sx={{ mb: 3 }}
//                     />

//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//                         <Button
//                             variant="outlined"
//                             onClick={() => setIsDeleteModalOpen(true)}
//                             color='error'
//                         >
//                             Удалить коллекцию
//                         </Button>
//                         <Button
//                             variant="outlined"
//                             onClick={onClose}
//                         >
//                             Отмена
//                         </Button>
//                         <Button
//                             variant="contained"
//                             onClick={handleSave}
//                             disabled={!name.trim()}
//                         >
//                             Сохранить
//                         </Button>
//                     </Box>
//                 </Box>
//             </Modal>
//         </>
//     );
// };

// export default EditCollectionModal;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    IconButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { deleteUserCollection, updateExistingCollection } from '../store/slices/collectionsSlice';
import { useNavigate } from 'react-router-dom';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const EditCollectionModal = ({
    collectionId,
    open,
    onClose,
    onSaveSuccess
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const collections = useSelector(state => state.collections.collections);
    const collection = collections.find(c => c.id === collectionId);

    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        if (collection) {
            setName(collection.name);
            setIsPublic(collection.isPublic);
        }
    }, [collection]);

    const handleSave = () => {
        if (!collection || !name.trim()) return;

        const updateDto = {
            ...collection,
            name: name.trim(),
            isPublic,
        };

        dispatch(updateExistingCollection({
            id: collectionId,
            updateCollectionDto: updateDto
        }))
            .unwrap()
            .then(() => {
                if (onSaveSuccess) onSaveSuccess();
                onClose();
            })
            .catch(error => {
                console.error('Ошибка при обновлении коллекции:', error);
            });
    };

    const handleDelete = () => {
        console.log(collectionId)
        dispatch(deleteUserCollection(collectionId))
            .unwrap()
            .then(() => {
                onClose();
                setDeleteConfirmOpen(false);
                navigate('/collections')
            })
            .catch(error => {
                console.error('Ошибка при удалении коллекции:', error);
            });
    };

    if (!collection) {
        return (
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <Typography>Коллекция не найдена</Typography>
                    <Button onClick={onClose} sx={{ mt: 2 }}>
                        Закрыть
                    </Button>
                </Box>
            </Modal>
        );
    }

    return (
        <>
            {/* Основное модальное окно редактирования */}
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="h5">Редактировать коллекцию</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <TextField
                        fullWidth
                        label="Название коллекции"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                        }
                        label="Публичная коллекция"
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setDeleteConfirmOpen(true)}
                            color="error"
                        >
                            Удалить коллекцию
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={!name.trim()}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography>Вы уверены, что хотите удалить коллекцию "{collection.name}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditCollectionModal;