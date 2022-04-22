const Post = require("../models/post");
const User = require("../models/user");

module.exports = (app) => {
  app.get("/", (req, res) => {
    const currentUser = req.user;

    Post.find({})
      .then((posts) => {
        console.log(posts);
        res.render("posts-index", { posts, currentUser });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.get("/posts/new", (req, res) => {
    res.render("posts-new");
  });

  app.post("/posts/new", (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    console.log(req.user)
    if (req.user) {
      const userId = req.user._id;
      const post = new Post(req.body);
      post.author = userId;

      post
        .save()
        .then(() => User.findById(userId))
        .then((user) => {
            console.log(post, "hERE")
          user.posts.unshift(post);
          user.save();
          // REDIRECT TO THE NEW POST
          return res.redirect(`/posts/${post._id}`);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.redirect("/"); // UNAUTHORIZED
    }
  });

  app.get("/posts/:id", (req, res) => {
    const currentUser = req.user;
    Post.findById(req.params.id)
      .populate("comments")
      .lean()
      .then((post) => res.render("posts-show", { post, currentUser }))
      .catch((err) => {
        console.log(err.message);
      });
  });

  // SUBREDDIT
  app.get("/n/:subreddit", (req, res) => {
    const { user } = req;
    Post.find({ subreddit: req.params.subreddit })
      .lean()
      .then((posts) => res.render("posts-index", { posts, user }))
      .catch((err) => {
        console.log(err);
      });
  });
};
