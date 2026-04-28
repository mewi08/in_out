const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next){
    const authHead = req.headers.authorization;

    if(!authHead){
        return res.status(401).json({message: 'Token requerido'});
    }

    const token = authHead.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({message:'Token inválido'});
    }
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        next();
    };
}

module.exports = { authMiddleware, authorizeRoles };