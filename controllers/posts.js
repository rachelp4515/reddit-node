const Post = require('../models/post');

module.exports = (app) => {

    app.get('/', (req, res) => {
        const currentUser = req.user;
      
        Post.find({})
          .then((posts) => {
              console.log(posts)
               res.render('posts-index', { posts, currentUser })
            })
          .catch((err) => {
            console.log(err.message);
          });
      });


    app.get('/posts/new', (req, res) => {
        res.render('posts-new')
    });


    app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        const post = new Post(req.body);

        // SAVE INSTANCE OF POST MODEL TO DB AND REDIRECT TO THE ROOT
        post.save(() => res.redirect('/'));
    });



    app.get('/posts/:id', (req, res) => {
        const currentUser = req.user;
        Post.findById(req.params.id).populate('comments').lean()
          .then((post) => res.render('posts-show', { post, currentUser }))
          .catch((err) => {
            console.log(err.message);
          });
      });
      
      // SUBREDDIT
      app.get('/n/:subreddit', (req, res) => {
        const { user } = req;
        Post.find({ subreddit: req.params.subreddit }).lean()
          .then((posts) => res.render('posts-index', { posts, user }))
          .catch((err) => {
            console.log(err);
          });
      });



}