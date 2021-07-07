const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

//GET Register page 
router.get("/signup", (req, res, next) => {
    console.log(req.session)
res.render("signup");
});

router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post("/signup", (req, res, next) => {
    console.log('testing for role:', req.body)
    // get the username and password from the req.body and make it to objects
    const {username, password, role, firstname, lastname, street} = req.body;
    // check if username and password are in the right format
    if (password.length < 8){
        res.render('signup', {message: 'Your password has to be 8 characters min'})
        return;
    }

    if (username.length === 0){
        res.render('signup', {message: 'Your Username can not be empty'})
        return;
    }
    // then if username and password are in correct format 
    // check if username is already taken

    User.findOne({username: username})
    .then(userFromDb => {
        if(userFromDb !== null){
            res.render('signup', {message: 'Your username is already taken'})
            return
        } else {
            // username is not used, lets create username and password for this User
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
           // console.log(hash)
           User.create({username: username, password: hash, role: role, firstname, lastname, street})
            .then(createdUser => {
                res.redirect('/login')
            })
            .catch(err => {
                next(err);
            })
        }
    })
});
  
router.post("/login", (req, res, next) => {
    
    // get the username and password from the req.body/input field and make it to objects
    const {username, password} = req.body;
    // check if username and password are in the right format

    User.findOne({username: username})
    .then(userFromDb => {
        if(userFromDb === null){
            res.render('login', {message: 'Invalid credentials'})
            return
        }
        // if the username is correct -> check the password from the input against the hash in the db
        else if(bcrypt.compareSync(password, userFromDb.password) && userFromDb.role === 'parent'){
            console.log('auth post login ', userFromDb)
           console.log('session before assigning ', req.session)
            // this is important because req.session is something you can access outside the method and we need it to store the data to assign it the next step.
           req.session.user = userFromDb;
           
           console.log('auth req session: ', req.session)
            res.redirect(`/profileParent/${userFromDb._id}`);
           // profileParent/${userFromDb._id}
            
        } 
        else if(bcrypt.compareSync(password, userFromDb.password) && userFromDb.role === 'admin'){
            console.log(userFromDb)
            req.session.user = userFromDb;
            res.redirect("/profileAdmin");

            
        } else {
            // if that is not matching password is incorrect.
            
            res.render('login',{message :  'invalid credentials'})
            return;
        }
    })
});


router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/');
        }
    })
})

module.exports = router;
