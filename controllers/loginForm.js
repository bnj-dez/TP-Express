export default async function loginForm(req, res) {
    return res.render("login", req.query.validationMessage ? { validationMessage: 'Formulaire valide !'} : null);
}
