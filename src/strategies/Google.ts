require("dotenv").config(require("path").join(__dirname, "../../"));
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = {
    client: "google",
    client_id: client_id,
    client_secret: client_secret,
    redirect_url: '/google/callback',
    success_redirect: '/',
    failure_redirect: '/login',
    scope: ["email", "profile"]
}