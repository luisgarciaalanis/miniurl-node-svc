# miniurl-node-svc
URL shrinking service written in NodeJS using HapiJs.

## On mac or linux you can run this local by doing the following:
1. Install Docker
2. Make sure your user is part of the docker group.
3. Install git
4. Install [Opctl](https://opctl.io/docs/getting-started/opctl.html)
5. Disable MySQL service if installed (this service will spawn a Docker MySQL container).
6. Open a terminal
7. Run: git clone https://github.com/luisgarciaalanis/miniurl-node-svc
8. cd miniurl-node-svc
9. Run: opctl run debug
   - It will download the needed containers and run them.
   - It will create a DB.
   - It will migrate/seed the DB.
   - It will ask for a username and password for the database. (Password can't be root, the database will only be running while the service is running).
10. Run the [frontend service](https://github.com/luisgarciaalanis/miniurl-react)
11. Once the frontend service is running you are done, use http://localhost/

## To stop the service
1. Ctrl+C on the terminal.
   - This will stop and remove the containers.
   - stop the database.
   - database data is inside the project on a folder called data so you can relaunch the service if you need.

## run tests
opts run test
