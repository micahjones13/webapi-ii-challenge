const express = require('express');
const Posts = require('../data/db.js'); //take all the stuff from db.js

const router = express.Router(); //use router instead of server
router.use(express.json()); //parse json
module.exports = router; //export this for the index file

//POST  Creates a post using the information sent inside the `request body`.
router.post('/', (req, res) => {
    const postInfo = req.body;
    if(!postInfo.title || !postInfo.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else{
        Posts.insert(postInfo)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
})
//POST Creates a comment for the post with the specified id using information sent inside of the `request body`.
router.post('/:id/comments', (req, res) => {
    // const { id } = req.params;
    const commentInfo = req.body;

    if(!commentInfo.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Posts.insertComment(commentInfo)
        .then(comment => {
            if(comment){
            res.status(201).json(comment);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        })
    }
})
//GET Returns an array of all the post objects contained in the database.   
router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
})
//GET SPECIFIC Returns the post object with the specified id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
    .then(post => {
        if(post && post.length){ //remember post.length because of it returning an empty array
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
})
//GET COMMENTS Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts.findPostComments(id)
    .then(comments => {
        if(comments && comments.length){
            res.status(200).json(comments);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist or there are no comments" })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    })
})
//DELETE Removes the post with the specified id and returns the **deleted post object**.
// You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
   Posts.findById(id)
    // Posts.remove(id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            Posts.remove(id)
            .then(deleted => {
                res.status(200).json(post);
            })
            .catch(err => {
                res.status(500).json({ error: "The post could not be removed" });
            })
        }
    })
})

//     .then(post => {
//         if (post){
//             res.status(200).json(postInfo);
//         } else {
//             res.status(404).json({ message: "The post with the specified ID does not exist." })
//         }
//     })
//     .catch(err => {
//         res.status(500).json({ error: "The post could not be removed" });
//     })
// })
//PUT Updates the
//post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. 
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    if (!changes.title || !changes.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.update(id, changes)
        .then(updated => {
            if(updated){
                res.status(200).json(updated);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." });
        })
    }
})