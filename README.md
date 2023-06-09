# AI Club Login Application

This is a login application that provides functionalities for user authentication, registration, and password reset.

## Installation

### Server

1. Clone the repository: `git clone git@github.com:PorePranav/aiclub-login.git`
2. Navigate to the server directory: `cd server`
3. Create a `config.js` file in the server directory and set the following export class.

   ```
   export default {
    JWT_SECRET: <JWT_SECRET>,
    EMAIL: <EMAIL>,
    PASSWORD: <PASSWORD>,
    ATLAS_URI: <ATLAS_URI>
	}
   ```

4. Install dependencies: `npm install`
5. Start the server: `npm start`

### Client

1. Navigate to the client directory: `cd client`
2. Setup the backend server base url in `src/helper/helper.js` and `src/hooks/fetch.hook.js`

   ```
   axios.defaults.baseURL=<server-api-url>
   ```

3. Install dependencies: `npm install`
4. Start the client: `npm start`

## Usage

1. Open your preferred web browser and navigate to the client application using the provided URL.
2. Register a new account by providing the required information.
3. Log in using your registered credentials.
4. Reset your password if needed.
