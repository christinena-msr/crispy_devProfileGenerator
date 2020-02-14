const inquirer = require("inquirer");

inquirer
    .prompt({
        message: 'Enter your Github username',
        name: 'username'
    })
