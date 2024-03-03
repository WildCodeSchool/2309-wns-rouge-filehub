# FileHub

Transfer with confidence, share with ease.

## Getting Started

This project contains the backend and the frontend.

### Prerequisites

- Docker
- Node.js
- npm

### Starting the Server and Database

Run this command at the root of the project to start the server and database:

```
docker compose up --build
```

### Starting the Frontend

```
npm run dev
```

### Contributors

- [Daryl-Ch](https://github.com/Daryl-Ch)
- [FlavinouTheOne](https://github.com/FlavinouTheOne)
- [PierreQuignon](https://github.com/PierreQuignon)
- [remi59800](https://github.com/remi59800)
- [nguyen-tt](https://github.com/nguyen-tt)

### Launching backend integration tests with jest :

- Open a terminal, position yourself at the parent folder of the project and run the command: docker compose up db
- Open a second terminal, position yourself in the 'tests' folder and run the command: npx jest resolverUser.spec.ts --watch

#### Lauching backend unitary test timestamp with jest :

- Open terminal, position yourself in the 'tests' folder and run the command: npx jest timestamp.spec.ts
