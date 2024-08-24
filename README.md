# scopic-web-test-task
The Antique Auction Web Application is designed to facilitate the buying and selling of antique items through an online auction system. Users can browse items, place bids, and view auction details, while admin users can set up items for auction and manage the overall auction process.

The application is built using Django for the backend and Next.js for the frontend, providing a robust and scalable architecture.

### General Requirements
- **Git**: Version control system to clone the repository.
- **Python 3.8+**: For running the Django backend.
- **Node.js 14+**: For running the Next.js frontend.
- **npm or Yarn**: Node package managers to install dependencies for the frontend.

### Python Requirements
- **Django**: Web framework for the backend.
- **Django REST Framework**: For building RESTful APIs.
- **Other dependencies**: As listed in `requirements.txt`.

### Node.js Requirements
- **Next.js**: React framework for building server-side rendered applications.
- **Other dependencies**: As listed in `package.json`.

### OpenAPI specificiation
REST API specification of the backend can be viewed through OpenAPI with Swagger UI, either locally or through importing the openapi.yaml file on swagger editor at https://editor.swagger.io/ 

### SMTP settings
This project utilizes Django gmail SMTP, thus a new email hasantest304@gmail.com is created to send email notifications and configuration can be found in auction_web_api/auction_web_api/settings.py

### Note on Database
Due to limitation of sqlite that prevents multiple containers to access the database, the db.sqlite3 is included in the repository, and is required for the application to function properly. Thus when cloning the repository, ensure that the db.sqlite3 is included. 

## Running the Application 

### Cloning the repository

1st step is to clone the repository, cd into the cloned repo and from here it mainly contains two directories: auction_web_api (for the backend) and auction-website-frontend that houses the front end.
```
https://github.com/albannablade123/scopic-web-test-task.git
cd scopic-web-test-task
```

### Main Option : Running through Docker
## 2. Build and Run the Containers:
Requirement: docker, docker-compose

It is recommended to run this project through docker through docker-compose due to notification requirements. after cloning and changing directory, to scopic-web-test-task. Run the following command

```
docker-compose run --build
```

This will build and run containers, with the front-end container being in port localhost:3000 while the django back-end is in localhost:8000
The --build flag ensures that Docker rebuilds the images before starting the containers.
The containers can also be run in detached mode (in the background), using the -d flag:

```
docker-compose up --build -d
```

## 3. Access the Application:
Once the containers are up and running, you can access the application at the following URLs:

- Front-end: http://localhost:3000
- Django Back-end API: http://localhost:8000

Refer to OpenApi spec for REST Endpoints


### Email Notification note:
To ensure that email notification is working, users should update their default email in Profile and change it to a proper email so they can receive email notification

## 4. Stopping the Containers:

To stop the running containers, use:

```
docker-compose down
```

## 6. Additional Commands:
View Logs: To view the logs of the running containers:

```
docker-compose logs
```

Execute Commands Inside Containers: To open a shell inside a running container, use:

```
docker-compose exec <service_name> /bin/bash
```
Replace <service_name> with the name of the service you want to access (e.g., auction-frontend or django_gunicorn).

## TroubleShooting

- Build Issues: If you encounter issues with building the Docker images, try cleaning up any cached images and rebuild:
```
docker system prune -a
docker-compose up --build

```
Port Conflicts: Ensure that ports 3000 and 8000 are not being used by other services on your host machine. You may need to stop other applications or change the ports in the docker-compose.yml file.

### IMPORTANT !
Another persistent problem is that Django command fails particularly entrypoint.sh, causing either migration or inserting fixtures to db to fail too. This is due to git automatically converting LF to CLRF. To solve this, ensure that entrypoint.sh is parsed using LF instead of CLRF before running the container. 


## Running Locally (Not Recommended)
### Setting up and Starting the Django Back-end server

#### Change directory to auction_web_api application 

```
cd auction_web_api
```

#### Set up virtual environment
python3 -m venv env

activate virtual environment depending on the OS:

- macOS/Linux
```
source env/bin/activate
```

- Windows
```
.\env\Scripts\activate
```

#### Install dependencies
```
pip install -r requirements.txt
```

#### Make and apply migrations
Make migrations ( Note: If there is permission error in windows, make sure to run cmd/powershell/terminal in administrator mode)
```
python manage.py makemigrations
```

Apply migrations
```
python manage.py migrate
```
### Populate the server with data
To populate the server with existing data, run 
```
python manage.py loaddata users.json
python manage.py loaddata items.json
```

This will automatically create two users: 
- 1 admin user with credentials username:admin1, password: admin2  
- 1 non admin user with username:user1 and password:user2
this will automatically generate existing auction item within the server.
#### Run the development server
```
python manage.py runserver
```
### Setting up and Starting the Front-End 

Change directory to auction-website-frontend
```
cd auction-website-frontend
```

#### Install Dependencies

with npm
```
npm install
```
with yarn

```
yarn install
```

#### Running the project
It is highly recommended to use dev mode for the purpose of this task

with npm
```
npm run dev
```

with yarn 
```
yarn dev
```