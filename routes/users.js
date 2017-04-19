var express = require('express'),
router = express.Router(),
multer = require('multer'),
upload = multer({dest: './uploads'}),
passport = require('passport'),
validator=require('express-validator'),
LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));

router.post('/register', upload.single('profileimage') ,function(req, res, next) {
  var email = req.body.txtemail;
  var password= req.body.txtpass;
  var repassword= req.body.txtrepass;
  var name= req.body.txtuname;
  var address = req.body.txtaddr;
  var city = req.body.txtcity;
  var state = req.body.txtstate;
  var country=req.body.txtcountry;
  var zipcode= req.body.txtzipcode;
  var phone= req.body.txtphone;

//  if(req.file){
//  	console.log('Uploading File...');
//  	var profileimage = req.file.filename;
//  } else {
//  	console.log('No File Uploaded...');
//  	var profileimage = 'noimage.jpg';
//  }

  // Form Validator
  //req.checkBody(name,'Name field is required').notEmpty();
  //req.checkBody(email,'Email field is required').notEmpty();
  //req.checkBody(email,'Email is not valid').isEmail();
  //req.checkBody(name,'Username field is required').notEmpty();
  //req.checkBody(password,'Password field is required').notEmpty();
  //req.checkBody(repassword,'Passwords do not match').equals(req.body.password);

  // Check Errors 
  var errors = req.validationErrors();

  if(errors){
  	res.render('register', {
  		errors: errors
  	});
  } else{
  	var newUser = new User({
      email:email,
      password: password,
      name: name,
      address: address,
      city: city,
      state:state,
      country:country,
      zipcode:zipcode,
      phone: phone
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registered and can login');
//    function(req,res,next)
//    {
//        req.flash('success', 'You are now registered and can login');
//        res.redirect('/views/registered');
//    }    
    res.location('/');
    res.redirect('/users/registered');
  }
} 
            
);
router.get('/registered',function(req,res){
    res.render('registered');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
