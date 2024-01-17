const mysql = require('mysql2');
const inquirer = require('inquirer');
const figlet = require('figlet');
const chalk = require("chalk");

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

    // prompt user with... prompt
    prompt();

});

const menu = [
    {
        name: "menu",
        type: "list",
        message: "Select a database to veiw or an.menu to take.",
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
    // hope i can get this to work!
    figlet('EMPLOYEE TRACKER', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(chalk.green(data))
    });
    // prompt user menu using inquirer 
    inquirer.prompt(menu)
    // different menu paths
    .then(function(answer) {

        if(answer.menu == "View employees") {
            
            viewAll();

        }else if(answer.menu == "View departments") {

            viewDept();

        }else if(answer.menu == "View roles") {

            viewRoles();

        }else if(answer.menu == "Add employee") {

            addEmployee();

        }else if(answer.menu == "Add department") {

            addDept();

        }else if(answer.menu == "Add role") {

            addRole();

        }else if(answer.menu == "Edit employee") {

            updateEmployee();

        }else if(answer.menu == "Remove employee") {

            deleteEmployee();

        }else if(answer.menu == "EXIT") {

            exit();

        };
    });    
};

function viewAll() {

    let query =
      "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, employees.manager_id " +
      "FROM employees " +
      "JOIN roles ON roles.role_id = employees.role_id " +
      "JOIN departments ON roles.department_id = departments.department_id " +
      "ORDER BY employees.employee_id;";

    // ;
    // connect to mySQL useing query instruction to access employees table
    connection.query(query, function(err, res) {
        if (err) throw err;

        // add manager names to the manager_id col to be displayed in terminal
        for(i = 0; i < res.length; i++) {
            // if manager_Id contains a "0" then lable it as "None"
            if(res[i].manager_id == 0) {
                res[i].manager = "None" 
            
            }else{
                // create new row called manager, containing each employee's manager name
                res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
            };
            // remove manager id from res so as to not display it
            delete res[i].manager_id;
        };

        // print data retrieved to terminal in table format 
        console.table(res); 
    prompt();
    });
};

function viewDept() {
    inquirer.prompt([{
        message: "Which department would you like to view?",
        type: 'list',
        name: 'dept',
        choices: [
            'Eulogy Enhancement Division',
            'Casket Design Coordinators',
            'Death Planning Bureau',
            'Memorial Music Managment',
            'Spectral Complaints Sector',
            'Corpse Style Studio',
            'Cadaver Credits & Finance',
            'Soul Sales',
            'Legal',
            'HR'
        ]
    }])
        .then((answers) => {
            connection.query(`SELECT 
        employees.first_name,
        employees.last_name,
        departments.name AS Department
    FROM employees
        INNER JOIN roles ON employees.role_id=roles.role_id     
        INNER JOIN departments ON employees.role_id=departments.department_id
        WHERE departments.name='${answers.dept}'`, (err, result) => {
                if (err) throw err;
                console.table(result);

            })
            prompt();
        });
};

function viewRoles() {

    let query =
        `SELECT roles.title, roles.salary, departments.name AS department
        FROM roles
        INNER JOIN departments ON departments.department_id = roles.department_id;`;

    // connect to mySQL useing query instruction to access roles table
    connection.query(query, function(err, res) {

        if (err) throw err;

        console.table(res); 

        prompt();
    });
};

function addEmployee() {

    let query = "SELECT title FROM roles";
    let info =
        "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, employees.manager_id " +
        "FROM employees " +
        "JOIN roles ON roles.role_id = employees.role_id " +
        "JOIN departments ON roles.department_id = departments.department_id " +
        "ORDER BY employees.employee_id;";
    
    connection.query(query, function (err, res) {
        
        if (err) throw err;

        let roleList = res;
        
        connection.query(info, function (err, res) {
        
            if (err) throw err;

            for (i = 0; i < res.length; i++) {
                if (res[i].manager_id == 0) {
                    res[i].manager = "None"
        
                } else {
                    res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
                };
                 
                delete res[i].manager_id;
            };
            console.table(res);
    
            let managerList = res;
            // array of actions to prompt user
            let addInfo = [
                {
                    name: "first_name",
                    type: "input",
                    message: "Enter the new employee's first name."
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "Enter the new employee's last name."
                },
                {
                    name: "select_role",
                    type: "list",
                    message: "Select the new employee's role.",

                    // dynamic choises using roleList (title col of roles table)
                    choices: function () {
                        
                        roles = [];

                        for (i = 0; i < roleList.length; i++) {
        
                            const roleId = i + 1;

                            roles.push(roleId + ": " + roleList[i].title);
                        };

                        roles.unshift("0: Exit");
                        return roles;
                    }
                },
                {
                    name: "select_manager",
                    type: "list",
                    message: "Select the new employee's manager",
                    
                    // dynamic choises using managerList (first_name and last_name cols of employees table)
                    choices: function () {

                        managers = [];

                        for (i = 0; i < managerList.length; i++) {
                        
                            const mId = i + 1;

                            managers.push(mId + ": " + managerList[i].first_name + " " + managerList[i].last_name);
                        };

                        managers.unshift("0: None");
                        managers.unshift("E: Exit");
                        return managers;
                    },
                    when: function (answers) {
                                
                        return answers.select_role !== "0: Exit";
                    }
                }
            ];
            inquirer.prompt(addInfo)
                .then(function (answer) {

                    if (answer.select_role == "0: Exit" || answer.select_manager == "E: Exit") {

                        prompt();
                    } else {

                        console.log(answer);

                        let query = "INSERT INTO employees SET ?";
                      
                        connection.query(query,
                            {
                                first_name: answer.first_name,
                                last_name: answer.last_name,
                                role_id: parseInt(answer.select_role.split(":")[0]),
                                manager_id: parseInt(answer.select_manager.split(":")[0])
                            },
                    
                            function (err, res) {
                                if (err) throw err;
                            })
                        
                        prompt();
                    }
                })
        })
    })
};

