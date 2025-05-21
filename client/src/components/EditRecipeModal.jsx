
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecipe, fetchCategories, fetchCuisines } from '../store/slices/recipesSlice';
import { fetchIngredients, fetchIngredientUnits } from '../store/slices/ingredientsSlice';
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
    CircularProgress,
    Autocomplete,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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

export const EditRecipeModal = ({ open, onClose, recipe }) => {

    const dispatch = useDispatch();
    const { ingredients, units } = useSelector(state => state.ingredients);
    const { categories, cuisines } = useSelector(state => state.recipes);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialFormData = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        portions: 1,
        cuisineId: '',
        categories: [],
        ingredients: [],
        steps: [],
        image: null,
        oldMainPhotoPublicId: null
    });
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setError(null);
    };

    const [imagePreview, setImagePreview] = useState(null);
    const [currentStep, setCurrentStep] = useState({
        title: '',
        description: '',
        durationMin: 0,
        order: 1,
        image: null,
        oldPhotoPublicId: null
    });
    const [stepImagePreviews, setStepImagePreviews] = useState({});
    const [stepsToDelete, setStepsToDelete] = useState([]);

    const [currentIngredient, setCurrentIngredient] = useState({
        ingredientId: '',
        quantity: 1,
        ingredientUnitId: ''
    });

    const [initialLoad, setInitialLoad] = useState(false);
    const [ingredientInputValue, setIngredientInputValue] = useState('');

    // useEffect(() => {
    //     if (open && !initialLoad) {
    //         const loadData = async () => {
    //             if (!ingredients || ingredients.length === 0) {
    //                 await dispatch(fetchIngredients());
    //             }
    //             if (!units || units.length === 0)
    //                 await dispatch(fetchIngredientUnits());
    //             if (!categories || categories.length === 0)
    //                 await dispatch(fetchCategories());
    //             if (!cuisines || categories.length === 0)
    //                 await dispatch(fetchCuisines());


    //             setInitialLoad(true);
    //         };
    //         loadData();
    //     }

    //     return () => {
    //         if (!open) {
    //             setInitialLoad(false);
    //         }
    //     };
    // }, [open, initialLoad]);

    useEffect(() => {
        if (open) {
            const loadData = async () => {
                try {
                    const promises = [];

                    if (!ingredients || ingredients.length === 0) {
                        promises.push(dispatch(fetchIngredients()));
                    }
                    if (!units || units.length === 0) {
                        promises.push(dispatch(fetchIngredientUnits()));
                    }
                    if (!categories || categories.length === 0) {
                        promises.push(dispatch(fetchCategories()));
                    }
                    if (!cuisines || cuisines.length === 0) {
                        promises.push(dispatch(fetchCuisines()));
                    }

                    await Promise.all(promises);
                    setInitialLoad(true);
                } catch (error) {
                    console.error('Ошибка при загрузке данных:', error);
                    setError(error.message || 'Произошла ошибка при загрузке данных');
                    setOpenSnackbar(true);
                    setIsSubmitting(false);
                }
            };

            loadData();
        }
    }, [open]); // Убрали зависимость от initialLoad

    useEffect(() => {
        if (recipe && open) {
            // Сохраняем исходные данные рецепта для сравнения
            const initialData = {
                title: recipe.title,
                description: recipe.description || '',
                portions: recipe.portions || 1,
                cuisineId: recipe.cuisine?.id || '',
                categories: recipe.categories?.map(c => ({ categoryId: c.categoryId })) || [],
                ingredients: recipe.ingredients?.map(i => ({
                    ingredientId: i.ingredientId,
                    quantity: i.quantity,
                    ingredientUnitId: i.ingredientUnitId
                })) || [],
                steps: recipe.steps?.map(s => ({
                    ...s,
                    id: s.id,
                    order: s.order,
                    oldPhotoPublicId: s.photo?.imageId || null
                })) || [],
                oldMainPhotoPublicId: recipe.imageId || null
            };

            initialFormData.current = initialData;
            setFormData(initialData);

            // Установка превью для основного изображения
            if (recipe.imageUrl) {
                setImagePreview(recipe.imageUrl);
            }

            // Установка превью для изображений шагов
            const stepPreviews = {};
            recipe.steps?.forEach(step => {
                if (step.photo) {
                    stepPreviews[step.order - 1] = step.photo.url;
                }
            });
            setStepImagePreviews(stepPreviews);
        }
    }, [recipe, open]);

    // Функция для сравнения шагов
    const areStepsEqual = (a, b) => {
        if (a.length !== b.length) return false;

        return a.every((stepA, index) => {
            const stepB = b[index];
            return (
                stepA.title === stepB.title &&
                stepA.description === stepB.description &&
                stepA.durationMin === stepB.durationMin &&
                stepA.order === stepB.order &&
                // Изображение не сравниваем, так как оно может быть файлом
                stepA.id === stepB.id
            );
        });
    };


    // const handleSubmit = async () => {
    //     try {
    //         const formDataToSend = new FormData();
    //         const initialData = initialFormData.current;

    //         let hasChanges = false;

    //         // 📌 Основные поля
    //         if (formData.title !== initialData.title) {
    //             formDataToSend.append('title', formData.title);
    //             hasChanges = true;
    //         }
    //         if (formData.description !== initialData.description) {
    //             formDataToSend.append('description', formData.description || '');
    //             hasChanges = true;
    //         }
    //         if (formData.portions !== initialData.portions) {
    //             formDataToSend.append('portions', formData.portions.toString());
    //             console.log(1243, formData.portions.toString())
    //             hasChanges = true;
    //         }
    //         if (formData.cuisineId !== initialData.cuisineId) {
    //             formDataToSend.append('cuisineId', formData.cuisineId || '');
    //             hasChanges = true;
    //         }

    //         // 📸 Главное изображение
    //         if (formData.image) {
    //             formDataToSend.append('mainPhoto', formData.image);
    //             hasChanges = true;
    //             if (formData.oldMainPhotoPublicId) {
    //                 formDataToSend.append('oldMainPhotoPublicId', formData.oldMainPhotoPublicId);
    //             }
    //         } else if (!imagePreview && formData.oldMainPhotoPublicId) {
    //             formDataToSend.append('oldMainPhotoPublicId', formData.oldMainPhotoPublicId);
    //             hasChanges = true;
    //         }

    //         // 🏷 Категории
    //         if (!areArraysEqual(formData.categories, initialData.categories, 'categoryId')) {
    //             formData.categories.forEach((cat, index) => {
    //                 //formDataToSend.append(`categories[${index}][id]`, cat.categoryId);
    //                 formDataToSend.append(`categories[${index}][categoryId]`, cat.categoryId);
    //             });

    //             // 👇 Добавим также categoriesToDisconnect
    //             const initialIds = initialData.categories.map(c => c.categoryId);
    //             const currentIds = formData.categories.map(c => c.categoryId);
    //             const toDisconnect = initialIds.filter(id => !currentIds.includes(id));
    //             toDisconnect.forEach((id, index) => {
    //                 formDataToSend.append(`categoriesToDisconnect[${index}]`, id);
    //             });

    //             hasChanges = true;
    //         }

    //         // 🧂 Ингредиенты
    //         // if (!areArraysEqual(formData.ingredients, initialData.ingredients, 'ingredientId')) {
    //         //     formData.ingredients.forEach((ingr, index) => {
    //         //         formDataToSend.append(`ingredients[${index}][ingredientId]`, ingr.ingredientId);
    //         //         formDataToSend.append(`ingredients[${index}][quantity]`, ingr.quantity.toString());
    //         //         formDataToSend.append(`ingredients[${index}][ingredientUnitId]`, ingr.ingredientUnitId);
    //         //     });

    //         //     const initialIds = initialData.ingredients.map(i => i.ingredientId);
    //         //     const currentIds = formData.ingredients.map(i => i.ingredientId);
    //         //     const toDisconnect = initialIds.filter(id => !currentIds.includes(id));
    //         //     toDisconnect.forEach((id, index) => {
    //         //         formDataToSend.append(`ingredientsToDisconnect[${index}]`, id);
    //         //     });

    //         //     hasChanges = true;
    //         // }

    //         const initialIngredientIds = initialData.ingredients.map(i => i.ingredientId);
    //         const currentIngredientIds = formData.ingredients.map(i => i.ingredientId);

    //         // 1. Ингредиенты для удаления
    //         const ingredientsToDisconnect = initialIngredientIds.filter(
    //             id => !currentIngredientIds.includes(id)
    //         );

    //         ingredientsToDisconnect.forEach((id, index) => {
    //             formDataToSend.append(`ingredientsToDisconnect[${index}]`, id);
    //         });

    //         // 2. Новые или изменённые ингредиенты
    //         formData.ingredients.forEach((ingr, index) => {
    //             const initialIngr = initialData.ingredients.find(
    //                 i => i.ingredientId === ingr.ingredientId
    //             );

    //             // Если ингредиент новый или изменились его параметры
    //             if (!initialIngr ||
    //                 initialIngr.quantity !== ingr.quantity ||
    //                 initialIngr.ingredientUnitId !== ingr.ingredientUnitId) {

    //                 formDataToSend.append(`ingredients[${index}][ingredientId]`, ingr.ingredientId);
    //                 formDataToSend.append(`ingredients[${index}][quantity]`, ingr.quantity.toString());
    //                 formDataToSend.append(`ingredients[${index}][ingredientUnitId]`, ingr.ingredientUnitId || '');
    //             }
    //         });

    //         //📋 Шаги
    //         const stepChanged = !areStepsEqual(formData.steps, initialData.steps);
    //         if (stepChanged) {
    //             formData.steps.forEach((step, index) => {
    //                 const isNew = !step.id;
    //                 const existing = initialData.steps.find(s => s.id === step.id);

    //                 const changed =
    //                     isNew ||
    //                     (existing &&
    //                         (existing.title !== step.title ||
    //                             existing.description !== step.description ||
    //                             existing.durationMin !== step.durationMin));

    //                 if (changed) {
    //                     formDataToSend.append(`steps[${index}][title]`, step.title);
    //                     formDataToSend.append(`steps[${index}][description]`, step.description);
    //                     formDataToSend.append(`steps[${index}][order]`, step.order.toString());
    //                     formDataToSend.append(`steps[${index}][durationMin]`, step.durationMin.toString());

    //                     if (step.id) {
    //                         formDataToSend.append(`steps[${index}][id]`, step.id);
    //                     }

    //                     if (step.image) {
    //                         formDataToSend.append(`steps[${index}][photo]`, step.image);
    //                         if (step.oldPhotoPublicId) {
    //                             formDataToSend.append(`steps[${index}][oldPhotoPublicId]`, step.oldPhotoPublicId);
    //                         }
    //                     } else if (!stepImagePreviews[index] && step.oldPhotoPublicId) {
    //                         formDataToSend.append(`steps[${index}][oldPhotoPublicId]`, step.oldPhotoPublicId);
    //                     }

    //                     hasChanges = true;
    //                 }
    //             });
    //         }


    //         // formData.steps.forEach((step, index) => {
    //         //     const initialStep = initialData.steps.find(s => s.id === step.id);

    //         //     // Если шаг новый или изменён
    //         //     if (!initialStep ||
    //         //         step.title !== initialStep.title ||
    //         //         step.description !== initialStep.description ||
    //         //         step.durationMin !== initialStep.durationMin ||
    //         //         step.image ||
    //         //         (stepImagePreviews[index] && !initialStep.oldPhotoPublicId)) {

    //         //         formDataToSend.append(`steps[${index}][title]`, step.title);
    //         //         formDataToSend.append(`steps[${index}][description]`, step.description);
    //         //         formDataToSend.append(`steps[${index}][order]`, step.order.toString());
    //         //         formDataToSend.append(`steps[${index}][durationMin]`, step.durationMin.toString());

    //         //         if (step.id) {
    //         //             formDataToSend.append(`steps[${index}][id]`, step.id);
    //         //         }

    //         //         // Обработка изображений шагов
    //         //         if (step.image) {
    //         //             formDataToSend.append(`steps[${index}][photo]`, step.image);
    //         //             if (step.oldPhotoPublicId) {
    //         //                 formDataToSend.append(`steps[${index}][oldPhotoPublicId]`, step.oldPhotoPublicId);
    //         //             }
    //         //         } else if (stepImagePreviews[index] && step.oldPhotoPublicId) {
    //         //             formDataToSend.append(`steps[${index}][oldPhotoPublicId]`, step.oldPhotoPublicId);
    //         //         }

    //         //         hasChanges = true;
    //         //     }
    //         // });

    //         // ❌ Удалённые шаги
    //         if (stepsToDelete.length > 0) {
    //             stepsToDelete.forEach((id, index) => {
    //                 formDataToSend.append(`stepsToDelete[${index}]`, id);
    //             });
    //             hasChanges = true;
    //         }

    //         // ❌ Ничего не изменилось
    //         if (!hasChanges) {
    //             onClose();
    //             return;
    //         }

    //         console.log(777, formDataToSend)
    //         // 🔄 Отправка
    //         await dispatch(updateRecipe({ id: recipe.id, recipeData: formDataToSend })).unwrap();
    //         onClose();
    //     } catch (error) {
    //         console.error('Error updating recipe:', error);
    //     }
    // };


    // const handleSubmit = async () => {
    //     try {
    //         const formDataToSend = new FormData();
    //         const initialData = initialFormData.current;
    //         let hasChanges = false;

    //         // 1. Основные поля (только если изменились)
    //         if (formData.title !== initialData.title) {
    //             formDataToSend.append('title', formData.title);
    //             hasChanges = true;
    //         }
    //         if (formData.description !== initialData.description) {
    //             formDataToSend.append('description', formData.description);
    //             hasChanges = true;
    //         }
    //         if (formData.portions !== initialData.portions) {
    //             formDataToSend.append('portions', formData.portions.toString());
    //             hasChanges = true;
    //         }
    //         if (formData.cuisineId !== initialData.cuisineId) {
    //             formDataToSend.append('cuisineId', formData.cuisineId || '');
    //             hasChanges = true;
    //         }

    //         // 2. Главное фото (только если изменилось)
    //         if (formData.image) {
    //             formDataToSend.append('mainPhoto', formData.image);
    //             if (formData.oldMainPhotoPublicId) {
    //                 formDataToSend.append('oldMainPhotoPublicId', formData.oldMainPhotoPublicId);
    //             }
    //             hasChanges = true;
    //         } else if (!imagePreview && formData.oldMainPhotoPublicId) {
    //             // Фото удалено
    //             formDataToSend.append('oldMainPhotoPublicId', formData.oldMainPhotoPublicId);
    //             hasChanges = true;
    //         }

    //         // 3. Категории (только если изменились)
    //         if (!areArraysEqual(formData.categories, initialData.categories, 'categoryId')) {
    //             formDataToSend.append('categories', JSON.stringify({
    //                 connect: formData.categories.map(c => ({ categoryId: c.categoryId })),
    //                 disconnect: initialData.categories
    //                     .filter(ic => !formData.categories.some(c => c.categoryId === ic.categoryId))
    //                     .map(c => c.categoryId)
    //             }));
    //             hasChanges = true;
    //         }

    //         // 4. Ингредиенты (только если изменились)
    //         if (!areArraysEqual(formData.ingredients, initialData.ingredients, 'ingredientId')) {
    //             formDataToSend.append('ingredients', JSON.stringify({
    //                 connect: formData.ingredients,
    //                 disconnect: initialData.ingredients
    //                     .filter(ii => !formData.ingredients.some(i => i.ingredientId === ii.ingredientId))
    //                     .map(i => i.ingredientId)
    //             }));
    //             hasChanges = true;
    //         }

    //         // 5. Шаги - анализируем изменения
    //         const stepsChanges = {
    //             create: [],
    //             update: [],
    //             delete: stepsToDelete,
    //             images: {}
    //         };

    //         formData.steps.forEach((step, index) => {
    //             const initialStep = initialData.steps.find(s => s.id === step.id);

    //             // Новый шаг
    //             if (!initialStep) {
    //                 stepsChanges.create.push({
    //                     title: step.title,
    //                     description: step.description,
    //                     order: step.order,
    //                     durationMin: step.durationMin
    //                 });
    //                 if (step.image) {
    //                     stepsChanges.images[`create_${stepsChanges.create.length - 1}`] = step.image;
    //                 }
    //                 return;
    //             }

    //             // Измененный шаг
    //             const stepChanged =
    //                 step.title !== initialStep.title ||
    //                 step.description !== initialStep.description ||
    //                 step.durationMin !== initialStep.durationMin ||
    //                 step.order !== initialStep.order ||
    //                 step.image ||
    //                 (stepImagePreviews[index] && !initialStep.oldPhotoPublicId);

    //             if (stepChanged) {
    //                 stepsChanges.update.push({
    //                     id: step.id,
    //                     title: step.title,
    //                     description: step.description,
    //                     order: step.order,
    //                     durationMin: step.durationMin,
    //                     oldPhotoPublicId: step.oldPhotoPublicId
    //                 });
    //                 if (step.image) {
    //                     stepsChanges.images[`update_${stepsChanges.update.length - 1}`] = step.image;
    //                 }
    //             }
    //         });

    //         if (stepsChanges.create.length > 0 ||
    //             stepsChanges.update.length > 0 ||
    //             stepsChanges.delete.length > 0) {
    //             formDataToSend.append('stepsChanges', JSON.stringify({
    //                 create: stepsChanges.create,
    //                 update: stepsChanges.update,
    //                 delete: stepsChanges.delete
    //             }));

    //             // Добавляем файлы шагов
    //             Object.entries(stepsChanges.images).forEach(([key, file]) => {
    //                 formDataToSend.append(`step_${key}`, file);
    //             });

    //             hasChanges = true;
    //         }

    //         if (!hasChanges) {
    //             onClose();
    //             return;
    //         }

    //         await dispatch(updateRecipe({ id: recipe.id, recipeData: formDataToSend }));
    //         onClose();
    //     } catch (error) {
    //         console.error('Error updating recipe:', error);
    //     }
    // };

    // Вспомогательная функция для сравнения массивов



    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            const initialData = initialFormData.current;

            let hasChanges = false;

            // 📌 Основные поля
            if (formData.title !== initialData.title) {
                formDataToSend.append('title', formData.title);
                console.log(3, 'title')
                hasChanges = true;
            }
            if (formData.description !== initialData.description) {
                formDataToSend.append('description', formData.description || '');
                console.log(3, 'description')
                hasChanges = true;
            }
            if (formData.portions !== initialData.portions) {
                formDataToSend.append('portions', formData.portions.toString());
                console.log(3, 'portions')
                hasChanges = true;
            }
            if (formData.cuisineId !== initialData.cuisineId) {
                formDataToSend.append('cuisineId', formData.cuisineId || '');
                console.log(3, 'cuisine')
                hasChanges = true;
            }

            // 📸 Главное изображение
            if (formData.image) {
                formDataToSend.append('mainPhoto', formData.image);
                console.log(3, 'mainPhoto')
                hasChanges = true;
                if (formData.oldMainPhotoPublicId) {
                    formDataToSend.append('oldMainPhotoPublicId', formData.oldMainPhotoPublicId);
                }
            } else if (!imagePreview && formData.oldMainPhotoPublicId) {
                formDataToSend.append('oldMainPhotoPublicId', formData.oldMainPhotoPublicId);
                hasChanges = true;
            }

            // 🏷 Категории
            if (!areArraysEqual(formData.categories, initialData.categories, 'categoryId')) {
                formData.categories.forEach((cat, index) => {
                    formDataToSend.append(`categories[${index}][categoryId]`, cat.categoryId);
                });

                // 👇 Добавим также categoriesToDisconnect
                const initialIds = initialData.categories.map(c => c.categoryId);
                const currentIds = formData.categories.map(c => c.categoryId);
                const toDisconnect = initialIds.filter(id => !currentIds.includes(id));
                toDisconnect.forEach((id, index) => {
                    formDataToSend.append(`categoriesToDisconnect[${index}]`, id);
                });

                console.log(3, 'categories')
                hasChanges = true;
            }

            const initialIngredientIds = initialData.ingredients.map(i => i.ingredientId);
            const currentIngredientIds = formData.ingredients.map(i => i.ingredientId);

            // 1. Ингредиенты для удаления
            const ingredientsToDisconnect = initialIngredientIds.filter(
                id => !currentIngredientIds.includes(id)
            );

            console.log(444, ingredientsToDisconnect)

            if (ingredientsToDisconnect.length > 0) {
                ingredientsToDisconnect.forEach((id, index) => {
                    formDataToSend.append(`ingredientsToDisconnect[${index}]`, id);
                });

                hasChanges = true;
            }



            // 2. Новые или изменённые ингредиенты
            formData.ingredients.forEach((ingr, index) => {
                const initialIngr = initialData.ingredients.find(
                    i => i.ingredientId === ingr.ingredientId
                );

                // Если ингредиент новый или изменились его параметры
                if (!initialIngr ||
                    initialIngr.quantity !== ingr.quantity ||
                    initialIngr.ingredientUnitId !== ingr.ingredientUnitId) {

                    formDataToSend.append(`ingredients[${index}][ingredientId]`, ingr.ingredientId);
                    formDataToSend.append(`ingredients[${index}][quantity]`, ingr.quantity.toString());
                    formDataToSend.append(`ingredients[${index}][ingredientUnitId]`, ingr.ingredientUnitId || '');

                    console.log(3, 'ingredients')
                    hasChanges = true;
                }
            });

            //📋 Шаги
            const stepChanged = !areStepsEqual(formData.steps, initialData.steps);
            if (stepChanged) {
                formData.steps.forEach((step, index) => {
                    const isNew = !step.id;
                    const existing = initialData.steps.find(s => s.id === step.id);

                    const changed =
                        isNew ||
                        (existing &&
                            (existing.title !== step.title ||
                                existing.description !== step.description ||
                                existing.durationMin !== step.durationMin));

                    if (changed) {
                        formDataToSend.append(`steps[${index}][title]`, step.title);
                        formDataToSend.append(`steps[${index}][description]`, step.description);
                        formDataToSend.append(`steps[${index}][order]`, step.order.toString());
                        formDataToSend.append(`steps[${index}][durationMin]`, step.durationMin.toString());

                        if (step.id) {
                            formDataToSend.append(`steps[${index}][id]`, step.id);
                        }

                        if (step.image) {
                            formDataToSend.append(`steps[${index}][photo]`, step.image);
                            if (step.oldPhotoPublicId) {
                                formDataToSend.append(`steps[${index}][oldPhotoPublicId]`, step.oldPhotoPublicId);
                            }
                        } else if (!stepImagePreviews[index] && step.oldPhotoPublicId) {
                            formDataToSend.append(`steps[${index}][oldPhotoPublicId]`, step.oldPhotoPublicId);
                        }

                        console.log(3, 'steps')
                        hasChanges = true;
                    }
                });
            }
            if (stepsToDelete.length > 0) {
                stepsToDelete.forEach((id, index) => {
                    formDataToSend.append(`stepsToDelete[${index}]`, id);
                });
                hasChanges = true;
            }

            // ❌ Ничего не изменилось
            if (!hasChanges) {
                setIsSubmitting(false);
                onClose();
                return;
            }

            console.log(777, formDataToSend)
            // 🔄 Отправка
            await dispatch(updateRecipe({ id: recipe.id, recipeData: formDataToSend })).unwrap();
            setIsSubmitting(true);
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении рецепта:', error);
            setError(error.message || 'Произошла ошибка при сохранении рецепта');
            setOpenSnackbar(true);
            setIsSubmitting(false);
        }
    };


    const areArraysEqual = (a, b, key) => {
        if (a.length !== b.length) return false;
        const aSorted = [...a].sort((x, y) => x[key] - y[key]);
        const bSorted = [...b].sort((x, y) => x[key] - y[key]);
        return JSON.stringify(aSorted) === JSON.stringify(bSorted);
    };

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
        setIngredientInputValue('');
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
                image: file,
                oldPhotoPublicId: newSteps[stepIndex].oldPhotoPublicId || null
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
                image: null,
                oldPhotoPublicId: newSteps[stepIndex].oldPhotoPublicId || null
            };
            return { ...prev, steps: newSteps };
        });
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
            image: null,
            oldPhotoPublicId: null
        });
    };

    const handleRemoveStep = (index) => {
        const stepToRemove = formData.steps[index];
        if (stepToRemove.id) {
            setStepsToDelete(prev => [...prev, stepToRemove.id]);
        }

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

        setFormData(prev => ({
            ...prev,
            image: file,
            oldMainPhotoPublicId: prev.oldMainPhotoPublicId || null
        }));
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            image: null,
            oldMainPhotoPublicId: prev.oldMainPhotoPublicId || null
        }));
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
                        <Typography variant="h5">Редактировать рецепт</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Фото рецепта</Typography>
                        {console.log(imagePreview)}
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
                        {console.log(222, categories)}
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
                </Box> */}
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
                        {console.log(111, formData)}
                        {formData.ingredients.map((ingredient, index) => {
                            const ingr = ingredients.find(i => i.id == ingredient.ingredientId);
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
                                        {step.id && <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>(ID: {step.id})</Typography>}
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


                            </Box>
                        ))}
                    </Box>


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {/* <Button variant="outlined" onClick={onClose}>
                        Отмена
                    </Button> */}
                        {/* <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.title || !formData.ingredients.length || !formData.steps.length}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}

                    </Button> */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, position: 'relative' }}>
                            <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
                                Отмена
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!formData.title || !formData.ingredients.length || !formData.steps.length || isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{ minWidth: 150 }}
                            >
                                {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                            </Button>

                            {isSubmitting && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default EditRecipeModal;