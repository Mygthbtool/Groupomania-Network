GROUPOMANIA-NETWORK

I have created a corporate social network, for a fictive company called 'Groupomania'.<br>
This application allows Groupomania's employees to interact with each other by posting<br>
images, gifs, texts, and liking or disliking them and commenting them.

For this project, I used below techs:

For the server : Node.js, Javascript and Express framework<br>
For the database : MySQL and Sequelize ORM<br>
For the frontend : HTML, CSS, Javascript and Vue.js as framework

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

