const axios = require('axios');
const inquirer = require("inquirer");
const html = require("./generateHTML");

inquirer
    .prompt({
        message: 'Enter your Github username',
        name: 'username'
    })
    .then(({username}) => {
            const url = `https://api.github.com/users/${username}`;
            const starredURL = `https://api.github.com/users/${username}/starred?per_page=100`;
            
            axios.get(url)
                .then((res) => {
                    const user = res.data;
                    // console.log(user);
                    console.log("name: " + user.name);
                    console.log("bio: " + user.bio);
                    console.log("location: " + user.location);
                    console.log("repos: " + user.public_repos);
                    console.log("followers: " + user.followers);
                    console.log("following: " + user.following);
                })

            axios.get(starredURL)
                .then((res) => {
                    // console.log(res.data);
                    const starredCount = res.data.map(starred => starred.name);
                    console.log("starred: " + starredCount.length);
                })

        });