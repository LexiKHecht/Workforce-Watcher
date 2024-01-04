const mysql = require('mysql');
const inquirer = require('inquirer');

// creates connection to sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});
// establishing connection to server
connection.connect(function(err){

    if (err) throw err;

    // prompt user with menu
    prompt();

});

const menu = [
    {
        name: "action",
        type: "list",
        message: "Select a database to veiw or an action to take.",
        choices: [
            "View employees",
            "View roles",
            "View departments",
            "Add department",
            "Add role",
            "Add employee",
            "Edit employee",
            "Remove employee",
            "EXIT" 
        ]
    }];

function prompt() {
   
    // prompt user actions using inquirer 
    inquirer.prompt(menu)
}