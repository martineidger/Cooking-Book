// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//     Box,
//     Typography,
//     Button,
//     CircularProgress,
//     Snackbar,
//     Alert
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { fetchIngredients } from '../store/slices/ingredientsSlice';
// import { getRecipesPortionsByIngredientsPartial, getRecipesPortionsByIngredientsStrict } from '../store/slices/recipesSlice';
// import { useNavigate } from 'react-router-dom';
// import SearchModeToggle from './SearchModeToggle';
// import PortionsResults from './PortionsResult';
// import IngredientRow from './IngredientRow';


// // Define available units for different unit types
// const units = {
//     weight: [
//         { value: 'g', label: 'грамм' },
//         { value: 'kg', label: 'килограмм' },
//         { value: 'lb', label: 'фунт' }
//     ],
//     volume: [
//         { value: 'ml', label: 'миллилитр' },
//         { value: 'l', label: 'литр' },
//         { value: 'cup', label: 'стакан' }
//     ],
//     count: [
//         { value: 'pcs', label: 'шт.' },
//         { value: 'dozen', label: 'дюжина' }
//     ]
// };

// const SearchByIngredientsCount = () => {
//     const dispatch = useDispatch();
//     const {
//         items: ingredients,
//         loading: ingredientsLoading,
//         error: ingredientsError
//     } = useSelector(state => state.ingredients);

//     const navigate = useNavigate();

//     const [ingredientInputs, setIngredientInputs] = useState([{ id: '', quantity: 1, unit: '' }]);
//     const [portionsResults, setPortionsResults] = useState([]);
//     const [loadingPortions, setLoadingPortions] = useState(false);
//     const [errorPortions, setErrorPortions] = useState(null);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [searchMode, setSearchMode] = useState('strict');

//     const error = ingredientsError || errorPortions;
//     const loading = ingredientsLoading || loadingPortions;

//     useEffect(() => {
//         dispatch(fetchIngredients());
//     }, [dispatch]);

//     useEffect(() => {
//         if (error) setSnackbarOpen(true);
//     }, [error]);

//     const handleCountPortions = async () => {
//         const ingredientsToSend = ingredientInputs.filter(input => input.id && input.unit);

//         if (ingredientsToSend.length > 0) {
//             setLoadingPortions(true);
//             setErrorPortions(null);
//             try {
//                 const ingredientsMap = new Map(
//                     ingredientsToSend.map(item => [
//                         item.id,
//                         { quantity: item.quantity, unit: item.unit }
//                     ])
//                 );

//                 let data;
//                 if (searchMode === 'strict') {
//                     data = getRecipesPortionsByIngredientsStrict(ingredientsMap);
//                 } else {
//                     data = getRecipesPortionsByIngredientsPartial(ingredientsMap);
//                 }
//                 setPortionsResults(data);
//             } catch (error) {
//                 console.error('Ошибка при подсчете порций:', error);
//                 setErrorPortions('Не удалось подсчитать порции.');
//             } finally {
//                 setLoadingPortions(false);
//             }
//         } else {
//             setPortionsResults([]);
//         }
//     };

//     const handleIngredientChange = (index, value) => {
//         const newInputs = [...ingredientInputs];
//         const defaultUnit = value ? units[value.unitType]?.[0]?.value || '' : '';
//         newInputs[index] = {
//             ...newInputs[index],
//             id: value?.id || '',
//             unit: defaultUnit
//         };
//         setIngredientInputs(newInputs);
//     };

//     const handleQuantityChange = (index, value) => {
//         const newInputs = [...ingredientInputs];
//         const quantity = Math.max(1, parseInt(value) || 1);
//         newInputs[index] = { ...newInputs[index], quantity };
//         setIngredientInputs(newInputs);
//     };

//     const handleUnitChange = (index, unit) => {
//         const newInputs = [...ingredientInputs];
//         newInputs[index] = { ...newInputs[index], unit };
//         setIngredientInputs(newInputs);
//     };

//     const addIngredientField = () => {
//         setIngredientInputs([...ingredientInputs, { id: '', quantity: 1, unit: '' }]);
//     };

//     const removeIngredientField = (index) => {
//         if (ingredientInputs.length > 1) {
//             const newInputs = ingredientInputs.filter((_, i) => i !== index);
//             setIngredientInputs(newInputs);
//         }
//     };

//     const onRecipeClickHandler = (id) => {
//         navigate(`/recipes/${id}`);
//     };

//     const handleSearchModeChange = (event, newMode) => {
//         if (newMode !== null) {
//             setSearchMode(newMode);
//         }
//     };

//     const handleCloseSnackbar = () => {
//         setSnackbarOpen(false);
//     };

//     return (
//         <Box sx={{
//             maxWidth: 800,
//             margin: '0 auto',
//             padding: 3,
//             backgroundColor: 'background.paper',
//             borderRadius: 2,
//             boxShadow: 1
//         }}>
//             <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//                 Подсчет количества порций по ингредиентам
//             </Typography>

//             <SearchModeToggle
//                 searchMode={searchMode}
//                 onSearchModeChange={handleSearchModeChange}
//             />

//             {ingredientInputs.map((input, index) => (
//                 <IngredientRow
//                     key={index}
//                     index={index}
//                     input={input}
//                     ingredients={ingredients}
//                     loading={loading}
//                     onIngredientChange={handleIngredientChange}
//                     onQuantityChange={handleQuantityChange}
//                     onUnitChange={handleUnitChange}
//                     onRemove={ingredientInputs.length > 1 ? removeIngredientField : null}
//                     units={units}
//                 />
//             ))}

//             <Button
//                 variant="outlined"
//                 startIcon={<AddIcon />}
//                 onClick={addIngredientField}
//                 disabled={loading}
//                 sx={{ mt: 1, mb: 3 }}
//             >
//                 Добавить ингредиент
//             </Button>

//             <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//                 <Button
//                     variant="contained"
//                     onClick={handleCountPortions}
//                     disabled={loading || !ingredientInputs.some(input => input.id && input.unit)}
//                     sx={{ flex: 1 }}
//                 >
//                     Подсчитать порции
//                 </Button>
//             </Box>

//             {portionsResults.length > 0 && (
//                 <PortionsResults
//                     results={portionsResults}
//                     searchMode={searchMode}
//                     onRecipeClick={onRecipeClickHandler}
//                 />
//             )}

//             {loading && (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//                     <CircularProgress />
//                 </Box>
//             )}

//             <Snackbar
//                 open={snackbarOpen}
//                 autoHideDuration={6000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             >
//                 <Alert severity="error" onClose={handleCloseSnackbar}>
//                     {error || 'Произошла ошибка'}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default SearchByIngredientsCount;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    TextField,
    Autocomplete,
    CircularProgress,
    Alert,
    Snackbar,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { fetchIngredients } from '../store/slices/ingredientsSlice';
import { recipeApi } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';

const SearchByIngredientsCount = () => {
    const dispatch = useDispatch();
    const {
        items: ingredients,
        loading: ingredientsLoading,
        error: ingredientsError
    } = useSelector(state => state.ingredients);

    const navigate = useNavigate();

    const [ingredientInputs, setIngredientInputs] = useState([{ id: '', quantity: 1 }]);
    const [portionsResults, setPortionsResults] = useState([]);
    const [loadingPortions, setLoadingPortions] = useState(false);
    const [errorPortions, setErrorPortions] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [searchMode, setSearchMode] = useState('strict'); // 'strict' или 'partial'

    const error = ingredientsError || errorPortions;
    const loading = ingredientsLoading || loadingPortions;

    useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    useEffect(() => {
        if (error) setSnackbarOpen(true);
    }, [error]);

    const handleCountPortions = async () => {
        const ingredientsToSend = ingredientInputs.filter(input => input.id);

        if (ingredientsToSend.length > 0) {
            setLoadingPortions(true);
            setErrorPortions(null);
            try {
                const ingredientsMap = new Map(
                    ingredientsToSend.map(item => [item.id, item.quantity])
                );

                let data;
                if (searchMode === 'strict') {
                    data = await recipeApi.countPortionsStrict(ingredientsMap);
                } else {
                    data = await recipeApi.countPortionsPartial(ingredientsMap);
                }
                setPortionsResults(data);
            } catch (error) {
                console.error('Ошибка при подсчете порций:', error);
                setErrorPortions('Не удалось подсчитать порции.');
            } finally {
                setLoadingPortions(false);
            }
        } else {
            setPortionsResults([]);
        }
    };

    const handleIngredientChange = (index, value) => {
        const newInputs = [...ingredientInputs];
        newInputs[index] = { ...newInputs[index], id: value?.id || '' };
        setIngredientInputs(newInputs);
    };

    const handleQuantityChange = (index, value) => {
        const newInputs = [...ingredientInputs];
        const quantity = Math.max(1, parseInt(value) || 1);
        newInputs[index] = { ...newInputs[index], quantity };
        setIngredientInputs(newInputs);
    };

    const addIngredientField = () => {
        setIngredientInputs([...ingredientInputs, { id: '', quantity: 1 }]);
    };

    const removeIngredientField = (index) => {
        if (ingredientInputs.length > 1) {
            const newInputs = ingredientInputs.filter((_, i) => i !== index);
            setIngredientInputs(newInputs);
        }
    };

    const onRecipeClickHandler = (id) => {
        navigate(`/recipes/${id}`);
    };

    const handleSearchModeChange = (event, newMode) => {
        if (newMode !== null) {
            setSearchMode(newMode);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{
            maxWidth: 800,
            margin: '0 auto',
            padding: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
        }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Подсчет количества порций по ингредиентам
            </Typography>

            <Box sx={{ mb: 3 }}>
                <ToggleButtonGroup
                    value={searchMode}
                    exclusive
                    onChange={handleSearchModeChange}
                    aria-label="Режим поиска"
                >
                    <ToggleButton value="strict" aria-label="Полное совпадение">
                        Полное совпадение
                    </ToggleButton>
                    <ToggleButton value="partial" aria-label="Частичное совпадение">
                        Частичное совпадение
                    </ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {searchMode === 'strict'
                        ? 'Показывать только рецепты, где есть все указанные ингредиенты'
                        : 'Показывать все рецепты с совпадениями, включая недостающие ингредиенты'}
                </Typography>
            </Box>

            {ingredientInputs.map((input, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}
                >
                    <Autocomplete
                        sx={{ flex: 1, minWidth: 200 }}
                        options={ingredients}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Ингредиент" variant="outlined" />
                        )}
                        value={ingredients.find(ing => ing.id === input.id) || null}
                        onChange={(_, newValue) => handleIngredientChange(index, newValue)}
                        disabled={loading}
                    />

                    <TextField
                        sx={{ width: 100 }}
                        label="Количество"
                        type="number"
                        value={input.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        inputProps={{ min: 1 }}
                        disabled={loading}
                    />

                    {ingredientInputs.length > 1 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={() => removeIngredientField(index)}
                            disabled={loading}
                        >
                            Удалить
                        </Button>
                    )}
                </Box>
            ))}

            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addIngredientField}
                disabled={loading}
                sx={{ mt: 1, mb: 3 }}
            >
                Добавить ингредиент
            </Button>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleCountPortions}
                    disabled={loading || !ingredientInputs.some(input => input.id)}
                    sx={{ flex: 1 }}
                >
                    Подсчитать порции
                </Button>
            </Box>

            {portionsResults.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        {searchMode === 'strict'
                            ? 'Рецепты с полным набором ингредиентов'
                            : 'Рецепты с совпадениями ингредиентов'}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {portionsResults.map((result) => (
                            <Box
                                key={result.recipe.id}
                                onClick={() => onRecipeClickHandler(result.recipe.id)}
                                sx={{
                                    p: 2,
                                    border: '1px solid #eee',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <Typography variant="h6">{result.recipe.title}</Typography>

                                {result.possiblePortions > 0 ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                        <CheckCircleIcon color="success" fontSize="small" />
                                        <Typography>
                                            Можно приготовить: {result.possiblePortions} порций
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                        <WarningIcon color="warning" fontSize="small" />
                                        <Typography>Нельзя приготовить</Typography>
                                    </Box>
                                )}

                                {searchMode === 'partial' && result.missingIngredients?.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Не хватает ингредиентов:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            {result.missingIngredients.map((missing, index) => (
                                                <Chip
                                                    key={index}
                                                    label={`${missing.name}: ${missing.missingAmount}`}
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={handleCloseSnackbar}>
                    {error || 'Произошла ошибка'}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SearchByIngredientsCount;