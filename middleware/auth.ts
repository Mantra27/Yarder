module.exports = async (req:any, res:any, next:Function) => {
    if(req.user) return next()
    return res.status(401).send({status: 401, error: "user not authenticated"})
}