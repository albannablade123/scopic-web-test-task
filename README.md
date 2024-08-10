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

## Running the Application

### Cloning the repository

1st step is to clone the repository, cd into the cloned repo and from here it mainly contains two directories: auction_web_api (for the backend) and auction-website-frontend that houses the front end.
```
https://github.com/albannablade123/scopic-web-test-task.git
cd scopic-web-test-task
```

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