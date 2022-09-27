const express = require('express');
const router = express.Router();

router.get('/common/heath_check', ((req, res) => {
    return res.status(200).json({
        "status": 1
    })
}));

module.exports = router;
