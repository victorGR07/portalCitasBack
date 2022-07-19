INSERT INTO citas_proveedores.roles (nombre, deprecated, created_at, updated_at, deleted_at) VALUES('Encargado', false, now(), now(), null);
INSERT INTO citas_proveedores.roles (nombre, deprecated, created_at, updated_at, deleted_at) VALUES('Operador', false, now(), now(), null);


INSERT INTO citas_proveedores.estados (nombre, deprecated, created_at, updated_at, deleted_at) VALUES('PENDIENTE', false, now(), null, null);
INSERT INTO citas_proveedores.estados (nombre, deprecated, created_at, updated_at, deleted_at) VALUES('SIN OBSERVACIONES', false, now(), null, null);
INSERT INTO citas_proveedores.estados (nombre, deprecated, created_at, updated_at, deleted_at) VALUES('CON OBSERVACIONES', false, now(), null, null);

INSERT INTO citas_proveedores.usuarios (id_rol, nombre, primer_apellido, segundo_apellido, correo, clave_privada, curp, estatus, bloqueado, deprecated, created_at, updated_at, deleted_at) VALUES(1, 'ADMINISTRADOR', 'DEL', 'SISTEMA', 'admin@admin.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'XXXXXXXXXXXXXXXXXX', true, false, false, now(),null, null);