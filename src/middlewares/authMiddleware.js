const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            erro: 'Token não fornecido' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Contém { id, perfil }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ 
                erro: 'Token expirado' 
            });
        }
        res.status(403).json({ 
            erro: 'Token inválido' 
        });
    }
};

module.exports = autenticar;
