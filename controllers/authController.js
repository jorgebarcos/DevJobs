const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.autenticarUsuario = passport.authenticate('local', {
	successRedirect: '/administracion',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true,
	badRequestMessage: 'Ambos Campos son obligatorios'
});

// Revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
	// revisar el usuario
	if (req.isAuthenticated()) {
		return next(); // estan autenticados
	}

	// redireccionar
	res.redirect('/iniciar-sesion');
};

exports.mostrarPanel = async (req, res) => {
	// consultar el usuario autenticado
	const vacantes = await Vacante.find({ autor: req.user._id });

	res.render('administracion', {
		nombrePagina: 'Panel de Administracion',
		tagline: 'Crea y Administra tus vacantes desde aquí',
		cerrarSesion: true,
		nombre: req.user.nombre,
		vacantes
	});
};

exports.cerrarSesion = (req, res) => {
	req.logout();
	req.flash('correcto', 'Cerraste Sesion Correctamente');

	return res.redirect('/iniciar-sesion');
};
