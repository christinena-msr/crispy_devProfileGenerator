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
        // console.log(headerHTML);
        // writeFileAsync(`profile-${res.username}.html`, headerHTML, (err) => {
        //     if(err) {
        //         throw err;
        //     } 
        //     console.log("Wrote html header with user's favorite color!");
        // })
    
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
                        console.log(userData);
                        const bodyHTML = html.generateBody(userData);
                        const userHTML = headerHTML + bodyHTML;
                        console.log(userHTML);
                        fs.appendFile(`profile-${res.username}.html`, bodyHTML, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Wrote html body for user!");
                        })
                        
                        const conversion = convertFactory({
                            converterPath: convertFactory.converters.PDF
                        });
                        
                        conversion({ file: `./profile-${res.username}.html` }, function(err, result) {
                            if (err) {
                                return console.error(err);
                            }
                            
                            console.log(result.numberOfPages);
                            console.log(result.logs);
                            result.stream.pipe(fs.createWriteStream(__dirname + `./profile-${res.username}.pdf`));
                            conversion.kill(); // necessary if you use the electron-server strategy
                        });

                    //     //pulled from electron-html-to
                    //     const path = require('path'),
                    //     // fs = require('fs'),
                    //         assign = require('object-assign'),
                    //         pdfParser = require('../pdfParser');
                
                    //     module.exports = function(log, settings, browserWindow, done) {
                    //         let pdfDefaults = {
                    //         marginsType: 0,
                    //         pageSize: 'A4',
                    //         printBackground: false,
                    //         landscape: false
                    //         };
                        
                    //         // TODO: support headerHeight, footerHeight when electron support rendering PDF's header/footer
                    //         let pdfSettings = settings.pdf,
                    //             pdfOptions = assign({}, pdfDefaults, pdfSettings, { printSelectionOnly: false });
                        
                    //         log('before printing..');
                    //         log('pdf options:', pdfOptions);
                        
                    //         browserWindow.webContents.printToPDF(pdfOptions, (err, pdfBuf) => {
                    //         let dist = path.join(settings.output.tmpDir, `${settings.output.id}.pdf`);
                        
                    //         if (err) {
                    //             return done(err);
                    //         }
                        
                    //         // don't know why the electron process hangs up if i don't log anything here
                    //         // (probably pdf.js?)
                    //         // anyway this log prevent the conversion to stop
                    //         log('after printing..');
                    //         log('parsing pdf..');
                        
                    //         pdfParser(pdfBuf, (pdfParseErr, userHTML) => {
                    //             log('pdf parsing complete..');
                        
                    //             if (pdfParseErr) {
                    //             return done(pdfParseErr);
                    //             }
                        
                    //             // when running in IISNODE electron hangs when using fs.readFile, fs.createReadStream
                    //             // or any async API for read a file.. on normal windows + node electron consumes 100% CPU when
                    //             // using any async file API, so the only/best option is to read the file in a synchronous way
                    //             if (process.platform === 'win32') {
                    //             try {
                    //                 fs.writeFileSync(dist, pdfBuf);
                        
                    //                 done(null, {
                    //                 numberOfPages: pdfDoc.numPages,
                    //                 output: dist
                    //                 });
                    //             } catch (saveErr) {
                    //                 done(saveErr);
                    //             }
                    //             } else {
                    //             fs.writeFile(dist, pdfBuf, (saveErr) => {
                    //                 if (saveErr) {
                    //                 return done(saveErr);
                    //                 }
                        
                    //                 done(null, {
                    //                 numberOfPages: pdfDoc.numPages,
                    //                 output: dist
                    //                 });
                    //             });
                    //             }
                    //         });
                    //         });
                    //     };

                    });
            });


    });
