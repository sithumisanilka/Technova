export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

export const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTime = (date, time) => {
    return `${formatDate(date)} at ${formatTime(time)}`;
};

export const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const getMinDate = () => {
    return getTodayDate();
};
