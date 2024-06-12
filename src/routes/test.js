const express = require('express');
const router = express.Router();
const Profile = require('../app/models/Profile');
const User = require('../app/models/User');

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Profile.findOne({ _id: id })
        .populate('userId')
        .then(profile => {
            res.json(profile);
        })
        .catch(err => res.json({ error: err }));
})

module.exports = router;