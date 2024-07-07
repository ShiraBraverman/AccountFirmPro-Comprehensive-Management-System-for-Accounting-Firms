const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.session?.user?.role) return res.sendStatus(401);
        const rolesArray = [...allowedRoles]
        const result = req.session.user.role.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRole