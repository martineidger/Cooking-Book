import React from 'react';
import {
    Box,
    TextField,
    Autocomplete,
    Button,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const IngredientRow = ({
    index,
    input,
    ingredients,
    loading,
    onIngredientChange,
    onQuantityChange,
    onUnitChange,
    onRemove,
    units
}) => {
    const selectedIngredient = ingredients.find(ing => ing.id === input.id);
    console.log(selectedIngredient)
    const availableUnits = selectedIngredient ? units[selectedIngredient.unitType] : [];

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Autocomplete
                sx={{ flex: 1, minWidth: 200 }}
                options={ingredients}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField {...params} label="Ингредиент" variant="outlined" />
                )}
                value={selectedIngredient || null}
                onChange={(_, newValue) => onIngredientChange(index, newValue)}
                disabled={loading}
            />

            <TextField
                sx={{ width: 100 }}
                label="Количество"
                type="number"
                value={input.quantity}
                onChange={(e) => onQuantityChange(index, e.target.value)}
                inputProps={{ min: 1 }}
                disabled={loading}
            />

            <TextField
                select
                sx={{ width: 120 }}
                label="Единица"
                value={input.unit || ''}
                onChange={(e) => onUnitChange(index, e.target.value)}
                disabled={loading || !selectedIngredient}
            >
                {console.log(availableUnits)}
                {availableUnits.map((unit) => (
                    <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                    </MenuItem>
                ))}
            </TextField>

            {onRemove && (
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => onRemove(index)}
                    disabled={loading}
                >
                    Удалить
                </Button>
            )}
        </Box>
    );
};

export default IngredientRow;