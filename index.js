const express = require('express');

const postsRouter = require('./posts/posts-router.js'); //import the posts-router file, store in postsRouter


const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h>
    
  `);
});

//if it starts with /api/posts use posts-router
server.use('/api/posts', postsRouter);


server.listen(4000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});
