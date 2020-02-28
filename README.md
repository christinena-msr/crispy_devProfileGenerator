# GitHub Profile Generator

## Overview
This is a Node application that will create a pdf with information from a github profile. Instead of manually searching, recording, and creating reports of potential developer candidates, this app will automatically grab important information and relevelt contact links and style the report in an easy-to-read format. 

Using the GitHub API & asynchronous functions, you will be able to use this app to generate as many profile pdf files as you need to. 

This is a great resource for time-constrained recruiters & hiring managers who want to compile information on many potential candidates through GitHub profiles. 

## Instructions
1. Install node 
```
npm i node
```
2. Run the app in your bash terminal
Mac:
``` 
node profile.js
```
3. You will be prompted to answer the following questions
```
? Enter your Github username [ex. crispysodium]
? Pick your favorite color
> green
> blue
> pink
> red
```
4. Voila! You should see a pdf file generated with the name profile-[username].pdf created in the same folder.

## Concepts Learned & Applied
* Node
* Asynchronous API calls with Axios
* Asynchronous Promise handling
* HTML to PDF conversion using Electron
* Inquirer question user prompt
* File System (fs) creating new files locally

## Credits
Author: [crispysodium](https://github.com/crispysodium)