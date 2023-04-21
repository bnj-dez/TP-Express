export default function isAuthenticated(req, res, next) {
    if (req.session && req.session.isLogged === true && req.session.name) {
        next();
        return;
    }

    res.redirect("/login");
}