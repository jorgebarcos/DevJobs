const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
exports.formularioNuevaVacante = (req, res) => {
	res.render('nueva-vacante', {
		nombrePagina: 'Nueva Vacante',
		tagline: 'Llena el formulario y publica tu vacante',
		cerrarSesion: true,
		nombre: req.user.nombre
	});
};

// agrega las vacantes a la base de datos
exports.agregarVacante = async (req, res) => {
	const vacante = new Vacante(req.body);

	// usuario autor de la vacante
	vacante.autor = req.user._id;

	// Crear arreglp de habilidades (skills)
	vacante.skills = req.body.skills.split(',');

	// almacernarlo en la base de datos
	const nuevaVacante = await vacante.save();

	// redireccionar
	res.redirect(`/vacantes/${nuevaVacante.url}`);
};

// muestra una vacante
exports.mostrarVacante = async (req, res, next) => {
	const vacante = await Vacante.findOne({ url: req.params.url });

	// si no  hay resultados
	if (!vacante) return next();

	res.render('vacante', {
		vacante,
		nombrePagina: vacante.titulo,
		barra: true
	});
};

exports.formEditarVacante = async (req, res, next) => {
	const vacante = await Vacante.findOne({ url: req.params.url });

	if (!vacante) return next();

	res.render('editar-vacante', {
		vacante,
		nombrePagina: `Editar - ${vacante.titulo}`,
		cerrarSesion: true,
		nombre: req.user.nombre
	});
};

exports.editarVacante = async (req, res) => {
	const vacanteActualizada = req.body;

	vacanteActualizada.skills = req.body.skills.split(',');

	const vacante = await Vacante.findOneAndUpdate({ url: req.params.url }, vacanteActualizada, {
		new: true,
		runValidators: true
	});

	res.redirect(`/vacantes/${vacante.url}`);
};

// Validar y Sanitizar los campos de las nuevas vacantes

exports.validarVacante = (req, res, next) => {
	// sanitizar los campos
	req.sanitizeBody('titulo').escape();
	req.sanitizeBody('empresa').escape();
	req.sanitizeBody('ubicacion').escape();
	req.sanitizeBody('salario').escape();
	req.sanitizeBody('contrato').escape();
	req.sanitizeBody('skills').escape();

	// validar
	req.checkBody('titulo', 'Agrega un Titulo a la Vacante').notEmpty();
	req.checkBody('empresa', 'Agrega una Empresa').notEmpty();
	req.checkBody('ubicacion', 'Agrega una Ubicación').notEmpty();
	req.checkBody('contrato', 'Selecciona el Tipo de Contrato').notEmpty();
	req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty();

	const errores = req.validationErrors();

	if (errores) {
		// Recargar la vista con los errores
		req.flash('error', errores.map((error) => error.msg));

		res.render('nueva-vacante', {
			nombrePagina: 'Nueva Vacante',
			tagline: 'Llena el formulario y publica tu vacante',
			cerrarSesion: true,
			nombre: req.user.nombre,
			mensajes: req.flash()
		});
	}

	next(); // Siguiente Middleware
};

exports.eliminarVacante = async (req, res) => {
	const { id } = req.params;
};
