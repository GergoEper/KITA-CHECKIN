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
                res.redirect('/profileAdmin')
            })
            .catch(err => {
                next(err);
            })
        }
    })
  res.redirect("/profileAdmin");
});

router.get('/child/:id', (req, res, next) => {
	console.log(req.params.id);
	const childId = req.params.id;
	// get the book with the clicked id
	Child.findById(childId)
		//.populate('address')
		.then(childFromDB => {
			console.log(childFromDB);
			// render the details view
			res.render('childrenDetails', { childDetails: childFromDB });
		})
		.catch(err => {
			console.log(err);
		})
});

router.get('/child/:id/delete', (req, res, next) => {
	console.log(req.params.id);
	const childId = req.params.id;
	// get the book with the clicked id
	Child.findByIdAndDelete(childId)
		//.populate('address')
		.then(childFromDB => {
			console.log(childFromDB);
			// render the details view
      res.redirect('/profileAdmin');
		})
		.catch(err => {
			console.log(err);
		})
});




router.post("/addClassroom", (req, res, next) => {
    res.redirect("/profileAdmin");
});

router.get('/child/:id/edit', (req, res, next) => {
	// retrieve the book that should be edited	
	const childId = req.params.id;
	Child.findById(childId)
		.then(childFromDB => {
			console.log(childFromDB);
			// render a form with the book details
			res.render('childrenEdit', { child: childFromDB });
		})
});




router.post('/child/:id/edit', (req, res, next) => {
	const childId = req.params.id;
	const { alias, firstname, lastname, birthdate } = req.body;
	Child.findByIdAndUpdate(childId, {
		alias,
		firstname,
		lastname,
		birthdate
	})
		.then(() => {
			res.redirect(`/child/${childId}`);
		})
		.catch(err => {
			console.log(err);
		})
});

router.get("/addClassroom", loginCheck(), (req, res, next) =>{
  res.render("addClassroom");
});

router.post('/child/:id/status', (req, res, next) => {
	const childId = req.params.id;
  console.log('this is to see the status', req.body.status)
	const {status} = req.body;
  console.log('this is to see the status after ', req.body)
  if ( req.body.status === 'out') {
    Child.findByIdAndUpdate(childId, {
      status: 'in',
    })
    .then(() => {
      res.redirect("/profileAdmin");
    })
    .catch(err => {
      console.log(err);
    })
  }

  if (req.body.status === 'in') {
	Child.findByIdAndUpdate(childId, {
		status: 'out',
	})
	.then(() => {
		res.redirect("/profileAdmin");
	})
	.catch(err => {
		console.log(err);
	})
  }
});





module.exports = router;
