import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="not-found-page"
        >
            <div className="not-found-content">
                <Typography
                    variant="h1"
                    className="error-code"
                    component={motion.h1}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    404
                </Typography>
                <Typography
                    variant="h4"
                    className="error-message"
                    component={motion.h4}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Упс! Страница не найдена
                </Typography>
                <Typography
                    variant="body1"
                    className="error-description"
                    component={motion.p}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Возможно, она была удалена или перемещена
                </Typography>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        color="primary"
                        size="large"
                        className="home-button"
                    >
                        Вернуться на главную
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default NotFoundPage;