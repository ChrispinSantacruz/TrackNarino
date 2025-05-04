function soloRol(rol) {
  return (req, res, next) => {
    if (req.usuario.tipoUsuario !== rol) {
      return res.status(403).json({ mensaje: 'Acceso denegado: Rol insuficiente' });
    }
    next();
  };
}

module.exports = soloRol;
