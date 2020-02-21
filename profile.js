const axios = require('axios');
const inquirer = require('inquirer');
const html = require('./generateHTML');
const fs = require('fs');
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

inquirer
    .prompt([{
        message: 'Enter your Github username',
        name: 'username'
    },
    {
        message: 'Enter your favorite color',
        name: 'color'
    }])
    .then(res => {
        // returns the beginning html file with color formatting
        console.log(res);
        const headerHTML = html.generateHTML(res);
        // console.log(headerHTML);
        writeFileAsync(`profile-${res.username}.html`, headerHTML, (err) => {
            if(err) {
                throw err;
            } 
            console.log("Wrote html header with user's favorite color!");
        })
    
        const url = `https://api.github.com/users/${res.username}`;
        const starredURL = `https://api.github.com/users/${res.username}/starred?per_page=100`;
        
        axios.get(url)
            .then((response) => {
                const user = response.data;
                const userData = {
                    name: user.name,
                    image: user.avatar_url,
                    company: user.company,
                    location: user.location,
                    github: user.html_url,
                    blog: user.blog,
                    bio: user.bio,
                    publicRepos: user.public_repos,
                    followers: user.followers,
                    following: user.following
                };
                axios.get(starredURL)
                    .then((promise) => {
                    const starredCount = promise.data.map(starred => starred.name);
                    // userData.push(`Stars: ${starredCount.length}`);
                    userData.stars = starredCount.length;
                    console.log(userData.image);
                    const bodyHTML = html.generateBody(userData);
                    fs.appendFile(`profile-${res.username}.html`, bodyHTML, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Wrote html body for user!");
                    })
                    })
            })


    });
