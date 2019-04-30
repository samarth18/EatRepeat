Instructions to run the web-app

-Node modules contain the required dependencies for the web-app
-Routes contain the back-end routing
-Views contain the UI for the different routes
-app.js is the starting point for the application which contains the declaration of all routes, views and the database
-package.json and package-lock.json are required for project and dependencies information

If you don’t have Node JS and npm installed on your pc, that should be installed first.
To check if Node JS is installed, go to the terminal and type
node -v to check node version
npm -v to check npm version
If not installed, refer to https://nodejs.org/en/download/ for installation

As we have already included the package.json and the node_modules with the zip folder, you won’t be required to install any additional modules to run the app.

In the file app.js, please enter your username and password within quotes for your database connection. You can find it where db is being initialized with the call mysql.createConnection inside app.js on line 40 and 41.
Navigate to the root directory of the folder in the terminal/command-prompt and run the command 
nodemon app.js 
in the terminal.
Open http://localhost:5000/ inside your web browser (preferably Google Chrome) to load the application. The application should be running now.
Please make sure you are connected to the internet, as we are loading the background for the landing page from an online url.
The dump of the database has been submitted as the back-end code and it contains all the data, database schema, stored procedures, functions, triggers.
