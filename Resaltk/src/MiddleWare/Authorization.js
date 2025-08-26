export const Authorization = (...role) => {
    return (req, res, next) => {
        if (role !== req.user.accountType) {
            return next (new Error({ message: "Access denied, insufficient permissions" },{cause: 403 }));
        }
        next();
    }
}