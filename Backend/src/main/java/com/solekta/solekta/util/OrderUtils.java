package com.solekta.solekta.util;

import com.solekta.solekta.model.Order;
import com.solekta.solekta.model.Order.OrderStatus;

import java.math.BigDecimal;
import java.util.Random;

public class OrderUtils {

    private static final Random random = new Random();

    public static String generateOrderNumber() {
        long timestamp = System.currentTimeMillis();
        int randomNum = random.nextInt(1000);
        return String.format("ORD-%d%03d", timestamp, randomNum);
    }

    public static String generatePaymentNumber() {
        long timestamp = System.currentTimeMillis();
        int randomNum = random.nextInt(1000);
        return String.format("PAY-%d%03d", timestamp, randomNum);
    }

    public static BigDecimal calculateTax(BigDecimal subtotal, BigDecimal taxRate) {
        if (subtotal == null || taxRate == null) {
            return BigDecimal.ZERO;
        }
        return subtotal.multiply(taxRate).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateShippingCost(BigDecimal subtotal, String city) {
        // Simple shipping cost calculation based on city
        BigDecimal baseCost = BigDecimal.valueOf(500.00); // Base shipping cost

        if ("Colombo".equalsIgnoreCase(city)) {
            return baseCost.multiply(BigDecimal.valueOf(0.8)); // 20% discount for Colombo
        } else if ("Avissawella".equalsIgnoreCase(city)) {
            return baseCost; // Standard rate for local city
        } else {
            return baseCost.multiply(BigDecimal.valueOf(1.5)); // 50% extra for other cities
        }
    }

    public static boolean canCancelOrder(Order order) {
        return order.getStatus() == OrderStatus.PENDING ||
                order.getStatus() == OrderStatus.CONFIRMED;
    }

    public static boolean canRefundOrder(Order order) {
        return order.getStatus() == OrderStatus.DELIVERED;
    }

    public static String formatOrderStatus(OrderStatus status) {
        switch (status) {
            case PENDING:
                return "Pending Confirmation";
            case CONFIRMED:
                return "Order Confirmed";
            case PROCESSING:
                return "Processing";
            case SHIPPED:
                return "Shipped";
            case DELIVERED:
                return "Delivered";
            case CANCELLED:
                return "Cancelled";
            case REFUNDED:
                return "Refunded";
            default:
                return status.toString();
        }
    }
}
