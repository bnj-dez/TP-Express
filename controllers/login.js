import { UserModel } from '../Models/User.js'
import {createHmac} from "node:crypto";
import argon2 from "argon2";

export default async function login(req, res) {
    const fieldName = {password: 'mot de passe', email: 'email'}
    let errorMessage = false;
    const {
        email,
        password
    } = req.body;

    req.session.email = email;

    // Gestion des erreurs
    if(Object.keys(req.body).length !== 2 ) {
        errorMessage = true;
        req.flash('errors', 'Bien essayé');
    }
    for (const [key, value] of Object.entries(req.body)) {
        if(value === '') {
            req.flash('errors', `Le champ ${fieldName[key]} ne doit pas être vide`);
            errorMessage = true;
        }
        if(key === 'email') {
            if(!/^[a-z0-9][-_a-z0-9\.]{3,40}[a-z0-9]@[a-z0-9][-_a-z0-9]{1,15}[a-z0-9]\.[a-z0-9]{2,15}$/.test(String(value))) {
                req.flash('errors', `Le format de l\'email n\'est pas bon`);
                errorMessage = true;
            }
        }
    }

    if(errorMessage) {
        return res.redirect("/login");
    }

    const userExist = await UserModel.findOne({email: email});

    // Hashage du mdp
    const { SECRET }  = process.env;
    const hashSha = createHmac("sha256", SECRET).update(password).digest("hex");
    if(hashSha !== userExist?.password['sha-256'] || !await argon2.verify(userExist?.password.argon2, password)) {
        req.flash('errors', `Les informations fournies ne matchent pas`);
        errorMessage = true;
    }

    if(errorMessage) {
        return res.redirect("/login");
    }

    req.session.isLogged = true;
    req.session.name = `${userExist?.firstName} ${userExist?.lastName}`;

    req.flash('success', `Vous êtes connecté`);
    return res.redirect("/dashboard");
}
