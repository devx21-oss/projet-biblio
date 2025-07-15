const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController.js');

router.get('/users', getUsers);
router.post('/register', createUser);

module.exports = router;