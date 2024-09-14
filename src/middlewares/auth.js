import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async(req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) return res.status(401).json({ access_denied: "Login Required" });

    const [text, token] = authorization.split(' ');
    try {
        const dados = jwt.verify(token, process.env.TOKEN_SECRET);
        const { id, email } = dados;

        const user = await User.findOne({
            where: {
                id: id,
                email: email
            }
        });

        if(!user) return res.status(404).json({ error: 'Invalid user or expirated, please login again' });

        req.userId = id;
        req.userEmail = email;

        return next();
    } catch(e) {
        return res.status(500).json({error: e});
    }
}