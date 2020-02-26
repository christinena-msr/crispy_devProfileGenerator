const axios = require('axios');
const inquirer = require('inquirer');
const html = require('./generateHTML');
const fs = require('fs'),
    convertFactory = require('electron-html-to');
const util = require("util");
const path = require("path");

// const writeFileAsync = util.promisify(fs.writeFile);

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
                        userData.stars = starredCount.length;
                        const bodyHTML = html.generateBody(userData);
                        const userHTML = headerHTML + bodyHTML;
                        
                        // pulled from electron-html-to 
                        const conversion = convertFactory({
                            converterPath: convertFactory.converters.PDF
                        });
                        
                        conversion({ html: `${userHTML}` }, function(err, result) {
                            if (err) {
                                return console.error(err);
                            }
                            
                            console.log("Pages created: " + result.numberOfPages);
                            console.log("Created a pdf of user's profile!");
                            result.stream.pipe(fs.createWriteStream(`./profile-${res.username}.pdf`));
                            conversion.kill(); // necessary if you use the electron-server strategy
                        });

                    });
            });


    });
