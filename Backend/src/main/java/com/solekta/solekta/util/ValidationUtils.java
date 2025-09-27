package com.solekta.solekta.util;

import java.util.regex.Pattern;

public class ValidationUtils {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^(\\+94|0)[0-9]{9}$");

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final Pattern POSTAL_CODE_PATTERN = Pattern.compile("^[0-9]{5}$");

    public static boolean isValidPhoneNumber(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPostalCode(String postalCode) {
        return postalCode != null && POSTAL_CODE_PATTERN.matcher(postalCode).matches();
    }

    public static boolean isValidCardNumber(String cardNumber) {
        // Simple card number validation (Luhn algorithm could be implemented)
        return cardNumber != null &&
                cardNumber.replaceAll("\\s+", "").matches("^[0-9]{16}$");
    }

    public static boolean isValidCVV(String cvv) {
        return cvv != null && cvv.matches("^[0-9]{3,4}$");
    }

    public static String sanitizeString(String input) {
        if (input == null) {
            return null;
        }
        return input.trim().replaceAll("[<>\"']", "");
    }
}
