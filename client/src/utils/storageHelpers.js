// src/utils/storageHelpers.ts
export const prepareReload = () => {
    const data = storage.get('importantData');
    sessionStorage.setItem('backupData', JSON.stringify(data));
};

export const restoreData = () => {
    const backup = sessionStorage.getItem('backupData');
    if (backup) {
        storage.set('importantData', JSON.parse(backup));
        sessionStorage.removeItem('backupData');
    }
};
