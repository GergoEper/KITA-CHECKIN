
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
  const loggedInUser = req.session.user
  User.findById(loggedInUser._id)
  .populate('child')
  .then(userFromDB => {
    res.render('profileParent', {user: userFromDB});
  })
  .catch(err => {console.log(err);})
});


router.get("/profileAdmin", loginCheck(), (req, res, next) =>{
  if(req.session.user.role === 'admin'){
    const loggedInUser = req.session.user
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
  const {alias} = req.body;
  Child.findOne({alias: alias})
    .then(childFromDb => {
        if(childFromDb !== null){
            res.render('addChild', {message: 'This child is already in the DB'})
            return
        } else {
           Child.create(req.body)
            .then(() => {
                res.redirect('/profileAdmin')
            })
            .catch(err => {
                next(err);
            })
        }
    })
  res.redirect("/profileAdmin");
});


router.get('/child/:id/parent', (req, res, next) => {
	const childId = req.params.id;
	Child.findById(childId)
	.populate('parent')
		.then(childFromDB => {
			// render the details view
			res.render('childrenDetailsParent', { childDetails: childFromDB });
		})
		.catch(err => {
			console.log(err);
		})
});

router.get('/child/:id', (req, res, next) => {
	const childId = req.params.id;
	Child.findById(childId)
	.populate('parent')
		.then(childFromDB => {
			// render the details view
			res.render('childrenDetails', { childDetails: childFromDB });
		})
		.catch(err => {
			console.log(err);
		})
});


router.get('/child/:id/delete', (req, res, next) => {
	const childId = req.params.id;
	Child.findByIdAndDelete(childId)
	//	.populate('address')
		.then(childFromDB => {
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
	const childId = req.params.id;
	Child.findById(childId)
		.then(childFromDB => {
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
	const {status, timestamp, updatedAt} = req.body;

  if ( req.body.status === 'out') {
    Child.findByIdAndUpdate(childId, {
      status: 'in',
     "$push": { timestamp: new Date().toGMTString()} ,
    })
    .then(() => {
      console.log('this is Date.now console.log:', typeof Date.now())
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

router.post('/connectParent/:id', (req, res, next) => {
  const {username} = req.body;
  childId = req.params.id;
  console.log('does it contain child ID before:', childId)
    User.findOne({username: username})
    .then(userFromDB => {
      console.log('does it contain user before ID:', userFromDB)
			Child.findByIdAndUpdate(childId, {
        "$push": { parent: userFromDB._id } 
      })
      .then(a => {
        console.log('does it contain user ID:', a)
        console.log('does it contain child ID:', childId)
        User.findByIdAndUpdate(userFromDB._id, {
          "$push": { child: childId } 
        })
        .then(() => {
          res.redirect(`/child/${childId}`);
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch(err => {
        console.log(err);
      })
		})
    .catch(err => {
      console.log(err);
    })
});



module.exports = router;
