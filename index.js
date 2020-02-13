const fs = require("fs");
const inquirer = require("inquirer");
const axios = require('axios');

inquirer
    .prompt({
        message: 'Enter your Github username',
        name: 'username'
    })
    // prompt returns a promise
    .then(({username}) => {
        const url = `https://api.github.com/users/${username}/repos?per_page=100`;

        axios.get(url)
            .then((res) => {
                // creates an array
                // console.log(res.data.repo);
                const repoNames = res.data.map(repo => repo.name);
                console.log("repos: " + repoNames.length);
                // fs.writeFile('my-repos.txt', repoNames, (err) => {
                //     if (err) {
                //         throw err;
                //     }

                //     console.log('Made a file');
                // });
            })

        const followersURL = `https://api.github.com/users/${username}/followers?per_page=100`;

        axios.get(followersURL)
            .then((res) => {
                // const followers = res.data.map(followers => followers.count)
                // console.log(res.data);
                const followerCount = res.data.map(followers => followers.name);
                console.log("followers: " + followerCount.length);
            })

        const followingURL = `https://api.github.com/users/${username}/following?per_page=100`;

        axios.get(followingURL) 
            .then((res) => {
                // console.log(res.data);
                const followingCount = res.data.map(following => following.name);
                console.log("following: " + followingCount.length);
            })

        const starredURL = `https://api.github.com/users/${username}/starred?per_page=100`;

        axios.get(starredURL)
            .then((res) => {
                // console.log(res.data);
                const starredCount = res.data.map(starred => starred.name);
                console.log("starred: " + starredCount.length);
            })

    });