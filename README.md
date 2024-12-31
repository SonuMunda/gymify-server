# Gymify Server

## Description
Gymify Server is the backend API for the Gymify platform, designed to facilitate user interactions, competition tracking, and gym-related functionalities. This project uses Node.js, TypeScript, Express, and MongoDB.

## Prerequisites
Ensure you have the following installed:

- Node.js (v16 or above)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Google Developer Console account for YouTube API credentials

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo-name/gymify-server.git
cd gymify-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File
Create a `.env` file in the root directory and populate it with the following variables:

```env
NODE_ENV="development"
CURRENT_PROJECT="gymify_server"
PORT=8000
CONNECTION_URL="<your-mongodb-connection-url>"
JWT_SECRET="<your-secret-key>"
ACCESS_TOKEN_EXPIRATION_MINUTES="10080"
REFRESH_TOKEN_EXPIRATION_DAYS="30"

GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

YOUTUBE_CLIENT_ID="<your-youtube-client-id>"
YOUTUBE_CLIENT_SECRET="<your-youtube-client-secret>"
YOUTUBE_REDIRECT_URI="http://localhost:8000/v1/youtube/callback"
```
Replace `<your-mongodb-connection-url>`, `<your-secret-key>`, `<your-google-client-id>`, and `<your-google-client-secret>` with your actual credentials.

### 4. Build the Project
```bash
npm run build
```

### 5. Start the Server
#### For Development:
```bash
npm run dev
```

#### For Production:
```bash
npm start
```

## Scripts
- `npm start`: Start the server in production mode.
- `npm run build`: Compile TypeScript into JavaScript (output is in the `dist` folder).
- `npm run dev`: Start the server in development mode using `nodemon` and `tsx`.

## Folder Structure
```

|-- config
|-- controllers
|-- middlewares
|-- models
|-- routes
|-- services
|-- types
|-- validations
|-- utils
|-- dist
|-- .env
|-- package.json
|-- package-lock.json
|-- .gitignore
|-- tsconfig.json
|-- README.md
|-- nodemon.json
|-- app.ts
|-- index.ts
```

## Notes
1. **Do not commit your `.env` file to the repository.** Ensure it is added to `.gitignore`.
2. The `dist` folder should not be pushed to the repository. Use `.gitignore` to exclude it and configure your CI/CD pipeline to handle builds.
3. Use `npm run dev` during development to enable live reloading.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

