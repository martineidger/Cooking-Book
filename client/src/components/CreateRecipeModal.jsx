import React, { useState, useEffect } from 'react';
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
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { fetchIngredients, fetchIngredientUnits } from '../store/slices/ingredientsSlice';

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

export const CreateRecipeModal = ({ open, onClose }) => {
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

    useEffect(() => {
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
    }, [open, initialLoad, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'portions' ? parseInt(value) || 1 : value
        }));
    };

    const handleAddIngredient = () => {
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

            console.log("Submitting form data:", formDataToSend);
            await dispatch(createRecipe(formDataToSend)).unwrap();
            onClose();
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };
    return (
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

                <Typography variant="h6" sx={{ mb: 2 }}>Ингредиенты</Typography>
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
                    </FormControl>

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

                <Box sx={{ mb: 3 }}>
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
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={onClose}>
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
    );
};

export default CreateRecipeModal;

