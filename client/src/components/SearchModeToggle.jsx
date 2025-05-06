import React from 'react';
import {
    Box,
    Typography,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';

const SearchModeToggle = ({ searchMode, onSearchModeChange }) => {
    return (
        <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
                value={searchMode}
                exclusive
                onChange={onSearchModeChange}
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
    );
};

export default SearchModeToggle;