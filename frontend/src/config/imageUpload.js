// Image upload configuration constants
export const IMAGE_UPLOAD_CONFIG = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_DISPLAY: '10MB',
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  ALLOWED_MIME_TYPES_STRING: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  
  // Database storage info
  STORAGE_TYPE: 'Database (LONGBLOB)',
  MAX_DATABASE_SIZE: 'Up to 4GB per image (MySQL LONGBLOB)',
  
  // Validation messages
  VALIDATION_MESSAGES: {
    SIZE_ERROR: (filename, maxSize) => `${filename} is too large. Maximum size is ${maxSize}.`,
    TYPE_ERROR: (filename) => `${filename} has unsupported format. Use JPG, PNG, GIF, or WebP.`,
    UPLOAD_SUCCESS: 'Image uploaded successfully!',
    UPLOAD_ERROR: 'Failed to upload image. Please try again.'
  }
};

// Helper functions for validation
export const validateImageFile = (file) => {
  const errors = [];
  
  if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
    errors.push(IMAGE_UPLOAD_CONFIG.VALIDATION_MESSAGES.SIZE_ERROR(
      file.name, 
      IMAGE_UPLOAD_CONFIG.MAX_SIZE_DISPLAY
    ));
  }
  
  if (!IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    errors.push(IMAGE_UPLOAD_CONFIG.VALIDATION_MESSAGES.TYPE_ERROR(file.name));
  }
  
  return errors;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};