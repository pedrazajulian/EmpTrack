const inquirer = require("inquirer");
const DB = require("./db");
require("dotenv").config();
const { printTable } = require("console-table-printer");

function startProg() {
  console.log('Welcome to EmpTrack systems');
  mainMenu();
}

function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "MAIN MENU",
      choices: [
        "Work with Employees",
        "Work with Positions",
        "Work with Departments",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.menu) {
        case "Work with Employees":
          employeePrompt();
          break;
        case "Work with Positions":
          rolePrompt();
          break;
        case "Work with Departments":
          deptPrompt();
          break;
        default:
          theEnd();
      }
    });
}

function employeePrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "emplMenu",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add New Employee",
        "Update Employee Position",
        "Update Employee Manager",
        "View Employees by Department",
        "Remove Employee",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.emplMenu) {
        case "View All Employees":
          allEmployees();
          break;
        case "Add New Employee":
          newEmployee();
          break;
        case "Update Employee Position":
          updateEmployee();
          break;
        case "Update Employee Manager":
          updateManager();
          break;
        case "View Employees by Department":
          emplByDept();
          break;
        case "Remove Employee":
          removeEmployee();
          break;

        default:
          mainMenu();
      }
    });
}

const allEmployees = () => {
  console.log("Here is a list of all employees");
  DB.getEmployee().then((employee) => {
    printTable(employee);
    mainMenu();
  });
};

const newEmployee = async () => {
  const roles = await DB.viewRoles();
  const roleList = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const man = await DB.viewEmployees();
  const manList = man.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  manList.unshift({ name: "None", value: null });
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter the employee's first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter the employee's last name",
      },
      {
        type: "list",
        name: "roleId",
        message: "Please select the employee's position",
        choices: roleList,
      },
      {
        type: "list",
        name: "manId",
        message: "Please enter the employee's manager",
        choices: manList,
      },
    ])
    .then((answers) => {
      DB.addEmployee(
        answers.firstName,
        answers.lastName,
        answers.roleId,
        answers.manId
      ).then((res) => {
        allEmployees();
      });
    });
};

const updateManager = async () => {
  const emp = await DB.viewEmployees();
  const empList = emp.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const man = await DB.viewEmployees();
  const manList = man.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  manList.unshift({ name: "None", value: null });
  inquirer
    .prompt([
      {
        type: "list",
        name: "emplId",
        message: "Select the Employee you would like to update",
        choices: empList,
      },
      {
        type: "list",
        name: "newMan",
        message: "Select the Employee's new Manager",
        choices: manList,
      },
    ])
    .then((answers) => {
      DB.updateEmployeeManager(answers.newMan, answers.emplId).then((res) => {
        allEmployees();
      });
    });
};

const updateEmployee = async () => {
  const emp = await DB.viewEmployees();
  const empList = emp.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const roles = await DB.viewRoles();
  const roleList = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "updateEmp",
        message: "Select the Employee you would like to update",
        choices: empList,
      },
      {
        type: "list",
        name: "newRole",
        message: "Select the Employee's new Position",
        choices: roleList,
      },
    ])
    .then((answers) => {
      DB.updateEmployeeRole(answers.newRole, answers.updateEmp).then((res) => {
        allEmployees();
      });
    });
};

const emplByDept = async () => {
  const department = await DB.viewDepts();
  const deptList = department.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "deptId",
        message: "Select the Department you would like to view",
        choices: deptList,
      },
    ])
    .then((answer) => {
      DB.viewEmployeesByDept(answer.deptId).then((department) => {
        printTable(department);
        mainMenu();
      });
    });
};

const removeEmployee = async () => {
  const emp = await DB.viewEmployees();
  const empList = emp.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "removeEmp",
        message: "Select the Employee you would like to remove",
        choices: empList,
      },
    ])
    .then((answer) => {
      DB.deleteEmployee(answer.removeEmp).then((res) => {
        allEmployees();
      });
    });
};

function rolePrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "roleMenu",
      message: "What would you like to do?",
      choices: [
        "View All Positions",
        "Add New Position",
        "Remove Position",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.roleMenu) {
        case "View All Positions":
          allRoles();
          break;
        case "Add New Position":
          newRole();
          break;
        case "Remove Position":
          verifyRemove();
          break;
        default:
          mainMenu();
      }
    });
}

const allRoles = () => {
  console.log("Here is a list of all positions");
  DB.getRole().then((role) => {
    printTable(role);
    mainMenu();
  });
};

const newRole = async () => {
  const department = await DB.viewDepts();
  const deptList = department.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "input",
        name: "position",
        message: "What is the title for this position?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this position?",
      },
      {
        type: "list",
        name: "dept",
        message: "What department will this position be assigned to?",
        choices: deptList,
      },
    ])
    .then((answers) => {
      DB.addRole(answers.position, answers.salary, answers.dept).then((res) => {
        allRoles();
      });
    });
};

const verifyRemove = () => {
  inquirer
    .prompt({
      type: "list",
      name: "roleVerify",
      message:
        "Removing a position will also delete all Employees assigned to it.  Would you like to continue?",
      choices: ["Yes", "No"],
    })
    .then(function (answer) {
      switch (answer.roleVerify) {
        case "Yes":
          removeRole();
          break;
        default:
          mainMenu();
      }
    });
};

const removeRole = async () => {
  const roles = await DB.viewRoles();
  const roleList = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "delRole",
        message: "What Position would you like to remove?",
        choices: roleList,
      },
    ])
    .then((answer) => {
      DB.deleteRole(answer.delRole).then((res) => {
        allRoles();
      });
    });
};

function deptPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "deptMenu",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "Add New Department",
        "Remove Department",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.deptMenu) {
        case "View All Departments":
          allDepts();
          break;
        case "Add New Department":
          newDept();
          break;
        case "Remove Department":
          verifyDeptRemove();
          break;
        default:
          mainMenu();
      }
    });
}

const allDepts = () => {
  console.log("Here is a list of all departments");
  DB.getDepts().then((dept) => {
    printTable(dept);
    mainMenu();
  });
};

const newDept = () => {
  inquirer
    .prompt({
      type: "input",
      name: "newDept",
      message: "What is the name of the new department?",
    })
    .then((answer) => {
      DB.addDept(answer.newDept).then((res) => {
        allDepts();
      });
    });
};

const verifyDeptRemove = () => {
  inquirer
    .prompt({
      type: "list",
      name: "deptVerify",
      message:
        "Removing a Department will also delete all Employees and Positions assigned to it.  Would you like to continue?",
      choices: ["Yes", "No"],
    })
    .then(function (answer) {
      switch (answer.deptVerify) {
        case "Yes":
          removeDept();
          break;
        default:
          mainMenu();
      }
    });
};

const removeDept = async () => {
  const department = await DB.viewDepts();
  const deptList = department.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "delDept",
        message: "What Department would you like to remove?",
        choices: deptList,
      },
    ])
    .then((answer) => {
      DB.deleteDept(answer.delDept).then((res) => {
        allDepts();
      });
    });
};

function theEnd() {
  console.log("Thank you for using EmpTrack systems!");
  process.exit();
}

startProg();