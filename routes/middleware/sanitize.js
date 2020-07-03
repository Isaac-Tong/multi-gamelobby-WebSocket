const sanitize = (req, res, next) => {

    const username = req.body.name;
    const roomID = req.body.roomID;

    if(username == undefined){
        return next();
    }

    req.body.name = username.split(' ').join('');

    if(roomID == undefined){
        return next();
    }

    req.body.roomID = roomID.split(' ').join('');

    next();
}

module.exports = sanitize;