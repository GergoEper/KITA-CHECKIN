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

router.get("/profileParent", loginCheck(), (req, res, next) =>{

  console.log('this is the cookie: ', req.cookies)
  const loggedInUser = req.session.user
  res.render('profileParent', {user: loggedInUser});
});

router.get("/profileAdmin", loginCheck(), (req, res, next) =>{

  console.log('this is the cookie: ', req.cookies)
  const loggedInUser = req.session.user
  res.render('profileAdmin', {user: loggedInUser});
});


module.exports = router;
