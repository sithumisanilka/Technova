export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateBookingForm = (formData) => {
    const errors = {};
    
    if (!formData.customerName?.trim()) {
        errors.customerName = 'Name is required';
    }
    
    if (!formData.customerEmail || !validateEmail(formData.customerEmail)) {
        errors.customerEmail = 'Valid email is required';
    }
    
    if (!formData.customerPhone || !validatePhone(formData.customerPhone)) {
        errors.customerPhone = 'Valid 10-digit phone number is required';
    }
    
    if (!formData.serviceId) {
        errors.serviceId = 'Please select a service';
    }
    
    if (!formData.appointmentDate) {
        errors.appointmentDate = 'Date is required';
    }
    
    if (!formData.appointmentTime) {
        errors.appointmentTime = 'Time is required';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


