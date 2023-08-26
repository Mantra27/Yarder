
module.exports = {
        client: 'local',
        client_id: null, //<could_use_cookie>
        client_secret: null, //<could_use_cookie>
        redirect_url: '/local/callback',
        success_redirect: '/local/success',
        failure_redirect: '/login',
        cb: (req:any, res:any, callback:any, cookie:any /*cookie is optional*/)=>{
          // validate username and password
          // if(cookie) return ValidateCookie(cookie, (result:String)=>{callback(null, {username: result.username)})
          if(req.body.username == "admin" && req.body.password == "admin"){
            return callback(null, {username: req.body.username, password: req.body.password})
          }
          
        }
}