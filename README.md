GROUPOMANIA-NETWORK

To run this project:

1. Clone the repo from the following link:

 https://github.com/Mygthbtool/Groupomania-Network.git

2. To run the backend: <br>
  cd backend <br>
  npm install <br>
  nodemon server

3. For Mysql database:

 . Create '.env' file containing or similar to this:   

    SECRET_TOKEN="put your token here"
    DB_NAME=groupomania
    DB_USER=root
    DB_PASSWORD= *********(your password)
    DB_HOST=localhost
    DB_DIALECT=mysql

 . Create the database using this file: backend/DB-Structure.sql<br>
 . To check the connection to the database go to backend/sequelize.js.

4. To run the frontend:<br>
   cd Frontend<br>
   cd cli-version-app<br>
   npm install<br>
   npm run serve<br>
   Then open on your browser : http://localhost:8080/

