System setup requirement 
1. Setup nodejs and npm using Windows installer  from here https://nodejs.org/en/download/ - chocolatey would be installed along with this that would be helpful for later installations.
2. Once chocolatey is installed install postgresql using the following command in admin mode (remember to check log for Generated password for postgres user):
`choco install postgresql  redis-64 `
3. Update the environment variable with PostGresql path. Location would be of this form "C:\Program Files\PostgreSQL\12\bin"  - Might differ for your system.
[ env variable setting path -> Click on properties in This PC -> advanced System settings (on left panel) -> Environment variable -> Edit PATh and add above location)
4. Update the *postgres* user password by using the one which is generated as can be seen in the logs while installation.  (this takes sometime) using :
    a. Updating env variable
    b. Opening psql client using postgres user and password in the logs while installation i.e., `psql -Upostgres`
    c. Once the postgresql# prompt shows alter the user's password by running following command - `ALTER USER postgres WITH PASSWORD '<yourpassword>';`
    d. Use this password and the username to update the file at <Working_Directory>\slack\db\config.js file.
    e. Check if server is running using : `pg_ctl -D "C:\Program Files\PostgreSQL\12\data" status` : path may vary for you.
    f. Start the postgresql servcer using command: `pg_ctl -D "C:\Program Files\PostgreSQL\12\data" start`  - the path mentioned here might vary for you. Check an use.
    g. If there is any issue try to check logs and resolve.
      i. If something else is running at 5432 port use the command in "powershell" now to figure it out.
      ii. If needed kill the running process and restart again
      iii. `Get-Process -Id (Get-NetTCPConnection -LocalPort <portNumber>).OwningProcess`
      iv. `tskill <typeyourPIDhere>`  from above
    
5. Run redis-server using command `redis-server` (If it down't work follow below steps and rerun this command)
  1. Download the most recent zip (or your wish for redis ) from here https://github.com/dmajkic/redis/downloads
  2. The redis zip that is downloaded using the above process. Unzip it in Program Files Redis named folder. Make on if needed. and add environment variable to it's bin folder
 
6. So now postgres, node and redis-rever is already running 


Project related configurations

1. git clone https://github.com/priyankajayaswal1/slack.git
// Default branch to work on is slack
2. Update postgres username and password in  slack\db\config.js file
3. Run `npm install` in slack folder
4. Run `npm run create` followed by `npm run migrate`  - This would set up the Db and tables schema in postgresql [schema can be found in db\migrations folder -> can check for reference]
5. Run `npm run createTest` followed by `npm run migrateTest`  for test environment - This would set up the Db and tables schema in postgresql [schema can be found in db\migrations folder -> can check for reference]
6. Now we need to create .env file and popuate it from .env.example file
7. Populate REDIS_URL="redis://localhost:6379" in .env file
8. Run `npm run debug` to start service
9. Create ngrok tunneling so that internet might listen to our service from outside using the command below. Use the reserved domain name:
  `ngrok http 3000 -subdomain=prjayaswlocal`     3000 is the port where the node service is running
10. Now it's time to create a Slack App and a Github App. as per the details mentioned in Contributing.md file. 


References:

1. NodeJs intallation - https://phoenixnap.com/kb/install-node-js-npm-on-windows
2. redis installation - https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/
3. redis zip download link - https://github.com/dmajkic/redis/downloads
4. Chocolatey postgresql docu - https://chocolatey.org/packages/postgresql
4. Chocolatey redis docu - https://chocolatey.org/packages/redis-64
5. How to update posgres user password - https://stackoverflow.com/questions/12720967/how-to-change-postgresql-user-password
6. How to start postgresql service - https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html
7. How to run redis-server in Windows after installation -  https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windows
    
    





