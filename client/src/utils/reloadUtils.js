// src/utils/reloadUtils.ts
export const reloadWithDelay = (delay = 100) => {
    storage.set('tempData', { saving: true });
    setTimeout(() => window.location.reload(), delay);
};
