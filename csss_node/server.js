var express = require('express'),
    app = express(),
    port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Server started on: ' + port);
});

// request handlers
app.get('/', (req, res) => {
    res.send('Welcome to the first Node.js Tutorial! - Clue Mediator');
});