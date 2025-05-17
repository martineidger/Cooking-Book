// Создаем обертку для безопасной работы
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('Ошибка чтения из localStorage', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Ошибка записи в localStorage', e);
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

export default storage;