const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const { User, Role } = require('../models');

const IsAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const {UserId} = jwt.verify(token, secretKey);

        if (!UserId|| isNaN(UserId)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let user = await User.findByPk(UserId, {
            include: {
                model: Role, 
                attributes: ['RoleId', 'RoleName'] 
            }
        });

        if(user.Role.RoleName.toUpperCase().indexOf("ADMIN") === -1){
            return res.status(403).json({ error: 'Forbidden' });
        }

        req.user = user;
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Expired Token' });
    }
};

module.exports = IsAdmin;