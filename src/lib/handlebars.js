//Espacio para realizar las configuraciones para las fechas (timeago). Considerando la fecha de la base de datos.

const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;