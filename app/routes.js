module.exports = function(app, passport, db) {
const ObjectId = require('mongodb').ObjectID
const multer = require('multer');
const path = require('path')
// normal routes ===============================================================
// configure multer to store uploaded files in the "uploads" directory
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/'); // added public
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('allMovies').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            movies: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

app.post('/movies', upload.single('img'), (req, res) => {
  const file = req.file;
  db.collection('allMovies').insertOne({userId: req.user._id,movieName: req.body.movieName, img: req.body.img, year: req.body.year, description: req.body.description, yourRating: req.body.yourRating, imgName: file.originalname, imgPath: file.path}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/profile')
  })
})

    app.put('/movies', (req, res) => {
      console.log(req.body)
      db.collection('allMovies')
      .findOneAndUpdate({_id: ObjectId(req.body.movieid)}, {
        $set: {
          'yourRating' : req.body.yourRating
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
    
  
    // app.delete('/movies', (req, res) => {
    //   db.collection('allMovies').findOneAndDelete({movieName: req.body.movieName, year: req.body.year, description: req.body.description, yourRating: req.body.yourRating}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

    app.delete('/movies', (req, res) => {
      db.collection('allMovies').findOneAndDelete({_id: ObjectId(req.body.movieid)}, (err, result) => {
        if (err) return res.send(500, err);
        res.send('Movie deleted!');
      });
    });
    

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
