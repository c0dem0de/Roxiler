## Installation

```bash
$ pnpm install
```

## Setting up the environment variables

Create a .env file in the root of the project and add the following (replace the values with your own):

```bash
SECREAT_KEY= 'secretKey'
DB_HOST='localhost'
DB_PORT=3306
DB_USER='database user'
DB_PASSWORD= 'database password'
DB_NAME= 'database name'
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
