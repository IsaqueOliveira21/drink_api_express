import User from "../models/User";
import jwt from "jsonwebtoken";

class UserController {
  async login(req, res) {
    const { email = "", password = "" } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ error: "You must enter your email and password" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.passwordValidator(password)))
      return res.status(401).json({ error: "Wrong e-mail or password" });

    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.status(200).json({ token });
  }

  async create(req, res) {
    try {
      const user = await User.create(req.body);
      const {id, name, email, password} = user;
      return res.status(200).json({id, name, email, password});
    } catch(e) {
      return res.status(500).json({error: e});
    }
  }

  async update(req, res) {
    const user = await User.findByPk(req.userId);
    if(!user) return res.status(404).json({error: 'User not found'});
    try {
      const request = req.body;
      const userUpdated = await user.update({
        name: request.name,
        email: request.email,
        password_hash: request.password_hash,
      });
      const {name, email} = userUpdated;
      return res.status(200).json({status: 'success', msg: 'User updated successfully', data: {name, email}});
    } catch (e) {
      return res.status(500).json({error: e});
    }
  }
}

export default new UserController();
