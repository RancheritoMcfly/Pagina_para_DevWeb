const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(2); //hash para encriptar entre más se ejecute más tardará pero más seguro.
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword) =>{
    try{
        return await bcrypt.compare(password, savedPassword);
    }catch(e){console.log(e)};
};

module.exports = helpers;