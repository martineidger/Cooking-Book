import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const PortionsResults = ({ results, searchMode, onRecipeClick }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                {searchMode === 'strict'
                    ? 'Рецепты с полным набором ингредиентов'
                    : 'Рецепты с совпадениями ингредиентов'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {results.map((result) => (
                    <Box
                        key={result.recipe.id}
                        onClick={() => onRecipeClick(result.recipe.id)}
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
                                            label={`${missing.name}: ${missing.missingAmount} ${missing.unit}`}
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
    );
};

export default PortionsResults;