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

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//     Box,
//     Typography,
//     Button,
//     TextField,
//     Autocomplete,
//     CircularProgress,
//     Alert,
//     Snackbar,
//     ToggleButtonGroup,
//     ToggleButton,
//     Chip,
//     Divider
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import CloseIcon from '@mui/icons-material/Close';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import WarningIcon from '@mui/icons-material/Warning';
// import { fetchIngredients } from '../store/slices/ingredientsSlice';
// import { recipeApi } from '../api/recipeApi';
// import { useNavigate } from 'react-router-dom';

// const SearchByIngredientsCount = () => {
//     const dispatch = useDispatch();
//     const {
//         items: ingredients,
//         loading: ingredientsLoading,
//         error: ingredientsError
//     } = useSelector(state => state.ingredients);
//     const navigate = useNavigate();

//     const [ingredientInputs, setIngredientInputs] = useState([{ id: '', quantity: 1 }]);
//     const [portionsResults, setPortionsResults] = useState([]);
//     const [loadingPortions, setLoadingPortions] = useState(false);
//     const [errorPortions, setErrorPortions] = useState(null);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [searchMode, setSearchMode] = useState('strict'); // 'strict' или 'partial'

//     const error = ingredientsError || errorPortions;
//     const loading = ingredientsLoading || loadingPortions;

//     useEffect(() => {
//         dispatch(fetchIngredients());
//     }, [dispatch]);

//     useEffect(() => {
//         if (error) setSnackbarOpen(true);
//     }, [error]);

//     const handleCountPortions = async () => {
//         const ingredientsToSend = ingredientInputs.filter(input => input.id);

//         if (ingredientsToSend.length > 0) {
//             setLoadingPortions(true);
//             setErrorPortions(null);
//             try {
//                 const ingredientsMap = new Map(
//                     ingredientsToSend.map(item => [item.id, item.quantity])
//                 );

//                 let data;
//                 if (searchMode === 'strict') {
//                     data = await recipeApi.countPortionsStrict(ingredientsMap);
//                 } else {
//                     data = await recipeApi.countPortionsPartial(ingredientsMap);
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
//         newInputs[index] = { ...newInputs[index], id: value?.id || '' };
//         setIngredientInputs(newInputs);
//     };

//     const handleQuantityChange = (index, value) => {
//         const newInputs = [...ingredientInputs];
//         const quantity = Math.max(1, parseInt(value) || 1);
//         newInputs[index] = { ...newInputs[index], quantity };
//         setIngredientInputs(newInputs);
//     };

//     const addIngredientField = () => {
//         setIngredientInputs([...ingredientInputs, { id: '', quantity: 1 }]);
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

//             <Box sx={{ mb: 3 }}>
//                 <ToggleButtonGroup
//                     value={searchMode}
//                     exclusive
//                     onChange={handleSearchModeChange}
//                     aria-label="Режим поиска"
//                 >
//                     <ToggleButton value="strict" aria-label="Полное совпадение">
//                         Полное совпадение
//                     </ToggleButton>
//                     <ToggleButton value="partial" aria-label="Частичное совпадение">
//                         Частичное совпадение
//                     </ToggleButton>
//                 </ToggleButtonGroup>
//                 <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//                     {searchMode === 'strict'
//                         ? 'Показывать только рецепты, где есть все указанные ингредиенты'
//                         : 'Показывать все рецепты с совпадениями, включая недостающие ингредиенты'}
//                 </Typography>
//             </Box>

//             {ingredientInputs.map((input, index) => (
//                 <Box
//                     key={index}
//                     sx={{
//                         display: 'flex',
//                         gap: 2,
//                         mb: 2,
//                         alignItems: 'center',
//                         flexWrap: 'wrap'
//                     }}
//                 >
//                     <Autocomplete
//                         sx={{ flex: 1, minWidth: 200 }}
//                         options={ingredients}
//                         getOptionLabel={(option) => option.name || ''}
//                         isOptionEqualToValue={(option, value) => option.id === value.id}
//                         renderInput={(params) => (
//                             <TextField {...params} label="Ингредиент" variant="outlined" />
//                         )}
//                         value={ingredients.find(ing => ing.id === input.id) || null}
//                         onChange={(_, newValue) => handleIngredientChange(index, newValue)}
//                         disabled={loading}
//                     />

//                     <TextField
//                         sx={{ width: 100 }}
//                         label="Количество"
//                         type="number"
//                         value={input.quantity}
//                         onChange={(e) => handleQuantityChange(index, e.target.value)}
//                         inputProps={{ min: 1 }}
//                         disabled={loading}
//                     />

//                     {ingredientInputs.length > 1 && (
//                         <Button
//                             variant="outlined"
//                             color="error"
//                             startIcon={<CloseIcon />}
//                             onClick={() => removeIngredientField(index)}
//                             disabled={loading}
//                         >
//                             Удалить
//                         </Button>
//                     )}
//                 </Box>
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
//                     disabled={loading || !ingredientInputs.some(input => input.id)}
//                     sx={{ flex: 1 }}
//                 >
//                     Подсчитать порции
//                 </Button>
//             </Box>

//             {portionsResults.length > 0 && (
//                 <Box sx={{ mt: 4 }}>
//                     <Typography variant="h5" gutterBottom>
//                         {searchMode === 'strict'
//                             ? 'Рецепты с полным набором ингредиентов'
//                             : 'Рецепты с совпадениями ингредиентов'}
//                     </Typography>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                         {portionsResults.map((result) => (
//                             <Box
//                                 key={result.recipe.id}
//                                 onClick={() => onRecipeClickHandler(result.recipe.id)}
//                                 sx={{
//                                     p: 2,
//                                     border: '1px solid #eee',
//                                     borderRadius: 1,
//                                     cursor: 'pointer',
//                                     '&:hover': {
//                                         backgroundColor: '#f5f5f5'
//                                     }
//                                 }}
//                             >
//                                 <Typography variant="h6">{result.recipe.title}</Typography>

//                                 {result.possiblePortions > 0 ? (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                                         <CheckCircleIcon color="success" fontSize="small" />
//                                         <Typography>
//                                             Можно приготовить: {result.possiblePortions} порций
//                                         </Typography>
//                                     </Box>
//                                 ) : (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                                         <WarningIcon color="warning" fontSize="small" />
//                                         <Typography>Нельзя приготовить</Typography>
//                                     </Box>
//                                 )}

//                                 {searchMode === 'partial' && result.missingIngredients?.length > 0 && (
//                                     <>
//                                         <Divider sx={{ my: 2 }} />
//                                         <Typography variant="body2" color="text.secondary">
//                                             Не хватает ингредиентов:
//                                         </Typography>
//                                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
//                                             {result.missingIngredients.map((missing, index) => (
//                                                 <Chip
//                                                     key={index}
//                                                     label={`${missing.name}: ${missing.missingAmount}`}
//                                                     size="small"
//                                                     color="error"
//                                                     variant="outlined"
//                                                 />
//                                             ))}
//                                         </Box>
//                                     </>
//                                 )}
//                             </Box>
//                         ))}
//                     </Box>
//                 </Box>
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
    ToggleButton,
    Chip,
    Divider,
    IconButton,
    Drawer,
    Backdrop
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { fetchIngredients } from '../store/slices/ingredientsSlice';
import { recipeApi } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';

const SearchByIngredientsCount = () => {
    const dispatch = useDispatch();
    const {
        ingredients: ingredients,
        loading: ingredientsLoading,
        error: ingredientsError
    } = useSelector(state => state.ingredients);
    const navigate = useNavigate();

    const [ingredientInputs, setIngredientInputs] = useState([{ id: '', quantity: 1 }]);
    const [portionsResults, setPortionsResults] = useState([]);
    const [loadingPortions, setLoadingPortions] = useState(false);
    const [errorPortions, setErrorPortions] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [searchMode, setSearchMode] = useState('strict');
    const [drawerOpen, setDrawerOpen] = useState(false);

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
        setDrawerOpen(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            {/* Кнопка для открытия панели */}
            <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                    position: 'fixed',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                    padding: '15px 5px',
                    zIndex: 1000,
                    boxShadow: 3,
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                        right: 2
                    }
                }}
            >
                <MenuBookIcon fontSize="large" />
            </IconButton>

            {/* Затемнение фона */}
            <Backdrop
                open={drawerOpen}
                onClick={() => setDrawerOpen(false)}
                sx={{ zIndex: 1200 }}
            />

            {/* Выдвижная панель */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '50%',
                        maxWidth: 500,
                        minWidth: 350,
                        p: 3,
                        boxSizing: 'border-box',
                        overflowY: 'auto'
                    },
                    zIndex: 1300
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Подсчет порций по ингредиентам
                        </Typography>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Переключатель режима поиска */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <ToggleButton
                                value="strict"
                                selected={searchMode === 'strict'}
                                onChange={() => setSearchMode('strict')}
                                sx={{ flex: 1 }}
                            >
                                Полное совпадение
                            </ToggleButton>
                            <ToggleButton
                                value="partial"
                                selected={searchMode === 'partial'}
                                onChange={() => setSearchMode('partial')}
                                sx={{ flex: 1 }}
                            >
                                Частичное совпадение
                            </ToggleButton>
                        </Box>
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {searchMode === 'strict'
                                ? 'Только рецепты со всеми ингредиентами'
                                : 'Рецепты с частичными совпадениями'}
                        </Typography>
                    </Box>

                    {/* Поля ввода ингредиентов */}
                    <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                        {ingredientInputs.map((input, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    mb: 2,
                                    alignItems: 'center'
                                }}
                            >
                                <Autocomplete
                                    sx={{ flex: 1 }}
                                    options={ingredients}
                                    getOptionLabel={(option) => option.name || ''}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Ингредиент" variant="outlined" size="small" />
                                    )}
                                    value={ingredients.find(ing => ing.id === input.id) || null}
                                    onChange={(_, newValue) => handleIngredientChange(index, newValue)}
                                    disabled={loading}
                                />

                                <TextField
                                    sx={{ width: 90 }}
                                    label="Кол-во"
                                    type="number"
                                    value={input.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    inputProps={{ min: 1 }}
                                    disabled={loading}
                                    size="small"
                                />

                                {ingredientInputs.length > 1 && (
                                    <IconButton
                                        onClick={() => removeIngredientField(index)}
                                        disabled={loading}
                                        color="error"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        ))}

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={addIngredientField}
                            disabled={loading}
                            sx={{ mt: 1 }}
                            size="small"
                        >
                            Добавить ингредиент
                        </Button>
                    </Box>

                    {/* Кнопка подсчета */}
                    <Button
                        variant="contained"
                        onClick={handleCountPortions}
                        disabled={loading || !ingredientInputs.some(input => input.id)}
                        sx={{ mb: 3 }}
                        fullWidth
                    >
                        Подсчитать порции
                    </Button>

                    {/* Результаты */}
                    {portionsResults.length > 0 && (
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            <Typography variant="h6" gutterBottom>
                                Результаты
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
                                        <Typography variant="subtitle1">{result.recipe.title}</Typography>

                                        {result.possiblePortions > 0 ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                <CheckCircleIcon color="success" fontSize="small" />
                                                <Typography variant="body2">
                                                    Можно приготовить: {result.possiblePortions} порций
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                <WarningIcon color="warning" fontSize="small" />
                                                <Typography variant="body2">Нельзя приготовить</Typography>
                                            </Box>
                                        )}

                                        {searchMode === 'partial' && result.missingIngredients?.length > 0 && (
                                            <>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Не хватает:
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                </Box>
            </Drawer>

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
        </>
    );
};

export default SearchByIngredientsCount;