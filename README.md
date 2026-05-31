# GenAI Wellness App

GenAI Wellness App is a full-stack web application designed to support teenagers with emotional wellbeing, personal growth, mood reflection, and fitness recommendations. The app combines a React frontend with a Flask backend, Azure OpenAI chatbot support, Azure Cosmos DB storage, and user authentication.

## Overview

The project provides an AI-powered mentor experience where users can sign up, sign in, chat with a supportive AI mentor, track mood-related information, and explore workouts or wellness activities. The chatbot is designed to respond in a warm and encouraging way, helping users reflect on emotions, stress, self-confidence, relationships, and motivation.

This project was built to explore how generative AI can be used in a web application to provide personalized emotional support and wellness guidance.

> Note: This application is for educational and wellness-support purposes only. It is not a replacement for professional medical, psychological, or emergency support.

## Features

* User sign up and sign in
* Password hashing using bcrypt
* React-based frontend interface
* Flask backend API
* AI chatbot powered by Azure OpenAI
* Chat history storage using Azure Cosmos DB
* Mood tracking support
* Workout and fitness recommendation features
* CORS configuration for frontend-backend communication
* Cloud database integration
* Multiple frontend pages for dashboard, chatbot, mood tracking, settings, and fitness

## Tech Stack

| Area               | Technologies              |
| ------------------ | ------------------------- |
| Frontend           | React, JavaScript, CSS    |
| Backend            | Python, Flask             |
| AI                 | Azure OpenAI              |
| Database           | Azure Cosmos DB           |
| Authentication     | bcrypt, Flask sessions    |
| API communication  | REST API, Flask-CORS      |
| Deployment support | Azure-ready configuration |

## Repository Structure

```text
GenAI/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── src/
│   ├── pages/
│   │   ├── Chatbot.js
│   │   ├── Dashboard.js
│   │   ├── Home.js
│   │   ├── MoodTracker.js
│   │   ├── Recommendations.js
│   │   ├── Settings.js
│   │   ├── SignIn.js
│   │   ├── SignUp.js
│   │   ├── categories.js
│   │   ├── fitness.js
│   │   ├── fitnessFull.js
│   │   └── workout.js
│   ├── services/
│   ├── styles/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   └── index.js
└── README.md
```

## Main Modules

### AI Mentor Chatbot

The chatbot uses Azure OpenAI to provide supportive responses focused on emotional wellbeing, personal growth, stress, confidence, motivation, and healthy habits.

The chatbot is designed to:

* Respond with empathy
* Give step-by-step guidance
* Avoid overwhelming the user
* Encourage reflection
* Recommend wellness or fitness activities when appropriate

### Authentication

The backend includes user registration and login functionality. Passwords are hashed using bcrypt before being stored.

### Mood Tracking

The app includes mood tracking features that allow users to reflect on their emotional state and connect their mood with wellness activities.

### Fitness and Workout Support

The app includes workout-related pages and API routes. Users can explore different wellness activities such as yoga, cardio, stretching, meditation, and strength training.

### Cloud Database

Azure Cosmos DB is used to store user data, chat data, workout data, and related application information.

## Backend Setup

1. Go into the backend folder:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

On Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

4. Install backend requirements:

```bash
pip install -r requirements.txt
```

5. Create a `.env` file inside the `backend/` folder:

```text
FLASK_SECRET_KEY=your_secret_key
COSMOS_DB_URL=your_cosmos_db_url
COSMOS_DB_KEY=your_cosmos_db_key
COSMOS_DB_DATABASE=your_database_name
COSMOS_DB_CONTAINER=your_user_container_name
COSMOS_CHAT_CONTAINER=your_chat_container_name
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_KEY=your_azure_openai_key
```

6. Run the Flask backend:

```bash
python app.py
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

1. From the project root, install frontend dependencies:

```bash
npm install
```

2. Start the React development server:

```bash
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

## Environment Variables

This project uses private API keys and database credentials. These should never be uploaded to GitHub.

Required backend environment variables include:

```text
FLASK_SECRET_KEY
COSMOS_DB_URL
COSMOS_DB_KEY
COSMOS_DB_DATABASE
COSMOS_DB_CONTAINER
COSMOS_CHAT_CONTAINER
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_KEY
```

## API Routes

| Route          | Method | Purpose                                 |
| -------------- | ------ | --------------------------------------- |
| `/`            | GET    | Check if the Flask backend is running   |
| `/signup`      | POST   | Create a new user account               |
| `/signin`      | POST   | Log in an existing user                 |
| `/update_name` | POST   | Update the authenticated user's name    |
| `/chat`        | POST   | Send a message to the AI mentor chatbot |
| `/workouts`    | GET    | Retrieve workout data                   |
| `/workouts`    | POST   | Add workout data                        |
| `/Users`       | GET    | Retrieve user records                   |
| `/Users`       | POST   | Add user records                        |

## Safety Note

This project is designed for educational use and general wellbeing support. It should not be used as a substitute for therapy, counseling, medical treatment, crisis support, or professional advice.

If a user is in immediate danger or experiencing a crisis, they should contact emergency services or a qualified professional.

## What I Learned

Through this project, I practiced:

* Building a full-stack web application
* Creating a React frontend with multiple pages
* Building Flask API routes
* Connecting a frontend to a backend API
* Using Azure OpenAI in an application
* Working with Azure Cosmos DB
* Implementing user authentication
* Hashing passwords securely with bcrypt
* Managing environment variables
* Designing AI features for emotional support and wellbeing

## Future Improvements

* Add stronger input validation
* Improve session handling and authentication security
* Add JWT-based authentication
* Add crisis detection and safe escalation messaging
* Improve chatbot guardrails
* Add loading states and error messages in the frontend
* Add unit tests for backend routes
* Add frontend component tests
* Improve mobile responsiveness
* Add deployment instructions
* Add screenshots and a short demo video

## Author

Created by [Kakkooo02](https://github.com/Kakkooo02)
