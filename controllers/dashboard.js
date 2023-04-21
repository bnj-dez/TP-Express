import {UserModel} from "../Models/User.js";

export default async function dashboard(req, res) {
    const existingUser =await UserModel.findOne({email: req.session.email});
    return res.render("dashboard", {firstName: existingUser?.firstName, lastName: existingUser?.lastName});
}