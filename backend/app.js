const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => console.log(`Togira backend listening at http://localhost:${port}`));

// serve the frontend dist directory from the root
app.use('', express.static('../frontend/dist'));

// test
app.get('/hello', (req, res) => res.send('Hello World!'));
