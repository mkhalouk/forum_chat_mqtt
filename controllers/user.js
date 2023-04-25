const User = require('../models/user.model');
const bcrypt = require('bcrypt');

async function signUp(req, res, next) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      topic_token: 'private_topic/'+req.body.username
    });

    await user.save();
    req.session.user = user; // on se connecte en même temps
    res.redirect('/home');
  } catch (error) {
    next(error);
  }
}

async function checkUser(req, res, next) {
  try {
    const { email, username } = req.query;

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    }

    res.json({ exists: !!user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });
    const password = req.body.password;
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/home');
      } else {
        res.render('pages/login', { error: 'Incorrect password' });
      }
    } else {
      res.render('pages/login', { error: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
}


async function getUserTopic(username) {
  const user = await User.findOne({ username });
  return user ? user.topic_token : null;
}

// FIXME: This is a temporary fix for a bug in the mqtt library.
// async function sendMessage(req, res) {
//   const message = req.body.message;
//   const recipientUsername = req.body.recipientUsername;
//   const senderUsername = req.session.user.username;
//   const recipientTopic = await getUserTopic(recipientUsername);
//   const senderTopic = await getUserTopic(senderUsername);
//   if (recipientTopic && senderTopic) {
//     mqtt.sendMessage(recipientTopic, `${senderUsername}: ${message}`);
//     mqtt.sendMessage(senderTopic, `${senderUsername}: ${message}`);
//   }
//   res.redirect('/chat');
// }

module.exports = {
  signUp,
  checkUser,
  login,
  // sendMessage
};
