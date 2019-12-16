const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req, res) => {
	res.render('crear-cuenta', {
		nombrePagina: 'Crea tu cuenta en devJobs',
		tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
	});
};

exports.validarRegistro = (req, res, next) => {
	// sanitizar campos
	req.sanitizeBody('nombre').escape();
	req.sanitizeBody('email').escape();
	req.sanitizeBody('password').escape();
	req.sanitizeBody('confirmar').escape();

	// validar
	req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty();
	req.checkBody('email', 'El email debe ser valido').isEmail();
	req.checkBody('password', 'El password no puede ir vacio').isEmail();
	req.checkBody('confirmar', 'Confirmar password no puede ir vacio').isEmail();
	req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

	const errores = req.validationErrors();

	if (errores) {
		// si hay errores
		req.flash('error', errores.map((error) => error.msg));

		res.render('crear-cuenta', {
			nombrePagina: 'Crea tu cuenta en devJobs',
			tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
			mensajes: req.flash()
		});
		return;
	}

	// Si toda la validación es correcta
	next();

	return;
};

exports.crearUsuario = async (req, res, next) => {
	// crear el usuario
	const usuario = new Usuarios(req.body);

	try {
		await usuario.save();
		res.redirect('/iniciar-sesion');
	} catch (error) {
		req.flash('error', error);
		res.redirect('/crear-cuenta');
	}
};

// formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
	res.render('iniciar-sesion', {
		nombrePagina: 'Iniciar Sesión devJobs'
	});
};
