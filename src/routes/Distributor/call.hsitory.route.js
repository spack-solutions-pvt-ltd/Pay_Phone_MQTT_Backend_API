const router = require("express").Router();


const { getAllCallHistory } = require("../../controller/Distributor/call.history.controller");

router.get('/', getAllCallHistory)

module.exports = router;