# System setup requirement 
1. Setup nodejs and npm using Windows installer  from here https://nodejs.org/en/download/ - chocolatey would be installed along with this that would be helpful for later installations.
2. Once chocolatey is installed install mysql using the following command in admin mode (remember to check log for Generated password for postgres user):
`choco install mysql  redis-64 `
3. Run `mysqld` to start mysql server as image below
![mysql](https://github.com/priyankajayaswal1/slack/blob/slack/png-files/mysql.PNG)

5. Run redis-server using command `redis-server` (If it down't work follow below steps and rerun this command)
    - Download the most recent zip (or your wish for redis ) from here https://github.com/dmajkic/redis/downloads
    - The redis zip that is downloaded using the above process. Unzip it in Program Files Redis named folder. Make on if needed. and add environment variable to it's bin folder
 
6. So now mysql, node and redis-rever is already running 

### Chocolatey Installation:

![installation](https://github.com/priyankajayaswal1/slack/blob/slack/png-files/installation.PNG)

### Redis Installation:

![redis](https://github.com/priyankajayaswal1/slack/blob/slack/png-files/redis-installation.PNG)

# Project related configurations

1. git clone https://github.com/github/slack 
<br/> The above repo is the private repo link we want to work with and we'd use master
2. Run `npm install` in slack folder
3. Now we need to create `.env` file and popuate it from `.env.example` file
4. Open .env file created and follow steps to create `STORAGE_SECRET` and `SESSION_SECRET`.
5. Populate `REDIS_URL="redis://localhost:6379"` in .env file
6. Populate `DATABASE_URL="mysql://root@127.0.0.1:3306/slack_dev"` in .env file
7. Run `.\node_modules\bin\sequalize create`
8. Run  `npm run migrate`  - This would set up the Db and tables schema in mysql [schema can be found in db\migrations folder -> can check for reference]
5. Run `npm run createTest` followed by `npm run migrateTest`  for test environment - This would set up the Db and tables schema in postgresql [schema can be found in db\migrations folder -> can check for reference]
9. Run `npm run dev` to start service
10. Create ngrok tunneling so that internet might listen to our service from outside using the command below. Use the reserved domain name:
  `ngrok http 4001 -subdomain=prjayaswlocal`  -   3000 is the port where the node service will/is running
11. The webpage for this service can be accessed at `http://<your-subdomain>.ngrok.io/`
12. Now it's time to create a Slack App and a Github App. as per the details mentioned in Contributing.md file.
13. Github app - https://github.com/priyankajayaswal1/slack/blob/slack/CONTRIBUTING.md#configuring-a-github-app
14. Slack App - https://github.com/priyankajayaswal1/slack/blob/slack/CONTRIBUTING.md#configuring-a-slack-app


## References:

1. NodeJs intallation - https://phoenixnap.com/kb/install-node-js-npm-on-windows
2. redis installation - https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/
3. redis zip download link - https://github.com/dmajkic/redis/downloads
4. Chocolatey postgresql docu - https://chocolatey.org/packages/postgresql
4. Chocolatey redis docu - https://chocolatey.org/packages/redis-64
5. How to update posgres user password - https://stackoverflow.com/questions/12720967/how-to-change-postgresql-user-password
6. How to start postgresql service - https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html
7. How to run redis-server in Windows after installation -  https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windows
    
    


## IN case you want to work on this repo (public repo ) follow below steps:

Explicitly install postgres - 
1. Using chocolatey `choco install postgresql` in admin mode
2. Update the environment variable with PostGresql path. Location would be of this form "C:\Program Files\PostgreSQL\12\bin"  - Might differ for your system.
[ env variable setting path -> Click on properties in This PC -> advanced System settings (on left panel) -> Environment variable -> Edit PATh and add above location)
4. Update the *postgres* user password by using the one which is generated as can be seen in the logs while installation.  (this takes sometime) using :
    - Updating env variable
    - Opening psql client using postgres user and password in the logs while installation i.e., `psql -Upostgres`
    - Once the postgresql# prompt shows alter the user's password by running following command - `ALTER USER postgres WITH PASSWORD '<yourpassword>';`
    - Use this password and the username to update the file at <Working_Directory>\slack\db\config.js file.
    - Check if server is running using : `pg_ctl -D "C:\Program Files\PostgreSQL\12\data" status` : path may vary for you.
    - Start the postgresql servcer using command: `pg_ctl -D "C:\Program Files\PostgreSQL\12\data" start`  - the path mentioned here might vary for you. Check an use.
    - If there is any issue try to check logs and resolve.
        - If something else is running at 5432 port use the command in "powershell" now to figure it out.
        - If needed kill the running process and restart again
        - `Get-Process -Id (Get-NetTCPConnection -LocalPort <portNumber>).OwningProcess`
        - `tskill <typeyourPIDhere>`  from above
       
3. Get the node, postgresql and redis running. 
