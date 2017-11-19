/**
* A basic (insecure) login function
* @param {string} user The user's username
* @param {string} pass The user's password
* @returns {string}
*/
module.exports = (user, pass, context, callback) => {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(':memory:');

    if(user && pass){
        // send query to sqlite3 database
        db.serialize(function() {
            db.run(
                `CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    name TEXT, 
                    password TEXT
                )`
            );

            // create Captain Falcon
            db.run(
                `INSERT INTO users (name, password) VALUES (
                    'Captain Falcon', 'flag(YouGotBoostPower)'
                )`
            )
           
            db.close();
        });

        result = db.get("SELECT * from users WHERE name = '" + user + "' AND '" + pass + "'");
        callback(null, result);
    } else {
        callback("Either the user or the pass was not provided.");
    }
    

};
