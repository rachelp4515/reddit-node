const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = app => {
    // -----LOGIN FORM
    app.get('/login', (req, res) => res.render('login')) 

    // -----LOGIN POST
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        // Find this user name
        User.findOne({ username }, 'username password')
          .then((user) => {
            if (!user) {    // User not found
              return res.status(401).send({ message: 'Wrong Username or Password' });
            }
            user.comparePassword(password, (err, isMatch) => {    // Check the password
              if (!isMatch) {
                return res.status(401).send({ message: 'Wrong Username or password' }); // Password does not match
              }
              // Create a token
              const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                expiresIn: '60 days',
              });
              res.cookie('nToken', token, { maxAge: 900000, httpOnly: true }); // Set a cookie and redirect to root
              return res.redirect('/');
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });

    // ----- SIGN UP FORM
    app.get('/sign-up', (req, res) => res.render('sign-up')); 

    // -----SIGN UP POST
    app.post('/sign-up', (req, res) => {
        // Create User and JWT
        const user = new User(req.body);
        user
            .save()
            .then(() => {
                const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                return res.redirect('/');
            });
    });
    // -----LOGOUT
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        return res.redirect('/');
    });
};