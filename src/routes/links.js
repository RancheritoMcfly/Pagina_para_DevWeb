const { Router } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth')


router.get('/agregar', isLoggedIn,(req, res) => {
    res.render('links/agregar');
});

router.post('/agregar', isLoggedIn, async (req, res) => {
    const {nombre, cantidad, descripcion} = req.body;
    const objAux = {nombre, cantidad, descripcion , user_id : req.user.id};
    await pool.query('INSERT INTO gastos SET ?', [objAux]);
    req.flash('success', 'Gasto registrado con exito');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res)=>{
    const gastos = await pool.query('SELECT * FROM gastos WHERE user_id = ?', [req.user.id]);
    console.log(gastos)
    res.render('links/lista', {gastos});
});

router.get('/borrar/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM gastos WHERE id= ?', [id]);
    req.flash('success', 'Gasto removido con exito');
    res.redirect('/links');
});

router.get('/editar/:id',isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const gastos = await pool.query('SELECT * FROM gastos WHERE id = ?', [id])
    res.render('links/editar', {gastos: gastos[0]})
});

router.post('/editar/:id',isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {nombre, cantidad, descripcion} = req.body;
    const objAux = {nombre, cantidad, descripcion};

    console.log(objAux);
    await pool.query('UPDATE gastos set ? WHERE id = ?', [objAux, id]);
    req.flash('success', 'Gasto editado con exito');
    res.redirect('/links');
});

module.exports = router;