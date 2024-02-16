const mysql = require("mysql2");
const inquirer = require("inquirer");
const figlet = require("figlet");
const chalk = require("chalk");

// creates connection to sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db",
});
// establishing connection to server
connection.connect(function (err) {
  if (err) throw err;

  // prompt user with... prompt
  prompt();
});
// main menu
const menu = [
  {
    name: "menu",
    type: "list",
    message: "Select a database to veiw or an.menu to take.",
    pageSize: 10,
    choices: [
      "View employees",
      "View roles",
      "View departments",
      "Add department",
      "Add role",
      "Add employee",
      "Edit employee",
      "EXIT",
      "",
    ],
  },
];

function prompt() {
  // cute lil codeing text
  // figlet takes ASCII art and turns it to text
  figlet.text(
    `Workforce Watcher`,
    {
      font: "speed",
      horizontalLayout: "fitted",
      width: 200,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      // chalk used to colour figlet
      console.log(chalk.red.bold(data));
    }
  );
  // prompt user menu using inquirer, we do this many times
  inquirer
    .prompt(menu)
    // different menu paths and function calls for each
    .then(function (answer) {
      if (answer.menu == "View employees") {
        viewAll();
      } else if (answer.menu == "View departments") {
        viewDept();
      } else if (answer.menu == "View roles") {
        viewRoles();
      } else if (answer.menu == "Add employee") {
        addEmployee();
      } else if (answer.menu == "Add department") {
        addDept();
      } else if (answer.menu == "Add role") {
        addRole();
      } else if (answer.menu == "Edit employee") {
        updateEmployee();
      } else if (answer.menu == "EXIT") {
        exit();
      }
    });
}

function exit() {
  // ends mysql connection
  connection.end();
  console.log(
    // more cute figlet text
    figlet.text(
      `Goodbye!`,
      {
        font: "digital",
        horizontalLayout: "fitted",
        width: 200,
        whitespaceBreak: true,
      },
      function (err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }
        // chalk used to colour figlet
        console.log(chalk.green.bold(data));
      }
    )
  );
}

function viewAll() {
  let query =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.role_id = employees.role_id " +
    "JOIN departments ON roles.department_id = departments.department_id " +
    "ORDER BY employees.employee_id;";

  // access employee table
  connection.query(query, function (err, res) {
    if (err) throw err;

    // add manager names
    for (i = 0; i < res.length; i++) {
      // if manager_Id contains a "0" then it is labled "None"
      if (res[i].manager_id == 0) {
        res[i].manager = "None";
      } else {
        // create row called manager, containing each employee's manager name
        res[i].manager =
          res[res[i].manager_id - 1].first_name +
          " " +
          res[res[i].manager_id - 1].last_name;
      }
      // remove manager id from to not display
      delete res[i].manager_id;
    }

    console.table(res);
    prompt();
  });
}

function viewDept() {
  let query = `SELECT departments.name FROM departments;`;
  // access dept table
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);

    inquirer
      .prompt([
        {
          message: "Which department would you like to view?",
          type: "list",
          name: "dept",
          pageSize: 10,
          choices: [
            "Eulogy Enhancement Division",
            "Casket Design Coordinators",
            "Death Planning Bureau",
            "Memorial Music Managment",
            "Spectral Complaints Sector",
            "Corpse Style Studio",
            "Cadaver Credits & Finance",
            "Soul Sales",
            "Legal",
            "HR",
          ],
        },
      ])
      // access specified department table
      .then((answers) => {
        connection.query(
          `SELECT 
        employees.first_name,
        employees.last_name,
        departments.name AS Department
        FROM employees
        INNER JOIN roles ON employees.role_id=roles.role_id     
        INNER JOIN departments ON employees.role_id=departments.department_id
        WHERE departments.name='${answers.dept}'`,
          (err, result) => {
            if (err) throw err;
            console.table(result);
          }
        );
        prompt();
      });
  })}

function viewRoles() {
  let query = `SELECT roles.title, roles.salary, departments.name AS department
        FROM roles
        INNER JOIN departments ON departments.department_id = roles.department_id;`;

  // access roles table
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);

    prompt();
  });
}

function addEmployee() {
  let query = "SELECT title FROM roles";
  let info = `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, employees.manager_id
        FROM employees
        JOIN roles ON roles.role_id = employees.role_id
        JOIN departments ON roles.department_id = departments.department_id
        ORDER BY employees.employee_id;`;
  // access employee table
  connection.query(query, function (err, res) {
    if (err) throw err;

    let roleList = res;

    connection.query(info, function (err, res) {
      if (err) throw err;

      for (i = 0; i < res.length; i++) {
        if (res[i].manager_id == 0) {
          res[i].manager = "None";
        } else {
          res[i].manager =
            res[res[i].manager_id - 1].first_name +
            " " +
            res[res[i].manager_id - 1].last_name;
        }

        delete res[i].manager_id;
      }
      console.table(res);

      let managerList = res;
      // array of questions to prompt user
      let addInfo = [
        {
          name: "first_name",
          type: "input",
          message: "Enter the new employee's first name.",
        },
        {
          name: "last_name",
          type: "input",
          message: "Enter the new employee's last name.",
        },
        {
          name: "select_role",
          type: "list",
          message: "Select the new employee's role.",
          pageSize: 28,
          // asks for new employees role
          choices: function () {
            roles = [];

            for (i = 0; i < roleList.length; i++) {
              const roleId = i + 1;

              roles.push(roleId + ": " + roleList[i].title);
            }

            roles.unshift("0: Exit");
            return roles;
          },
        },
        {
          name: "select_manager",
          type: "list",
          message: "Select the new employee's manager",
          pageSize: 15,
          // asks for new employee manager, adds it
          choices: function () {
            managers = [];

            for (i = 0; i < managerList.length; i++) {
              const mId = i + 1;

              managers.push(
                mId +
                  ": " +
                  managerList[i].first_name +
                  " " +
                  managerList[i].last_name
              );
            }

            managers.unshift("0: None");
            managers.unshift("E: Exit");
            return managers;
          },
          when: function (answers) {
            return answers.select_role !== "0: Exit";
          },
        },
      ];
      inquirer.prompt(addInfo).then(function (answer) {
        if (
          answer.select_role == "0: Exit" ||
          answer.select_manager == "E: Exit"
        ) {
          prompt();
        } else {
          console.log(answer);

          let query = `INSERT INTO employees SET ?`;
          // adds answers into employee table
          connection.query(
            query,
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: parseInt(answer.select_role.split(":")[0]),
              manager_id: parseInt(answer.select_manager.split(":")[0]),
            },

            function (err, res) {
              if (err) throw err;
            }
          );

          prompt();
        }
      });
    });
  });
}

function addDept() {
  let query = `SELECT departments.name FROM departments;`;
  // access dept table
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    // asks user to enter new dept info
    let addInfo = [
      {
        name: "new_dept",
        type: "input",
        message: "Enter a new department.",
      },
    ];
    inquirer
      .prompt(addInfo)

      .then(function (answer) {
        console.log(answer);

        let query = "INSERT INTO departments SET ?";
        // adds to dept table
        connection.query(
          query,
          {
            name: answer.new_dept,
          },
          function (err, res) {
            if (err) throw err;
          }
        );
        prompt();
      });
  });
}

function addRole() {
  let info = `SELECT roles.title AS roles, roles.salary, departments.name
         FROM roles 
         INNER JOIN departments ON departments.department_id = roles.department_id;`;

  let query2 = `SELECT departments.name FROM departments`;
  // access role table
  connection.query(info, function (err, res) {
    if (err) throw err;

    console.table(res);
    // access dept table
    connection.query(query2, function (err, res) {
      if (err) throw err;

      let deptList = res;
      // array of questions to prompt user
      let addInfo = [
        {
          name: "add_role",
          type: "input",
          message: "Enter the new company role.",
        },
        {
          name: "add_salary",
          type: "input",
          message: "Enter the salary for this role.",
        },
        {
          name: "select_department",
          type: "list",
          message: "Select the department.",
          pageSize: 15,
          choices: function () {
            departments = [];
            // shows dept list
            for (i = 0; i < deptList.length; i++) {
              const roleId = i + 1;

              departments.push(roleId + ": " + deptList[i].name);
            }
            departments.unshift("0: Exit");

            return departments;
          },
        },
      ];

      inquirer
        .prompt(addInfo)

        .then(function (answer) {
          if (answer.select_department == "0: Exit") {
            prompt();
          } else {
            console.log(answer);
            // adds new role
            let query = `INSERT INTO roles SET ?`;

            connection.query(
              query,
              {
                title: answer.add_role,
                salary: answer.add_salary,
                department_id: parseInt(answer.select_department.split(":")[0]),
              },
              function (err, res) {
                if (err) throw err;
                else if (prompt());
              }
            );

          }
        });
    });
  });
}
function updateEmployee() {
  let query = `SELECT title FROM roles`;

  let info = `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, employees.manager_id
    FROM employees
    JOIN roles ON roles.role_id = employees.role_id
    JOIN departments ON roles.department_id = departments.department_id
    ORDER BY employees.employee_id;`;
  // access roles table
  connection.query(query, function (err, res) {
    if (err) throw err;

    let roleList = res;

    connection.query(info, function (err, res) {
      if (err) throw err;

      for (i = 0; i < res.length; i++) {
        if (res[i].manager_id == 0) {
          res[i].manager = "None";
        } else {
          res[i].manager =
            res[res[i].manager_id - 1].first_name +
            " " +
            res[res[i].manager_id - 1].last_name;
        }

        delete res[i].manager_id;
      }

      console.table(res);

      let empList = res;

      let addEmp = [
        {
          name: "select_employee",
          type: "list",
          message: "Select the employee to edit",
          pageSize: 12,
          choices: function () {
            employees = [];

            for (i = 0; i < empList.length; i++) {
              //  match table ids
              const mId = i + 1;
              // updates employee
              employees.push(
                mId + ": " + empList[i].first_name + " " + empList[i].last_name
              );
            }
            employees.unshift("0: Exit");

            return employees;
          },
        },
      ];
      inquirer
        .prompt(addEmp)

        .then(function (answer) {
          if (answer.select_employee == "0: Exit") {
            prompt();
          } else {
            let empSelect = answer.select_employee.split(":")[0];
            // asks to edit employee role
            let addEmpInfo = [
              {
                name: "select_role",
                type: "list",
                message: "Edit the employee role.",
                pageSize: 28,
                choices: function () {
                  roles = [];

                  for (i = 0; i < roleList.length; i++) {
                    const roleId = i + 1;
                    // adds it
                    roles.push(roleId + ": " + roleList[i].title);
                  }
                  roles.unshift("0: Exit");

                  return roles;
                },
              },
              {
                name: "select_manager",
                type: "list",
                message: "Edit the employee manager",
                pageSize: 12,
                choices: function () {
                  managers = [];

                  for (i = 0; i < empList.length; i++) {
                    const mId = i + 1;
                    // asks for new employee manager, adds it
                    if (
                      answer.select_employee.split(": ")[1] !==
                      empList[i].first_name + " " + empList[i].last_name
                    ) {
                      managers.push(
                        mId +
                          ": " +
                          empList[i].first_name +
                          " " +
                          empList[i].last_name
                      );
                    }
                  }
                  managers.unshift("0: None");
                  managers.unshift("E: Exit");

                  return managers;
                },
                when: function (answers) {
                  return answers.select_role !== "0: Exit";
                },
              },
            ];
            inquirer
              .prompt(addEmpInfo)

              .then(function (answer) {
                if (
                  answer.select_role == "0: Exit" ||
                  answer.select_manager == "E: Exit"
                ) {
                  prompt();
                } else {
                  console.log(answer);

                  let query =
                    `UPDATE employees SET ? 
                    WHERE employees.employee_id =` + empSelect;
                  // updates emplyee table
                  connection.query(
                    query,
                    {
                      role_id: parseInt(answer.select_role.split(":")[0]),
                      manager_id: parseInt(answer.select_manager.split(":")[0]),
                    },
                    function (err, res) {
                      if (err) throw err;
                    }
                  );
                  prompt();
                }
              });
          }
        });
    });
  });
}
