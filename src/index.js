import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', (req, res) => res.send('Hello Node!'))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));