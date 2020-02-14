const axios = require("axios");

function Profile() {
    this.name = "";
    this.repos = 0;
    this.followers = 0;
    this.following = 0;
    this.starred = 0;
}

// set username of object 
Profile.prototype.setUsername = function(username) {
    this.name = username;
}

Profile.prototype.getRepos = function() {
    if(this.name === "") {
        throw new Error("Please set a username");
    }
    const url = `https://api.github.com/users/${this.name}/repos?per_page=100`;

    axios.get(url)
        // .catch(err => {throw err})
        .then((res) => {
            // creates an array
            // console.log(res.data.repo);
            const repoNames = res.data.map(repo => repo.name);
            console.log("repos: " + repoNames.length);
            this.repos = repoNames.length;
            // return repoNames.length;
            // fs.writeFile('my-repos.txt', repoNames, (err) => {
            //     if (err) {
            //         throw err;
            //     }

            //     console.log('Made a file');
            // });
        });
}

Profile.prototype.getFollowers = function() {
    const followersUsers = "followers";
    const number = getData(this.name, followersUsers);
    this.followers = number;
}

Profile.prototype.getFollowing = function() {
    const followingUsers = "following";
    const number = getData(this.name, followingUsers);
    this.following = number;
}

Profile.prototype.getStarred = function() {
    const starredRepos = "starred";
    const number = getData(this.name, starredRepos);
    this.starred = number;
}

function getData(name, data) {
    if(this.name === "") {
        throw new Error("Please set a username");
    }
    const url = `https://api.github.com/users/${name}/${data}?per_page=100`;
    axios.get(url)
        .catch(err => {throw err})
        .then((res) => {
            // console.log(res.data);
            const dataCount = res.data.map(item => item.name);
            console.log("item: " + dataCount.length);
            return dataCount.length;
        });

}

const user = new Profile();
user.setUsername("crispysodium");
user.getRepos();
user.getFollowers();
user.getFollowing();
user.getStarred();

console.log(user);