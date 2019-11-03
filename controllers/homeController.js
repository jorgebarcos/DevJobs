exports.mostrarTrabajos = (req, res) => {
	res.render('home', {
		nombrePagina: 'devJobs',
		tagline: 'Encuentra y Pública Trabajos para Desarrolladores Web',
		barra: true,
		boton: true
	});
};
