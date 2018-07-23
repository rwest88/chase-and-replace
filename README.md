# Kings: Chase and Replace

A Full-Stack MERN web app (MongoDB, Express.js, React, Node.js)

- A variation of the drinking game, Kings!
- Like Kings, players take turns drawing cards, each card rank (2 through King) prompts the player (or the group) to perform a task.
- When a player draws an Ace, he/she then changes one of the rules associated with a chosen card rank, which sticks around permanently. Because of this, the game evolves the more it is played.
- The user can save into a version history when he/she is satisfied with the rules.
- Games can be created from scratch, can be searched for by name, author, and keywords and themes, and all games set to 'public' can be forked, downloaded, and rated.

#### Packages Used

- axios
- bcrypt
- bcrypt-nodejs
- body-parser
- express
- express-session
- if-env
- insert-css
- moment
- mongoose
- morgan
- passport
- passport-local
- react-moment
- react-star-rating-component

## Installation

After cloning the repo, follow the steps below:
```sh
$ cd chase-and-replace
```
```sh
$ yarn install
```
```sh
$ mongod
```
```sh
$ yarn start
```

## Screenshots

Home page before login:

![Alt Home Page](/README/home.png?raw=true)

Sign up page:

![Alt Signup Page](/README/signup.png?raw=true)

Login page:

![Alt Login Page](/README/login.png?raw=true)

Dashboard which is only accessible after login:

![Alt Dashboard](/README/dashboard.png?raw=true)

#### Wireframes

Landing page - https://wireframe.cc/rW5Vhe

Dashboard - https://wireframe.cc/UR7GB2

Create / Edit - https://wireframe.cc/qh8uv0

Search -https://wireframe.cc/DQFgr3
