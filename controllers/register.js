import { UserModel } from '../Models/User.js'
import {createHmac} from "node:crypto";
import argon2 from "argon2";

export default async function register(req, res) {
    const fieldName = {lastName: 'Nom', firstName: 'Prénom', password: 'mot de passe', password_confirm: 'confirmation mot de passe', email: 'email'}
    let errorMessage = false;
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.email = email;

    // Gestion des erreurs
    if(Object.keys(req.body).length !== 5 ) {
        req.flash('errors', 'Bien essayé');
        errorMessage = true;
    }
    for (const [key, value] of Object.entries(req.body)) {
        if(value === '') {
            req.flash('errors', `Le champ ${fieldName[key]} ne doit pas être vide`);
            errorMessage = true;
        }
        if(key === 'email') {
            if(!/^[a-z0-9][-_a-z0-9\.]{0,40}[a-z0-9]@[a-z0-9][-_a-z0-9]{1,15}[a-z0-9]\.[a-z0-9]{2,15}$/.test(String(value))) {
                req.flash('errors', 'Le format de l\'email n\'est pas bon');
                errorMessage = true;
            }
        }
    }
    if(req.body.password !== req.body.password_confirm) {
        req.flash('errors', 'Les 2 champs mot de passe doivent être identique');
        errorMessage = true;
    }
    const userExist = await UserModel.findOne({email: email})

    if(userExist) {
        req.flash('errors', 'L\'email est déjà utilisé par un autre compte');
        errorMessage = true;
    }

    if(errorMessage) {
        return res.redirect("/");
    }

    // Hashage du mdp
    const { SECRET }  = process.env
    const hashSha = createHmac("sha256", SECRET).update(password).digest("hex");
    let hashArgon = await argon2.hash(password);
    let hashedPassword = {
        'sha-256': hashSha,
        'argon2': hashArgon
    };

    // Création du user
    const user = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });
    try {
        await UserModel.create(user);
    } catch(err) {
        return res.sendStatus(500);
    }
    req.flash('success', 'Enregistré avec succès');
    return res.redirect("/login");
}
