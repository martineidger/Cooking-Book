import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRecipe, fetchCategories, fetchCuisines } from '../store/slices/recipesSlice';
import {
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
    Paper,
    Container
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
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

const CreateRecipePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const [currentStep, setCurrentStep] = useState({
        title: '',
        description: '',
        durationMin: 0,
        order: 1,
        image: null
    });

    const [currentIngredient, setCurrentIngredient] = useState({
        ingredientId: '',
        quantity: 1,
        ingredientUnitId: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [stepImagePreviews, setStepImagePreviews] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchIngredients());
            await dispatch(fetchIngredientUnits());
            await dispatch(fetchCategories());
            await dispatch(fetchCuisines());
        };
        loadData();
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'portions' ? parseInt(value) || 1 : value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите файл изображения');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер - 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setFormData(prev => ({ ...prev, image: file }));
    };

    const handleStepImageUpload = (e, stepIndex) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите файл изображения');
            return;
        }

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
            newSteps[stepIndex].image = file;
            return { ...prev, steps: newSteps };
        });
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
    };

    const handleRemoveStepImage = (stepIndex) => {
        setStepImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[stepIndex];
            return newPreviews;
        });

        setFormData(prev => {
            const newSteps = [...prev.steps];
            newSteps[stepIndex].image = null;
            return { ...prev, steps: newSteps };
        });
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
        setFormData(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
                .map((step, i) => ({ ...step, order: i + 1 }))
        }));

        setStepImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[index];

            // Обновляем индексы для оставшихся превью
            const updatedPreviews = {};
            Object.keys(newPreviews).forEach(key => {
                const numKey = parseInt(key);
                if (numKey > index) {
                    updatedPreviews[numKey - 1] = newPreviews[numKey];
                } else if (numKey < index) {
                    updatedPreviews[numKey] = newPreviews[numKey];
                }
            });

            return updatedPreviews;
        });
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

    const handleSubmit = async () => {
        if (!formData.title || !formData.ingredients.length || !formData.steps.length) return;

        setIsUploading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('portions', formData.portions.toString());
            formDataToSend.append('cuisineId', formData.cuisineId);
            formDataToSend.append('userId', userId);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            formData.categories.forEach((cat, index) => {
                formDataToSend.append(`categories[${index}][categoryId]`, cat.categoryId);
            });

            formData.ingredients.forEach((ing, index) => {
                formDataToSend.append(`ingredients[${index}][ingredientId]`, ing.ingredientId);
                formDataToSend.append(`ingredients[${index}][quantity]`, ing.quantity.toString());
                formDataToSend.append(`ingredients[${index}][ingredientUnitId]`, ing.ingredientUnitId);
            });

            formData.steps.forEach((step, index) => {
                formDataToSend.append(`steps[${index}][title]`, step.title);
                formDataToSend.append(`steps[${index}][description]`, step.description);
                formDataToSend.append(`steps[${index}][durationMin]`, step.durationMin.toString());
                formDataToSend.append(`steps[${index}][order]`, step.order.toString());
                if (step.image) {
                    formDataToSend.append(`steps[${index}][image]`, step.image);
                }
            });

            await dispatch(createRecipe(formDataToSend)).unwrap();
            navigate('/recipes');
        } catch (error) {
            console.error('Error creating recipe:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">Создание нового рецепта</Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
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
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            disabled={!currentStep.title}
                        >
                            Добавить фото
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            setCurrentStep(prev => ({
                                                ...prev,
                                                image: file,
                                                imagePreview: reader.result
                                            }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </Button>
                        {currentStep.imagePreview && (
                            <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                                <img
                                    src={currentStep.imagePreview}
                                    alt="Step preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => setCurrentStep(prev => ({
                                        ...prev,
                                        image: null,
                                        imagePreview: null
                                    }))}
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        bgcolor: 'background.paper',
                                        p: 0.5
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleAddStep}
                            disabled={!currentStep.title}
                            startIcon={<AddIcon />}
                            sx={{ ml: 'auto' }}
                        >
                            Добавить шаг
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    {formData.steps.map((step, index) => (
                        <Box key={index} sx={{
                            mb: 3,
                            p: 3,
                            border: '1px solid #eee',
                            borderRadius: 1,
                            position: 'relative'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle1">
                                    Шаг {step.order}: {step.title}
                                </Typography>
                                <IconButton
                                    onClick={() => handleRemoveStep(index)}
                                    size="small"
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                >
                                    <RemoveIcon color="error" fontSize="small" />
                                </IconButton>
                            </Box>

                            {stepImagePreviews[index] && (
                                <Box sx={{ mb: 2, position: 'relative', maxWidth: 400 }}>
                                    <img
                                        src={stepImagePreviews[index]}
                                        alt={`Шаг ${step.order}`}
                                        style={{
                                            width: '100%',
                                            maxHeight: 200,
                                            objectFit: 'cover',
                                            borderRadius: 1
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleRemoveStepImage(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'background.paper'
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                                {step.description}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Время: {step.durationMin} мин
                                </Typography>

                                {!stepImagePreviews[index] && (
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        size="small"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Добавить фото
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleStepImageUpload(e, index)}
                                        />
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        disabled={isUploading}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.title || !formData.ingredients.length || !formData.steps.length || isUploading}
                        size="large"
                    >
                        {isUploading ? 'Создание...' : 'Создать рецепт'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateRecipePage;