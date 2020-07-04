const express = require("express");
const router = express.Router();
const path = require('path');
const questionModel = require('../schemas/questionSchema')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/addQuestion.html'))
})

router.post('/add', async (req, res) => {
    try {
        const newQuestion = new questionModel({
            part1: req.body.part1,
            part2: req.body.part2
        });
        await newQuestion.save()
        res.redirect('/addQuestion')
    } catch (error) {
        res.redirect('/allError')
    }
})
module.exports = router;