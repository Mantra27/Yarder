# Yarder - Yard Management System 

This project provides a login page for the Yard Management System, allowing users to sign up using their email and password. Additionally, users can also use their Google account to log in.

## Getting Started
## Model is yet to be trained

To run the project locally, follow these steps:

1. Clone the repository to your local machine.
2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env

3. ``
npm run-script run
``
4. open http://localhost:3000

## API Integration

### Public APIs

We provide access to public APIs that allow you to interact with the Yard Management System:

- **GET /local:**
  This endpoint allows you to send login credentials to the backend for authentication. Note that this API is for demonstration purposes and might not be suitable for production use, especially for sending sensitive data like passwords.

### Paid APIs - AI Model Integration

We also offer paid APIs that leverage AI models for enhanced features in the Yard Management System:

- **POST /ai/inference:**
  This endpoint lets you submit container data to an AI model for predictions and insights. The AI model will analyze the data and provide recommendations based on historical patterns.

## Support

If you encounter any issues or have questions, please reach out to our support team at support@yardmanagementsystem.com.

## License

This project is licensed under the [MIT License](LICENSE).
