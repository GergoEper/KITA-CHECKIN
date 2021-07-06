const Parent = require("../models/Parent");
const User = require("../models/User.model");
const router = require("express").Router();
const Child = require("../models/Child");

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
 // console.log(req)
  const loggedInUser = req.session.user
  User.findById(loggedInUser._id)
  .then(userFromDB => {
    res.render('profileParent', {user: userFromDB});
  })
  .catch(err => {console.log(err);})
});


router.get("/profileAdmin", loginCheck(), (req, res, next) =>{
  console.log('this is the admin', req.session.user)
  if(req.session.user.role === 'admin'){
    console.log('this is the cookie: ', req.cookies)
    const loggedInUser = req.session.user
    console.log(loggedInUser)
    Child.find()
    .then(allChildren => {
      res.render('profileAdmin', {childrenList: allChildren, user: loggedInUser });
    })
  } else {
    res.redirect('/login')
  }
});

router.get("/addChild", loginCheck(), (req, res, next) =>{
  res.render("addChild");
});


router.post("/addChild", (req, res, next) => {
console.log(req.body)
  const {alias} = req.body;
  console.log(alias)

  Child.findOne({alias: alias})
    .then(childFromDb => {
        if(childFromDb !== null){
            res.render('addChild', {message: 'This child is already in the DB'})
            return
        } else {
           
           Child.create(req.body)
            .then(createdChild => {
                res.redirect('/profileAdmin', { newChild: createdChild})
            })
            .catch(err => {
                next(err);
            })
        }
    })


  //   //firstname: String,
  //   lastname:  String,
  //   birthdate: String,
  //   parent: [{
  //       type: Schema.Types.ObjectId,
  //       ref: 'User.model'
  //     }],
  //   contactData: {
  //       address: {
  //           street: String, 
  //           houseNumber: String,
  //           city: String,
  //           zipCode: Number
  //       },
  //       phoneNumber: { 
  //       }
  //   },
  //   status: {
  //       type: String,
  //       enum: ['in', 'out'],
  //       default: 'out', 
  // //  }    

  res.redirect("/profileAdmin");
});


router.post("/addClassroom", (req, res, next) => {
    res.redirect("/profileAdmin");
});

module.exports = router;
