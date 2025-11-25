# GEMINI.md

## Project Overview

This project is a React and TypeScript application called "Doongzi". It is a web service designed to help users with real estate contracts in Korea. The application provides features such as an AI chatbot for legal advice, a document scanning tool to analyze contracts and other documents, and a checklist to guide users through the contract process.

The project is built with Vite, uses `react-router-dom` for routing, and `axios` for making HTTP requests to a backend. The UI is styled with a combination of inline styles and a global CSS file. The project also includes a comprehensive set of components for different pages and features.

## Building and Running

### Prerequisites

- Node.js and npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
VITE_N8N_CHATBOT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot
VITE_N8N_SCAN_WEBHOOK_URL=https://your-n8n-instance.com/webhook/scan
VITE_N8N_CHECKLIST_WEBHOOK_URL=https://your-n8n-instance.com/webhook/checklist
VITE_N8N_LEGAL_WEBHOOK_URL=https://your-n8n-instance.com/webhook/legal
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

The production build will be located in the `build` directory.

## Development Conventions

### Project Structure

The project follows a standard React project structure:

- `src/pages`: Page components for each route.
- `src/components`: Reusable components.
- `src/api`: API-related code, including an `axios` instance.
- `src/types`: TypeScript type definitions.
- `src/context`: React context providers.
- `public`: Static assets.

### Styling

The project uses a combination of a global CSS file (`index.css`) and inline styles. The color palette is defined in the `README.md` file.

### API Communication

The application uses `axios` to communicate with a backend. An `apiClient` instance is configured with a timeout and interceptors for logging and error handling. The actual API endpoints are called from the respective API modules (e.g., `src/api/scan.ts`).
