var express = require('express');
var router = express.Router();
var User = require('../model/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Users Information' });
});

router.post('/register', async(req, res, next) => {
  try {
    var user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async(req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json({error: "Email/Password required"});
  }
  try {
    var user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({error: "Email not register"});
    }
    var result = await user.verifyPassword(password);
    if(!result) {
      return res.status(400).json({error: "Invalid Password"});
    }
    if(result) {
      
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router;
