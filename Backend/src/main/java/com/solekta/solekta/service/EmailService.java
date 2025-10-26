package com.solekta.solekta.service;

import com.solekta.solekta.dto.OrderDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

        private final JavaMailSender mailSender;
        private final TemplateEngine templateEngine;

        @Value("${spring.mail.username}")
        private String fromEmail;

        @Value("${app.email.order-confirmation.subject:Order Confirmation - SOLEKTA}")
        private String orderConfirmationSubject;

        @Value("${app.email.from-name:SOLEKTA Store}")
        private String fromName;

        @Value("${app.email.admin.email:admin@solekta.com}")
        private String adminEmail;

        @Value("${app.email.admin.order-notification.subject:New Order Received - SOLEKTA Store}")
        private String adminOrderNotificationSubject;

        @Value("${app.email.admin.order-notification.enabled:true}")
        private boolean adminNotificationsEnabled;

        @Value("${app.email.enabled:true}")
        private boolean emailEnabled;

        @Value("${app.email.fallback.enabled:true}")
        private boolean emailFallbackEnabled;

        @Value("${app.email.mock.enabled:true}")
        private boolean mockEmailEnabled;

        /**
         * Send order confirmation email to customer
         */
        public void sendOrderConfirmationEmail(String customerEmail, OrderDTO order) {
                if (!emailEnabled) {
                        log.info("Email service is disabled, skipping order confirmation email for order {}",
                                        order.getOrderNumber());
                        return;
                }

                // Use mock email service if enabled (for development/testing)
                if (mockEmailEnabled) {
                        log.info("MOCK EMAIL: Order confirmation email would be sent to {} for order {}",
                                        customerEmail, order.getOrderNumber());
                        log.info("MOCK EMAIL: Subject: {}", orderConfirmationSubject + " #" + order.getOrderNumber());
                        log.info("MOCK EMAIL: Order total: {}", order.getTotalAmount());
                        log.info("MOCK EMAIL: Customer: {} ({})", order.getShippingName(), customerEmail);
                        log.info("MOCK EMAIL: ✅ Email sent successfully (MOCK)");
                        return;
                }

                try {
                        log.info("Attempting to send order confirmation email to {} for order {}",
                                        customerEmail, order.getOrderNumber());

                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                        // Set email details
                        helper.setFrom(fromEmail, fromName);
                        helper.setTo(customerEmail);
                        helper.setSubject(orderConfirmationSubject + " #" + order.getOrderNumber());

                        // Create email content using Thymeleaf template or fallback
                        String htmlContent;
                        try {
                                htmlContent = createOrderConfirmationEmailContent(order);
                        } catch (Exception e) {
                                log.warn("Failed to use Thymeleaf template, using fallback: {}", e.getMessage());
                                htmlContent = createSimpleOrderConfirmationContent(order);
                        }
                        helper.setText(htmlContent, true);

                        // Send email with retry logic
                        boolean emailSent = false;
                        int maxRetries = 3;
                        for (int attempt = 1; attempt <= maxRetries && !emailSent; attempt++) {
                                try {
                                        log.info("Email send attempt {} for order {}", attempt, order.getOrderNumber());
                                        mailSender.send(message);
                                        emailSent = true;
                                        log.info("Order confirmation email sent successfully to {} for order {} on attempt {}",
                                                        customerEmail, order.getOrderNumber(), attempt);
                                } catch (Exception retryException) {
                                        log.warn("Email send attempt {} failed for order {}: {}",
                                                        attempt, order.getOrderNumber(), retryException.getMessage());
                                        if (attempt < maxRetries) {
                                                Thread.sleep(2000 * attempt); // Progressive delay
                                        } else {
                                                throw retryException;
                                        }
                                }
                        }

                } catch (MessagingException e) {
                        log.error("Failed to send order confirmation email to {} for order {}: {}",
                                        customerEmail, order.getOrderNumber(), e.getMessage(), e);

                        if (emailFallbackEnabled) {
                                log.info("Email fallback enabled - continuing with order processing despite email failure");
                                // Don't throw exception - allow order to continue
                        } else {
                                throw new RuntimeException("Failed to send order confirmation email", e);
                        }
                } catch (Exception e) {
                        log.error("Unexpected error sending order confirmation email to {} for order {}: {}",
                                        customerEmail, order.getOrderNumber(), e.getMessage(), e);

                        if (emailFallbackEnabled) {
                                log.info("Email fallback enabled - continuing with order processing despite email failure");
                                // Don't throw exception - allow order to continue
                        } else {
                                throw new RuntimeException("Failed to send order confirmation email", e);
                        }
                }
        }

        /**
         * Send order status update email to customer
         */
        public void sendOrderStatusUpdateEmail(String customerEmail, OrderDTO order, String oldStatus,
                        String newStatus) {
                try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                        helper.setFrom(fromEmail, fromName);
                        helper.setTo(customerEmail);
                        helper.setSubject("Order Status Update - Order #" + order.getOrderNumber());

                        String htmlContent = createOrderStatusUpdateEmailContent(order, oldStatus, newStatus);
                        helper.setText(htmlContent, true);

                        mailSender.send(message);
                        log.info("Order status update email sent successfully to {} for order {}",
                                        customerEmail, order.getOrderNumber());

                } catch (MessagingException e) {
                        log.error("Failed to send order status update email to {} for order {}: {}",
                                        customerEmail, order.getOrderNumber(), e.getMessage(), e);
                        // Don't throw exception for status updates - these are not critical
                } catch (Exception e) {
                        log.error("Unexpected error sending order status update email to {} for order {}: {}",
                                        customerEmail, order.getOrderNumber(), e.getMessage(), e);
                }
        }

        /**
         * Send admin notification email for new orders
         */
        public void sendAdminOrderNotification(OrderDTO order) {
                if (!adminNotificationsEnabled) {
                        log.debug("Admin notifications are disabled, skipping admin notification for order {}",
                                        order.getOrderNumber());
                        return;
                }

                // Use mock email service if enabled (for development/testing)
                if (mockEmailEnabled) {
                        log.info("MOCK EMAIL: Admin notification email would be sent to {} for order {}",
                                        adminEmail, order.getOrderNumber());
                        log.info("MOCK EMAIL: Subject: {}",
                                        adminOrderNotificationSubject + " #" + order.getOrderNumber());
                        log.info("MOCK EMAIL: Customer: {} ({})", order.getShippingName(), order.getCustomerEmail());
                        log.info("MOCK EMAIL: Order total: {}", order.getTotalAmount());
                        log.info("MOCK EMAIL: ✅ Admin notification sent successfully (MOCK)");
                        return;
                }

                try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                        helper.setFrom(fromEmail, fromName);
                        helper.setTo(adminEmail);
                        helper.setSubject(adminOrderNotificationSubject + " #" + order.getOrderNumber());

                        // Create email content using Thymeleaf template or fallback
                        String htmlContent;
                        try {
                                htmlContent = createAdminOrderNotificationContent(order);
                        } catch (Exception e) {
                                log.warn("Failed to use Thymeleaf template for admin notification, using fallback: {}",
                                                e.getMessage());
                                htmlContent = createSimpleAdminNotificationContent(order);
                        }
                        helper.setText(htmlContent, true);

                        mailSender.send(message);
                        log.info("Admin order notification email sent successfully for order {} to {}",
                                        order.getOrderNumber(), adminEmail);

                } catch (MessagingException e) {
                        log.error("Failed to send admin order notification email for order {}: {}",
                                        order.getOrderNumber(), e.getMessage(), e);
                        // Don't throw exception - admin notifications shouldn't fail order creation
                } catch (Exception e) {
                        log.error("Unexpected error sending admin order notification email for order {}: {}",
                                        order.getOrderNumber(), e.getMessage(), e);
                }
        }

        /**
         * Create HTML content for admin order notification email
         */
        private String createOrderConfirmationEmailContent(OrderDTO order) {
                Context context = new Context();
                context.setVariable("order", order);
                context.setVariable("orderNumber", order.getOrderNumber());
                context.setVariable("customerName", order.getShippingName());
                context.setVariable("orderDate",
                                order.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));
                context.setVariable("subtotal", formatCurrency(order.getSubtotal()));
                context.setVariable("tax", formatCurrency(order.getTax()));
                context.setVariable("shippingCost", formatCurrency(order.getShippingCost()));
                context.setVariable("totalAmount", formatCurrency(order.getTotalAmount()));
                context.setVariable("shippingAddress", formatShippingAddress(order));
                context.setVariable("paymentMethod", formatPaymentMethod(
                                order.getPayment() != null ? order.getPayment().getMethod().toString() : "UNKNOWN"));
                context.setVariable("orderItems", order.getOrderItems());

                return templateEngine.process("order-confirmation", context);
        }

        /**
         * Create HTML content for order status update email
         */
        private String createOrderStatusUpdateEmailContent(OrderDTO order, String oldStatus, String newStatus) {
                Context context = new Context();
                context.setVariable("order", order);
                context.setVariable("orderNumber", order.getOrderNumber());
                context.setVariable("customerName", order.getShippingName());
                context.setVariable("oldStatus", oldStatus);
                context.setVariable("newStatus", newStatus);
                context.setVariable("updateDate",
                                order.getUpdatedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));

                return templateEngine.process("order-status-update", context);
        }

        /**
         * Create HTML content for admin order notification email
         */
        private String createAdminOrderNotificationContent(OrderDTO order) {
                Context context = new Context();
                context.setVariable("order", order);
                context.setVariable("orderNumber", order.getOrderNumber());
                context.setVariable("customerName", order.getShippingName());
                context.setVariable("customerEmail", order.getCustomerEmail());
                context.setVariable("orderDate",
                                order.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));
                context.setVariable("subtotal", formatCurrency(order.getSubtotal()));
                context.setVariable("tax", formatCurrency(order.getTax()));
                context.setVariable("shippingCost", formatCurrency(order.getShippingCost()));
                context.setVariable("totalAmount", formatCurrency(order.getTotalAmount()));
                context.setVariable("shippingAddress", formatShippingAddress(order));
                context.setVariable("paymentMethod", formatPaymentMethod(
                                order.getPayment() != null ? order.getPayment().getMethod().toString() : "UNKNOWN"));
                context.setVariable("orderItems", order.getOrderItems());
                context.setVariable("status", order.getStatus());

                return templateEngine.process("admin-order-notification", context);
        }

        /**
         * Format currency for display
         */
        private String formatCurrency(BigDecimal amount) {
                return String.format("$%.2f", amount);
        }

        /**
         * Format shipping address for display
         */
        private String formatShippingAddress(OrderDTO order) {
                return String.format("%s<br>%s<br>%s, %s<br>%s",
                                order.getShippingName(),
                                order.getShippingAddress(),
                                order.getShippingCity(),
                                order.getShippingPostalCode(),
                                order.getShippingPhone());
        }

        /**
         * Format payment method for display
         */
        private String formatPaymentMethod(String method) {
                switch (method.toUpperCase()) {
                        case "CREDIT_CARD":
                                return "Credit Card";
                        case "DEBIT_CARD":
                                return "Debit Card";
                        case "BANK_TRANSFER":
                                return "Bank Transfer";
                        case "CASH_ON_DELIVERY":
                                return "Cash on Delivery";
                        case "DIGITAL_WALLET":
                                return "Digital Wallet";
                        default:
                                return method;
                }
        }

        /**
         * Simple email template for order confirmation (fallback if Thymeleaf is not
         * available)
         */
        private String createSimpleOrderConfirmationContent(OrderDTO order) {
                StringBuilder content = new StringBuilder();
                content.append("<html><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>");
                content.append("<div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px;'>");

                // Header
                content.append("<h1 style='color: #333; text-align: center;'>Order Confirmation</h1>");
                content.append("<p>Dear ").append(order.getShippingName()).append(",</p>");
                content.append("<p>Thank you for your order! We're excited to process your purchase.</p>");

                // Order Details
                content.append("<h2 style='color: #007bff;'>Order Details</h2>");
                content.append("<table style='width: 100%; border-collapse: collapse;'>");
                content.append("<tr><td><strong>Order Number:</strong></td><td>").append(order.getOrderNumber())
                                .append("</td></tr>");
                content.append("<tr><td><strong>Order Date:</strong></td><td>")
                                .append(order.getCreatedAt()
                                                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")))
                                .append("</td></tr>");
                content.append("<tr><td><strong>Status:</strong></td><td>").append(order.getStatus())
                                .append("</td></tr>");
                content.append("</table>");

                // Order Items
                content.append("<h2 style='color: #007bff;'>Items Ordered</h2>");
                content.append("<table style='width: 100%; border-collapse: collapse; border: 1px solid #ddd;'>");
                content.append("<tr style='background-color: #f8f9fa;'>");
                content.append("<th style='padding: 10px; text-align: left; border: 1px solid #ddd;'>Product</th>");
                content.append("<th style='padding: 10px; text-align: left; border: 1px solid #ddd;'>Quantity</th>");
                content.append("<th style='padding: 10px; text-align: right; border: 1px solid #ddd;'>Price</th>");
                content.append("</tr>");

                for (var item : order.getOrderItems()) {
                        content.append("<tr>");
                        content.append("<td style='padding: 10px; border: 1px solid #ddd;'>")
                                        .append(item.getProductName())
                                        .append("</td>");
                        content.append("<td style='padding: 10px; border: 1px solid #ddd;'>").append(item.getQuantity())
                                        .append("</td>");
                        content.append("<td style='padding: 10px; text-align: right; border: 1px solid #ddd;'>")
                                        .append(formatCurrency(item.getTotalPrice())).append("</td>");
                        content.append("</tr>");
                }
                content.append("</table>");

                // Price Summary
                content.append("<h2 style='color: #007bff;'>Price Summary</h2>");
                content.append("<table style='width: 100%; border-collapse: collapse;'>");
                content.append("<tr><td>Subtotal:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getSubtotal())).append("</td></tr>");
                content.append("<tr><td>Tax:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getTax()))
                                .append("</td></tr>");
                content.append("<tr><td>Shipping:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getShippingCost())).append("</td></tr>");
                content.append(
                                "<tr style='font-weight: bold; border-top: 2px solid #333;'><td>Total:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getTotalAmount())).append("</td></tr>");
                content.append("</table>");

                // Shipping Information
                content.append("<h2 style='color: #007bff;'>Shipping Information</h2>");
                content.append("<p>").append(formatShippingAddress(order).replace("<br>", "<br>")).append("</p>");

                // Footer
                content.append("<hr style='margin: 20px 0;'>");
                content.append("<p style='text-align: center; color: #666;'>Thank you for shopping with SOLEKTA!</p>");
                content.append(
                                "<p style='text-align: center; color: #666;'>If you have any questions, please contact our customer service.</p>");

                content.append("</div></body></html>");

                return content.toString();
        }

        /**
         * Simple email template for admin order notification (fallback if Thymeleaf is
         * not available)
         */
        private String createSimpleAdminNotificationContent(OrderDTO order) {
                StringBuilder content = new StringBuilder();
                content.append("<html><body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>");
                content.append("<div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px;'>");

                // Header
                content.append("<h1 style='color: #dc3545; text-align: center;'>🚨 New Order Alert</h1>");
                content.append(
                                "<p><strong>Attention Admin:</strong> A new order has been received and requires processing.</p>");

                // Order Details
                content.append("<h2 style='color: #007bff;'>Order Information</h2>");
                content.append("<table style='width: 100%; border-collapse: collapse;'>");
                content.append("<tr><td><strong>Order Number:</strong></td><td>").append(order.getOrderNumber())
                                .append("</td></tr>");
                content.append("<tr><td><strong>Customer Name:</strong></td><td>").append(order.getShippingName())
                                .append("</td></tr>");
                content.append("<tr><td><strong>Customer Email:</strong></td><td>").append(order.getCustomerEmail())
                                .append("</td></tr>");
                content.append("<tr><td><strong>Order Date:</strong></td><td>")
                                .append(order.getCreatedAt()
                                                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")))
                                .append("</td></tr>");
                content.append("<tr><td><strong>Status:</strong></td><td>").append(order.getStatus())
                                .append("</td></tr>");
                content.append("<tr><td><strong>Total Amount:</strong></td><td>")
                                .append(formatCurrency(order.getTotalAmount()))
                                .append("</td></tr>");
                content.append("</table>");

                // Order Items
                content.append("<h2 style='color: #007bff;'>Items Ordered</h2>");
                content.append("<table style='width: 100%; border-collapse: collapse; border: 1px solid #ddd;'>");
                content.append("<tr style='background-color: #f8f9fa;'>");
                content.append("<th style='padding: 10px; text-align: left; border: 1px solid #ddd;'>Product</th>");
                content.append("<th style='padding: 10px; text-align: left; border: 1px solid #ddd;'>Quantity</th>");
                content.append("<th style='padding: 10px; text-align: right; border: 1px solid #ddd;'>Price</th>");
                content.append("</tr>");

                for (var item : order.getOrderItems()) {
                        content.append("<tr>");
                        content.append("<td style='padding: 10px; border: 1px solid #ddd;'>")
                                        .append(item.getProductName())
                                        .append("</td>");
                        content.append("<td style='padding: 10px; border: 1px solid #ddd;'>").append(item.getQuantity())
                                        .append("</td>");
                        content.append("<td style='padding: 10px; text-align: right; border: 1px solid #ddd;'>")
                                        .append(formatCurrency(item.getTotalPrice())).append("</td>");
                        content.append("</tr>");
                }
                content.append("</table>");

                // Price Summary
                content.append("<h2 style='color: #007bff;'>Price Summary</h2>");
                content.append("<table style='width: 100%; border-collapse: collapse;'>");
                content.append("<tr><td>Subtotal:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getSubtotal())).append("</td></tr>");
                content.append("<tr><td>Tax:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getTax()))
                                .append("</td></tr>");
                content.append("<tr><td>Shipping:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getShippingCost())).append("</td></tr>");
                content.append(
                                "<tr style='font-weight: bold; border-top: 2px solid #333;'><td>Total:</td><td style='text-align: right;'>")
                                .append(formatCurrency(order.getTotalAmount())).append("</td></tr>");
                content.append("</table>");

                // Shipping Information
                content.append("<h2 style='color: #007bff;'>Shipping Information</h2>");
                content.append("<p>").append(formatShippingAddress(order).replace("<br>", "<br>")).append("</p>");

                // Action Required
                content.append(
                                "<div style='background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;'>");
                content.append("<h3 style='color: #856404; margin-top: 0;'>⚠️ Action Required</h3>");
                content.append("<ul>");
                content.append("<li>Review the order details above</li>");
                content.append("<li>Verify payment status</li>");
                content.append("<li>Update order status to 'CONFIRMED' when ready to process</li>");
                content.append("<li>Prepare items for shipping</li>");
                content.append("</ul>");
                content.append("</div>");

                // Footer
                content.append("<hr style='margin: 20px 0;'>");
                content.append(
                                "<p style='text-align: center; color: #666;'>This is an automated notification from SOLEKTA Store Management System</p>");
                content.append(
                                "<p style='text-align: center; color: #666;'>Please log into the admin panel to manage this order.</p>");

                content.append("</div></body></html>");

                return content.toString();
        }
}
