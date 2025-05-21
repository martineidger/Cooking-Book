import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRecipe, fetchCategories, fetchCuisines } from '../store/slices/recipesSlice';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Chip,
    Divider,
    IconButton,
    Autocomplete,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { fetchIngredients, fetchIngredientUnits } from '../store/slices/ingredientsSlice';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DraggableStep from './DraggableStep';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflowY: 'auto'
};
const ItemTypes = {
    STEP: 'step',
};

// const DraggableStep = ({
//     step,
//     index,
//     moveStep,
//     handleRemoveStep,
//     handleRemoveStepImage,
//     handleStepImageUpload,
//     stepImagePreviews,
// }) => {
//     const ref = useRef(null);

//     const [{ handlerId }, drop] = useDrop({
//         accept: ItemTypes.STEP,
//         collect(monitor) {
//             return {
//                 handlerId: monitor.getHandlerId(),
//             };
//         },
//         hover(item, monitor) {
//             if (!ref.current) return;
//             const dragIndex = item.index;
//             const hoverIndex = index;

//             if (dragIndex === hoverIndex) return;

//             const hoverBoundingRect = ref.current?.getBoundingClientRect();
//             const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//             const clientOffset = monitor.getClientOffset();
//             const hoverClientY = clientOffset.y - hoverBoundingRect.top;

//             if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
//             if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

//             moveStep(dragIndex, hoverIndex);
//             item.index = hoverIndex;
//         },
//     });

//     const [{ isDragging }, drag] = useDrag({
//         type: ItemTypes.STEP,
//         item: () => ({ id: step.id, index }),
//         collect: (monitor) => ({
//             isDragging: monitor.isDragging(),
//         }),
//     });

//     drag(drop(ref));

//     return (
//         <div
//             ref={ref}
//             style={{ opacity: isDragging ? 0.5 : 1 }}
//             data-handler-id={handlerId}
//         >
//             <Box
//                 sx={{
//                     mb: 2,
//                     p: 2,
//                     border: '1px solid #eee',
//                     borderRadius: 1,
//                     backgroundColor: 'background.paper',
//                 }}
//             >
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="subtitle1">
//                         Шаг {step.order}: {step.title}
//                         {step.id && (
//                             <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//                                 (ID: {step.id})
//                             </Typography>
//                         )}
//                     </Typography>
//                     <Box>
//                         <IconButton sx={{ cursor: 'grab', mr: 1 }} size="small">
//                             <DragIndicatorIcon />
//                         </IconButton>
//                         <IconButton
//                             onClick={() => handleRemoveStep(index)}
//                             size="small"
//                         >
//                             <RemoveIcon color="error" fontSize="small" />
//                         </IconButton>
//                     </Box>
//                 </Box>
//                 <Typography variant="body2" sx={{ mb: 1 }}>
//                     {step.description}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                     Время: {step.durationMin} мин
//                 </Typography>

//                 {stepImagePreviews[index] ? (
//                     <Box sx={{ mt: 2, position: 'relative', width: '100%', maxWidth: 400 }}>
//                         <img
//                             src={stepImagePreviews[index]}
//                             alt={`Шаг ${step.order}`}
//                             style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 1 }}
//                         />
//                         <IconButton
//                             onClick={() => handleRemoveStepImage(index)}
//                             sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
//                         >
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>
//                 ) : (<></>
//                     // <Button
//                     //     component="label"
//                     //     variant="outlined"
//                     //     startIcon={<CloudUploadIcon />}
//                     //     sx={{ mt: 2 }}
//                     // >
//                     //     Добавить фото к шагу
//                     //     <VisuallyHiddenInput
//                     //         type="file"
//                     //         accept="image/*"
//                     //         onChange={(e) => handleStepImageUpload(e, index)}
//                     //     />
//                     // </Button>
//                 )}
//             </Box>
//         </div>
//     );
// };

export const CreateRecipeModal = ({ open, onClose }) => {
    //const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');

    const { ingredients, units } = useSelector(state => state.ingredients);
    const { categories, cuisines } = useSelector(state => state.recipes);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        portions: 1,
        cuisineId: '',
        categories: [],
        ingredients: [],
        steps: [],
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [currentStep, setCurrentStep] = useState({
        title: '',
        description: '',
        durationMin: 0,
        order: 1,
        image: null
    });
    const [stepImagePreviews, setStepImagePreviews] = useState({});

    const [currentIngredient, setCurrentIngredient] = useState({
        ingredientId: '',
        quantity: 1,
        ingredientUnitId: ''
    });

    const [initialLoad, setInitialLoad] = useState(false);

    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [ingredientInputValue, setIngredientInputValue] = useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setError(null);
    };


    useEffect(() => {
        try {
            if (open && !initialLoad) {
                const loadData = async () => {
                    await dispatch(fetchIngredients());
                    await dispatch(fetchIngredientUnits());
                    await dispatch(fetchCategories());
                    await dispatch(fetchCuisines());
                    setInitialLoad(true);
                };
                loadData();
            }

            return () => {
                if (!open) {
                    setInitialLoad(false);
                }
            };
        }
        catch (error) {
            setError(error.message || 'Произошла ошибка при загрузке данных');
            setOpenSnackbar(true);
        }

    }, [open, initialLoad, dispatch]);
    const resetForm = useCallback(() => {
        setFormData({
            title: '',
            description: '',
            portions: 1,
            cuisineId: '',
            categories: [],
            ingredients: [],
            steps: [],
            image: null
        });
        setImagePreview(null);
        setCurrentStep({
            title: '',
            description: '',
            durationMin: 0,
            order: 1,
            image: null
        });
        setStepImagePreviews({});
        setCurrentIngredient({
            ingredientId: '',
            quantity: 1,
            ingredientUnitId: ''
        });
        setIngredientInputValue('');
    }, []);

    const moveStep = useCallback((dragIndex, hoverIndex) => {
        setFormData(prev => {
            const newSteps = [...prev.steps];
            const [removed] = newSteps.splice(dragIndex, 1);
            newSteps.splice(hoverIndex, 0, removed);

            // Обновляем порядок всех шагов
            const updatedSteps = newSteps.map((step, index) => ({
                ...step,
                order: index + 1
            }));

            return {
                ...prev,
                steps: updatedSteps,
            };
        });
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'portions' ? parseInt(value) || 1 : value
        }));
    };

    const handleAddIngredient = () => {
        const ingredientExists = formData.ingredients.some(
            ing => ing.ingredientId === currentIngredient.ingredientId
        );

        if (ingredientExists) {
            setError('Такой ингредиент уже добавлен');
            setOpenSnackbar(true);
            return;
        }
        if (!currentIngredient.ingredientId || !currentIngredient.ingredientUnitId) return;

        setFormData(prev => ({
            ...prev,
            ingredients: [
                ...prev.ingredients,
                {
                    ingredientId: currentIngredient.ingredientId,
                    quantity: currentIngredient.quantity,
                    ingredientUnitId: currentIngredient.ingredientUnitId
                }
            ]
        }));

        setCurrentIngredient({
            ingredientId: '',
            quantity: 1,
            ingredientUnitId: ''
        });
    };

    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };


    const handleStepImageUpload = (e, stepIndex) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setStepImagePreviews(prev => ({
                ...prev,
                [stepIndex]: reader.result
            }));
        };
        reader.readAsDataURL(file);

        setFormData(prev => {
            const newSteps = [...prev.steps];
            newSteps[stepIndex] = {
                ...newSteps[stepIndex],
                image: file // Сохраняем весь файл, а не только имя
            };
            return { ...prev, steps: newSteps };
        });
    };

    const handleRemoveStepImage = (stepIndex) => {
        setStepImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[stepIndex];
            return newPreviews;
        });

        setFormData(prev => {
            const newSteps = [...prev.steps];
            newSteps[stepIndex] = {
                ...newSteps[stepIndex],
                image: null
            };
            return { ...prev, steps: newSteps };
        });
    };
    //     setStepImagePreviews(prev => {
    //         const newPreviews = { ...prev };
    //         delete newPreviews[stepIndex];
    //         return newPreviews;
    //     });

    //     setFormData(prev => {
    //         const newSteps = [...prev.steps];
    //         newSteps[stepIndex] = {
    //             ...newSteps[stepIndex],
    //             photo: newSteps[stepIndex]?.photo?.publicId
    //                 ? { publicId: newSteps[stepIndex].photo.publicId }
    //                 : null
    //         };
    //         return { ...prev, steps: newSteps };
    //     });
    // };

    const handleAddStep = () => {
        if (!currentStep.title) return;

        setFormData(prev => ({
            ...prev,
            steps: [
                ...prev.steps,
                {
                    ...currentStep,
                    order: prev.steps.length + 1
                }
            ]
        }));

        setCurrentStep({
            title: '',
            description: '',
            durationMin: 0,
            order: formData.steps.length + 2,
            image: null
        });
    };

    const handleRemoveStep = (index) => {
        setStepImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[index];
            return newPreviews;
        });

        setFormData(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
                .map((step, i) => ({ ...step, order: i + 1 }))
        }));
    };

    const handleCategoryToggle = (categoryId) => {
        setFormData(prev => {
            const exists = prev.categories.some(c => c.categoryId === categoryId);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter(c => c.categoryId !== categoryId)
                    : [...prev.categories, { categoryId }]
            };
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setFormData(prev => ({ ...prev, image: file }));
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData(); // Переименовываем переменную

            // Добавляем основные поля из formData (состояния)
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('portions', formData.portions.toString());
            formDataToSend.append('userId', userId);
            if (formData.cuisineId) formDataToSend.append('cuisineId', formData.cuisineId);

            // Добавляем категории
            formData.categories.forEach((cat, index) => {
                formDataToSend.append(`categories[${index}][categoryId]`, cat.categoryId);
            });

            // Добавляем ингредиенты
            formData.ingredients.forEach((ingr, index) => {
                formDataToSend.append(`ingredients[${index}][ingredientId]`, ingr.ingredientId);
                formDataToSend.append(`ingredients[${index}][quantity]`, ingr.quantity.toString());
                formDataToSend.append(`ingredients[${index}][ingredientUnitId]`, ingr.ingredientUnitId);
            });

            // Добавляем шаги
            formData.steps.forEach((step, index) => {
                formDataToSend.append(`steps[${index}][title]`, step.title);
                formDataToSend.append(`steps[${index}][description]`, step.description);
                formDataToSend.append(`steps[${index}][order]`, step.order.toString());
                if (step.durationMin) formDataToSend.append(`steps[${index}][durationMin]`, step.durationMin.toString());
                if (step.image) formDataToSend.append(`steps[${index}][photo]`, step.image);
            });

            // Добавляем главное фото
            if (formData.image) {
                formDataToSend.append('mainPhoto', formData.image);
            }

            console.log('FormData содержимое:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }
            await dispatch(createRecipe(formDataToSend)).unwrap();
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error creating recipe:', error);
            setError(error.message || 'Произошла ошибка при загрузке данных');
            setOpenSnackbar(true);
        }
    };



    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    onClose={handleCloseSnackbar}
                    sx={{ width: '100%' }}
                >
                    {error || 'Произошла ошибка'}
                </Alert>
            </Snackbar>

            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">Добавить новый рецепт</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Фото рецепта</Typography>
                        {imagePreview ? (
                            <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 1 }}
                                />
                                <IconButton
                                    onClick={handleRemoveImage}
                                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                                sx={{ py: 2 }}
                            >
                                Загрузить фото
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Рекомендуемый размер: 1200x800px, форматы: JPG, PNG
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        label="Название рецепта"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        sx={{ mb: 3 }}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Описание"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Количество порций"
                        name="portions"
                        type="number"
                        value={formData.portions}
                        onChange={handleInputChange}
                        sx={{ mb: 3, width: 150 }}
                        InputProps={{ inputProps: { min: 1 } }}
                        required
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Кухня</InputLabel>
                        <Select
                            value={formData.cuisineId}
                            onChange={(e) => setFormData(prev => ({ ...prev, cuisineId: e.target.value }))}
                            label="Кухня"
                        >
                            {cuisines.map(cuisine => (
                                <MenuItem key={cuisine.id} value={cuisine.id}>
                                    {cuisine.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="h6" sx={{ mb: 2 }}>Категории</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {categories.map(category => (
                            <Chip
                                key={category.id}
                                label={category.name}
                                clickable
                                color={formData.categories.some(c => c.categoryId === category.id) ? 'primary' : 'default'}
                                onClick={() => handleCategoryToggle(category.id)}
                            />
                        ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* <Typography variant="h6" sx={{ mb: 2 }}>Ингредиенты</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <FormControl sx={{ flex: 2 }}>
                            <InputLabel>Ингредиент</InputLabel>
                            <Select
                                value={currentIngredient.ingredientId}
                                onChange={(e) => setCurrentIngredient(prev => ({ ...prev, ingredientId: e.target.value }))}
                                label="Ингредиент"
                            >
                                {ingredients.map(ingredient => (
                                    <MenuItem key={ingredient.id} value={ingredient.id}>
                                        {ingredient.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                    <Typography variant="h6" sx={{ mb: 2 }}>Ингредиенты</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Autocomplete
                            sx={{ flex: 2 }}
                            options={ingredients}
                            getOptionLabel={(option) => option.name}
                            value={ingredients.find(ing => ing.id === currentIngredient.ingredientId) || null}
                            onChange={(event, newValue) => {
                                setCurrentIngredient(prev => ({
                                    ...prev,
                                    ingredientId: newValue?.id || ''
                                }));
                            }}
                            inputValue={ingredientInputValue}
                            onInputChange={(event, newInputValue) => {
                                setIngredientInputValue(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Ингредиент"
                                    placeholder="Начните вводить название"
                                />
                            )}
                            noOptionsText="Ничего не найдено"
                            filterOptions={(options, state) => {
                                const input = state.inputValue.toLowerCase();
                                return options.filter(option =>
                                    option.name.toLowerCase().includes(input)
                                );
                            }}
                        />

                        <TextField
                            sx={{ flex: 1 }}
                            label="Количество"
                            type="number"
                            value={currentIngredient.quantity}
                            onChange={(e) => setCurrentIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))}
                            InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
                        />

                        <FormControl sx={{ flex: 2 }}>
                            <InputLabel>Единица измерения</InputLabel>
                            <Select
                                value={currentIngredient.ingredientUnitId}
                                onChange={(e) => setCurrentIngredient(prev => ({ ...prev, ingredientUnitId: e.target.value }))}
                                label="Единица измерения"
                            >
                                {units.map(unit => (
                                    <MenuItem key={unit.id} value={unit.id}>
                                        {unit.name} ({unit.shortName})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleAddIngredient}
                            disabled={!currentIngredient.ingredientId || !currentIngredient.ingredientUnitId}
                            startIcon={<AddIcon />}
                        >
                            Добавить
                        </Button>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        {formData.ingredients.map((ingredient, index) => {
                            const ingr = ingredients.find(i => i.id === ingredient.ingredientId);
                            const unit = units.find(u => u.id === ingredient.ingredientUnitId);

                            return (
                                <Box key={index} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 1,
                                    borderBottom: '1px solid #eee'
                                }}>
                                    <Typography sx={{ flex: 2 }}>
                                        {ingr?.name || 'Неизвестный ингредиент'}
                                    </Typography>
                                    <Typography sx={{ flex: 1 }}>
                                        {ingredient.quantity}
                                    </Typography>
                                    <Typography sx={{ flex: 2 }}>
                                        {unit?.shortName || 'Неизвестная единица'}
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveIngredient(index)}>
                                        <RemoveIcon color="error" />
                                    </IconButton>
                                </Box>
                            );
                        })}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>Шаги приготовления</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Название шага"
                            value={currentStep.title}
                            onChange={(e) => setCurrentStep(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <TextField
                            fullWidth
                            label="Описание шага"
                            value={currentStep.description}
                            onChange={(e) => setCurrentStep(prev => ({ ...prev, description: e.target.value }))}
                            multiline
                            rows={3}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Время (мин)"
                                type="number"
                                value={currentStep.durationMin}
                                onChange={(e) => setCurrentStep(prev => ({
                                    ...prev,
                                    durationMin: parseInt(e.target.value) || 0
                                }))}
                                sx={{ width: 150 }}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddStep}
                                disabled={!currentStep.title}
                                startIcon={<AddIcon />}
                            >
                                Добавить шаг
                            </Button>
                        </Box>
                    </Box>

                    {/* <Box sx={{ mb: 3 }}>
                        {formData.steps.map((step, index) => (
                            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle1">
                                        Шаг {step.order}: {step.title}
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveStep(index)} size="small">
                                        <RemoveIcon color="error" fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {step.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Время: {step.durationMin} мин
                                </Typography>

                                {stepImagePreviews[index] ? (
                                    <Box sx={{ mt: 2, position: 'relative', width: '100%', maxWidth: 400 }}>
                                        <img
                                            src={stepImagePreviews[index]}
                                            alt={`Шаг ${step.order}`}
                                            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 1 }}
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveStepImage(index)}
                                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mt: 2 }}
                                    >
                                        Добавить фото к шагу
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleStepImageUpload(e, index)}
                                        />
                                    </Button>
                                )}
                            </Box>
                        ))}
                    </Box> */}
                    <Box sx={{ mb: 3 }}>
                        <DndProvider backend={HTML5Backend}>
                            {formData.steps.map((step, index) => (
                                <DraggableStep
                                    key={step.id || `new-step-${index}`}
                                    index={index}
                                    step={step}
                                    moveStep={moveStep}
                                    handleRemoveStep={handleRemoveStep}
                                    handleRemoveStepImage={handleRemoveStepImage}
                                    handleStepImageUpload={handleStepImageUpload}
                                    stepImagePreviews={stepImagePreviews}
                                />
                            ))}
                        </DndProvider>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => {
                            resetForm();
                            onClose()
                        }}>
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}

                            disabled={!formData.title || !formData.ingredients.length || !formData.steps.length}
                        >
                            Создать рецепт
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>

    );
};

export default CreateRecipeModal;

