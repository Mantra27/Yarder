const router = require("express").Router();
const zerouth = require("0uth");
const Google = require('../strategies/Google');
const Local = require('../strategies/Local');

//login strategies
router.use(zerouth("/google", Google));
//accepts authentication credentials from req.body
router.use(zerouth("/local-login", Local));

router.get("/logout", (req:any, res:any, next:Function)=>{
    req.logout(function(err:any) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
});

router.post("/local/success", (req:any, res:any)=>{
  res.send(req.user)
});

module.exports = router;
export{}