# Electron-React Instagram Session Extractor

This project is an Electron app with a React front-end, designed to open Instagram, capture session data (like `sessionid`, `csrftoken`, `mid`, `ig_did`, `ds_user_id`), and display it in JSON format. The app also provides options for clearing browser data and toggling developer tools.

## Features

- Opens Instagram login page in a secure Electron browser window.
- Extracts session data cookies and displays them in JSON format.
- Provides an option to clear browser data and toggle developer tools.
- Supports standard text operations (Copy, Paste, Cut) in the application menu.

## Prerequisites

Ensure you have the following installed:

- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.

## Getting Started

### 1. Clone the Repository

```bash
bash
Copy code
git clone <repository-url>
cd <repository-directory>

```

### 2. Install Dependencies

```bash
bash
Copy code
npm install

```

This command installs all necessary dependencies for both Electron and React.

### 3. Run the Development Build

To start the app in development mode with hot-reloading:

```bash
bash
Copy code
npm run electron-dev

```

### 4. Build for Production

To create a production build of the app:

```bash
bash
Copy code
npm run build
npm run electron-start

```

This creates a production-ready React build and runs it in Electron.

## Usage

1. **Connect to Instagram**: Click the "Connect to Instagram" button to open the Instagram login page in a secure browser window.
2. **View Session Data**: Once logged in, the app will capture session data and display it in JSON format.
3. **Clear Browser Data**: Use the "Clear Browser Data" option in the "View" menu to reset all cached data, cookies, and other storage.
4. **Developer Tools**: Toggle developer tools from the "View" menu to debug or inspect the app.

## Project Structure

- **public/**: Contains `electron.js` for Electron main process setup.
- **src/**: React app source files.
- **preload.js**: Used to securely expose certain Electron features to the React front end.

## Scripts

- `npm run electron-dev`: Runs the app in development mode with hot-reloading.
- `npm run build`: Builds the React app for production.
- `npm run electron-start`: Starts the Electron app with the production build of React.

## License

This project is licensed under the MIT License.
