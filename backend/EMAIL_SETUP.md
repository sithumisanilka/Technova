# Email Service Setup Guide

This guide explains how to set up and configure the email service for the SOLEKTA e-commerce application.

## Features

- ✅ Order confirmation emails when customers checkout
- ✅ Order status update emails when order status changes
- ✅ Beautiful HTML email templates with Thymeleaf
- ✅ Fallback simple HTML templates
- ✅ Configurable SMTP settings
- ✅ Test endpoints for email functionality

## Configuration

### 1. Email Provider Setup

#### Gmail Setup (Recommended for Development)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Update `application.properties`:
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-16-character-app-password
   ```

#### Outlook/Hotmail Setup

```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

#### Yahoo Setup

```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

### 2. Environment Variables (Recommended for Production)

Set these environment variables instead of hardcoding credentials:

```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### 3. Application Properties

The email configuration is already set up in `application.properties`:

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Email Template Configuration
app.email.order-confirmation.subject=Order Confirmation - SOLEKTA
app.email.from-name=SOLEKTA Store
```

## Testing Email Functionality

### 1. Test Endpoints

Use these endpoints to test email functionality:

#### Test Order Confirmation Email

```bash
POST /api/test/email/send-order-confirmation
Content-Type: application/json

{
  "email": "test@example.com"
}
```

#### Test Status Update Email

```bash
POST /api/test/email/send-status-update
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 2. Using cURL

```bash
# Test order confirmation email
curl -X POST "http://localhost:8081/api/test/email/send-order-confirmation?email=your-test-email@gmail.com"

# Test status update email
curl -X POST "http://localhost:8081/api/test/email/send-status-update?email=your-test-email@gmail.com"
```

## Email Templates

### Template Locations

- Order Confirmation: `src/main/resources/templates/email/order-confirmation.html`
- Status Update: `src/main/resources/templates/email/order-status-update.html`

### Template Features

- Responsive HTML design
- Professional styling
- Order details with itemized breakdown
- Shipping information
- Payment details
- Status badges with color coding
- Fallback simple HTML if Thymeleaf fails

## Integration with Checkout Process

The email service is automatically integrated with the checkout process:

1. **Order Creation**: When a customer completes checkout, an order confirmation email is sent automatically
2. **Status Updates**: When order status changes (via admin panel or API), status update emails are sent
3. **Error Handling**: Email failures don't break the order process - errors are logged but order creation continues

### Code Integration Points

#### OrderService.java

```java
// Send order confirmation email after successful order creation
try {
    OrderDTO orderDTO = convertToDTO(order);
    String customerEmail = "customer" + checkoutRequest.getCustomerId() + "@example.com";
    emailService.sendOrderConfirmationEmail(customerEmail, orderDTO);
} catch (Exception e) {
    log.error("Failed to send order confirmation email: {}", e.getMessage());
    // Don't fail order creation if email fails
}
```

#### EmailService.java

```java
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendOrderConfirmationEmail(String customerEmail, OrderDTO order) {
        // Implementation details...
    }
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**

   - Check if 2FA is enabled and app password is correct
   - Verify SMTP credentials

2. **Connection Timeout**

   - Check firewall settings
   - Verify SMTP host and port

3. **Template Not Found**

   - Ensure Thymeleaf templates are in correct directory
   - Check template file names match exactly

4. **Email Not Received**
   - Check spam/junk folder
   - Verify recipient email address
   - Check SMTP provider limits

### Debug Mode

Enable debug mode in `application.properties`:

```properties
spring.mail.properties.mail.debug=true
logging.level.com.solekta.solekta.service.EmailService=DEBUG
```

### Logs to Check

Look for these log messages:

- `Order confirmation email sent successfully`
- `Failed to send order confirmation email`
- `Order status update email sent successfully`

## Production Considerations

1. **Use Environment Variables**: Never hardcode email credentials
2. **Rate Limiting**: Implement rate limiting for email sending
3. **Queue System**: Consider using a message queue for high-volume email sending
4. **Monitoring**: Set up monitoring for email delivery success rates
5. **Backup SMTP**: Configure backup SMTP providers
6. **Email Validation**: Validate email addresses before sending

## Security Best Practices

1. **App Passwords**: Use app-specific passwords instead of main account passwords
2. **Environment Variables**: Store credentials in environment variables
3. **HTTPS**: Use secure SMTP connections (TLS/SSL)
4. **Input Validation**: Validate all email inputs
5. **Rate Limiting**: Prevent email spam/abuse

## Future Enhancements

- [ ] Email queue system with Redis/RabbitMQ
- [ ] Email templates management UI
- [ ] Email analytics and tracking
- [ ] Multi-language email templates
- [ ] Email preferences for customers
- [ ] Automated email campaigns
- [ ] Email delivery status tracking
