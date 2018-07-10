var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var crypto = require('crypto')
var session = require('express-session')

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get('/', 
function(req, res) {

if(!req.session.username){
res.redirect('/login')
return;
}

  res.render('index');
});

app.get('/create', 
function(req, res) {
  if(!req.session.username){
res.redirect('/login')
return;
}
  res.render('index');
});

app.get('/links', 
function(req, res) {
console.log(req.session)
if(!req.session.username){
res.redirect('/login')
return;
}
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
});

app.post('/links', 
function(req, res) {
// if(!req.session.username){
//   res.redirect('/login')
// return;
// }

  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.status(200).send(found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        Links.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        })
        .then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
});

app.get('/login', 
function(req, res) {
  if(req.session.username){
    res.redirect('/')
    return  
  }
  res.render('login')
});

app.get('/signup', 
function(req, res) {
   if(req.session.username){
    res.redirect('/')
    return  
  }
  res.render('signup')
});
/************************************************************/
// Write your authentication routes here
/************************************************************/

const createUser = (req,res)=>{

  var user = new User({"username" : req.body.username});
    user.fetch().then(function(found) {
      console.log(found,'found')
      if (found) {
        throw ("user already exists")
      }
      const salter = 'this is some salt for your password'
      const hashedPass = req.body.password + salter
      return Users.create({"username": req.body.username, "password": hashedPass});
    })
  .then(user => {
req.session.username = req.body.username;
    res.redirect('/');
  }) 
  .catch(err =>{
      console.log('catch statement error', err)
    })
}


const loginUser = (req,res)=>{

var user = new User({"username" : req.body.username});

  const salter = 'this is some salt for your password'

  let hashedPass = req.body.password + salter

  var shasum = crypto.createHash('sha1');
  shasum.update(hashedPass);
  hashedPass = shasum.digest('hex');

console.log('searching for user in db')
  user.fetch().then(function(found) {
console.log(found)
console.log('pass is same', found.get('password'), hashedPass)
    if (found && found.get('password')===hashedPass) {
 console.log('found user in db')
// var sessData = req.session;
req.session.username = req.body.username;
console.log(req.session)
      res.redirect('/');
      return;
    }
 console.log('not logged in')

    res.status(400).send('Invalid Credentials');
}) 
.catch(err =>{
  console.log(err)
    res.status(500).send('server error',err)
  })
}

app.post('/login',function(req,res){
console.log('trying to login',req.body)
if(!req.body.username || !req.body.password){
    res.status(400).send('invalid user info')
    return
  }else{
      loginUser(req,res)
      return;
  }
});

app.post('/signup',
function(req,res){
// console.log(req.body)
  if(!req.body.username || !req.body.password){
    res.status(400).send('invalid user info')
    return
  }else{
      createUser(req,res);
      return;
  }
});

app.get('/logout',
function(req,res){
if(!req.session.username){
res.redirect('/login')
return;
}
console.log('logging user out')
  req.session.destroy()
  res.redirect('/')
});

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        linkId: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

module.exports = app;
