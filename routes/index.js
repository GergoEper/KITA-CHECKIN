const Parent = require("../models/Parent");
const User = require("../models/User.model");
const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const loginCheck =() => {
  return (req, res, next) => {
    if (req.session.user){
      next();
    } else {
      res.redirect('/login')
    }
  } 
}

router.get("/profileParent/:id", loginCheck(), (req, res, next) =>{
  console.log('this is the cookie: ', req.cookies)
  
  const loggedInUser = req.session.user
  User.findById(loggedInUser._id)
  .then(userFromDB => {
    res.render('profileParent', {user: userFromDB});
  })
  .catch(err => {console.log(err);})
});

// router.get('/movies/:id/edit', (req, res, next) => {

//   Movie.findById(req.params.id)
//   .populate('cast')
//   .then(movieFromDB => {

//     // render the details view
//     res.render('movies/edit', { movieEdit: movieFromDB });
//   })
//   .catch(err => {
//     console.log(err);
//   })
// });














router.get("/profileAdmin", loginCheck(), (req, res, next) =>{
  console.log('this is the admin', req.session.user)
  if(req.session.user.role === 'admin'){
    console.log('this is the cookie: ', req.cookies)
    const loggedInUser = req.session.user
    res.render('profileAdmin', {user: loggedInUser});
  } else {
    res.redirect('/login')
  }
});


module.exports = router;
