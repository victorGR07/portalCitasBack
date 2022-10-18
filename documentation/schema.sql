-- DATA BASE SCHEMA
-- CREATE SCHEMA IF NOT EXISTS citas_proveedores AUTHORIZATION user_name;
-- SET TIMEZONE = 'America/Mexico_City';

-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
          -- D R O P   T A B L E S  --
-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
--DROP TABLE citas_proveedores.CITAS;
--DROP TABLE citas_proveedores.UNION_MODULOS_DEPARTAMENTOS_TRAMITES;
--DROP TABLE citas_proveedores.TRAMITES;
--DROP TABLE citas_proveedores.LOGS;
--DROP TABLE citas_proveedores.DIAS;

-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
        -- D R O P   S E Q U E N C E S  --
-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
--DROP SEQUENCE IF EXISTS citas_proveedores.seq_tramites;
--DROP SEQUENCE IF EXISTS citas_proveedores.seq_union_modulos_departamentos_tramites;
--DROP SEQUENCE IF EXISTS citas_proveedores.seq_citas;
--DROP SEQUENCE IF EXISTS citas_proveedores.seq_logs;
--DROP SEQUENCE IF EXISTS citas_proveedores.seq_dias;

-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
       --  D R O P   E X T E N S I O N S  --
-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
--DROP DOMAIN IF EXISTS citas_proveedores.entity_name_strict;
--DROP DOMAIN IF EXISTS citas_proveedores.entity_name_optional;
--DROP DOMAIN IF EXISTS citas_proveedores.entity_telephone;
--DROP DOMAIN IF EXISTS citas_proveedores.entity_email;


-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
          --  E X T E N S I O N S  --
-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
CREATE DOMAIN citas_proveedores.entity_name_strict AS VARCHAR CHECK(value ~ '^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$' AND LENGTH(TRIM(value)) > 0);
CREATE DOMAIN citas_proveedores.entity_name_optional AS VARCHAR CHECK(value ~ '^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$' OR LENGTH(TRIM(value)) = 0);
CREATE DOMAIN citas_proveedores.entity_telephone AS VARCHAR CHECK(value ~ '^[0-9]{10}$');
CREATE DOMAIN citas_proveedores.entity_email AS VARCHAR CHECK (value ~ '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');

-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
            --  S E Q U E N C E S  --
-- -- -- - - - - - - - - - - - - - - --- - - -- -- -
CREATE SEQUENCE IF NOT EXISTS citas_proveedores.seq_tramites INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1;
CREATE SEQUENCE IF NOT EXISTS citas_proveedores.seq_union_modulos_departamentos_tramites INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1;
CREATE SEQUENCE IF NOT EXISTS citas_proveedores.seq_citas INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1;
CREATE SEQUENCE IF NOT EXISTS citas_proveedores.seq_logs INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1;
CREATE SEQUENCE IF NOT EXISTS citas_proveedores.seq_dias INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1;
CREATE SEQUENCE citas_proveedores.seq_fecha_configuracion INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE IF NOT EXISTS citas_proveedores.seq_usuarios AS BIGINT INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1;
CREATE SEQUENCE IF NOT EXISTS citas_proveedores.seq_roles AS BIGINT INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1;
CREATE SEQUENCE citas_proveedores.seq_recomendaciones INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE citas_proveedores.seq_estados INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE;

-- create fuction --
CREATE OR REPLACE FUNCTION citas_proveedores.updateddeprecated()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    tabl ALIAS FOR TG_TABLE_NAME; 
   idss ALIAS for NEW.id;
	begin
	IF new.deprecated= true THEN
		execute format('UPDATE  citas_proveedores.'||quote_ident(tabl)||' SET deleted_at= NOW() WHERE id ='||quote_literal(idss.id)  );
	else
		execute format('UPDATE  citas_proveedores.'||quote_ident(tabl)||' SET deleted_at= null WHERE id ='||quote_literal(idss.id)  );
END IF;

RETURN NEW;
END;
$function$
;

--------------------------------------------
------------- T R A M I T E ----------------
CREATE TABLE citas_proveedores.TRAMITES (
  id BIGINT NOT NULL DEFAULT NEXTVAL('citas_proveedores.seq_tramites') CHECK(id > 0),
  nombre VARCHAR(255) NOT NULL CHECK(LENGTH(TRIM(nombre)) > 0),
  requisitos JSONB NOT NULL,
  descripcion varchar NULL,
  ordenamiento int4 NULL,
  estatus bool NOT NULL DEFAULT true,
  deprecated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP with time zone DEFAULT (NOW() at time zone 'America/Mexico_City'),
  updated_at timestamptz(0) NULL,
  deleted_at timestamptz(0) NULL,
  CONSTRAINT PK_Tramites PRIMARY KEY (id)
);
--------- E N D   T R A M I T E ------------
--------------------------------------------

--------------------------------------------
------------ E S T A D  O S ----------------
CREATE TABLE citas_proveedores.estados (
	id int8 NOT NULL DEFAULT nextval('citas_proveedores.seq_estados'::regclass),
	nombre varchar NOT NULL,
	deprecated bool NOT NULL DEFAULT false,
	created_at timestamptz(0) NOT NULL DEFAULT now(),
	updated_at timestamptz(0) NULL,
	deleted_at timestamptz(0) NULL,
	CONSTRAINT estados_pk PRIMARY KEY (id)
);


------------------------------------------------------------------------------------
------------- U N I O N _ D E P A R T A M E N T O S _ T R A M I T E S ----------------
CREATE TABLE citas_proveedores.UNION_TRAMITES_CONFIGURACION (
  id BIGINT NOT NULL DEFAULT NEXTVAL('citas_proveedores.seq_union_modulos_departamentos_tramites') CHECK(id > 0),
  id_tramite BIGINT NOT NULL,
  configuracion JSONB NOT NULL,
  deprecated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP with time zone DEFAULT (NOW() at time zone 'America/Mexico_City'),
  updated_at timestamptz(0) NULL,
  deleted_at timestamptz(0) NULL,
  FOREIGN KEY (id_tramite) REFERENCES citas_proveedores.TRAMITES (id),
  CONSTRAINT PK_Union_modulos_departamentos_tramites PRIMARY KEY (id)
);
--------- E N D   U N I O N _ D E P A R T A M E N T O S _ T R A M I T E S ------------
------------------------------------------------------------------------------------

----------------------------------------------
------------- C I T A S ----------------
CREATE TABLE citas_proveedores.CITAS (
  id BIGINT NOT NULL DEFAULT NEXTVAL('citas_proveedores.seq_citas') CHECK(id > 0),
  folio_general int8 NOT NULL,
	folio_dia int8 NOT NULL,
  nombre citas_proveedores.ENTITY_NAME_STRICT,
  primer_apellido citas_proveedores.ENTITY_NAME_STRICT,
  segundo_apellido citas_proveedores.ENTITY_NAME_OPTIONAL,
  razon_social varchar NULL,
  tipo_persona bpchar(1) NOT NULL,
  "rfc" varchar NOT NULL,
  telefono citas_proveedores.ENTITY_TELEPHONE,
  email citas_proveedores.ENTITY_EMAIL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  id_union_tramites_configuracion BIGINT NOT NULL,
  observacion TEXT NOT NULL DEFAULT 'sin descripción',
  id_tramite_confirmacion int8 NULL,
  id_estado int8 NOT NULL DEFAULT 1,
  documentacion jsonb NULL,
  deprecated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP with time zone DEFAULT (NOW() at time zone 'America/Mexico_City'),
  updated_at timestamptz(0) NULL,
  deleted_at timestamptz(0) NULL,
  FOREIGN KEY (id_union_tramites_configuracion) REFERENCES citas_proveedores.UNION_TRAMITES_CONFIGURACION(id),
   FOREIGN KEY (id_estado) REFERENCES citas_proveedores.estados(id),
  CONSTRAINT PK_Citas PRIMARY KEY (id)
);
--------- E N D   C I T A S ------------
----------------------------------------------

--------------------------------------
------------- L O G S ----------------
CREATE TABLE citas_proveedores.logs (
	id int8 NOT NULL DEFAULT nextval('citas_proveedores.seq_logs'::regclass),
  id_usuario  BIGINT NOT NULL,
	descripcion varchar NOT NULL,
	cliente jsonb NOT NULL,
	operacion jsonb NOT NULL,
	deprecated bool NOT NULL DEFAULT false,
	created_at timestamptz(0) NOT NULL DEFAULT timezone('America/Mexico_City'::text, now()),
	deleted_at timestamptz(0) NULL,
	CONSTRAINT logs_pk PRIMARY KEY (id)
);
--------- E N D   L O G S ------------
--------------------------------------


--------------------------------------
------------- D I A S ----------------
CREATE TABLE citas_proveedores.DIAS (
  id BIGINT NOT NULL DEFAULT NEXTVAL('citas_proveedores.seq_dias') CHECK(id > 0),
  fecha DATE NOT NULL,
  deprecated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP with time zone DEFAULT (NOW() at time zone 'America/Mexico_City'),
  updated_at timestamptz(0) NULL,
  deleted_at timestamptz(0) NULL,
  CONSTRAINT PK_Dias PRIMARY KEY (id)
);
--------- E N D   D I A S ------------
--------------------------------------



--------------------------------------------
----F E C H A   C O N F I G U R A C I O N --
CREATE TABLE citas_proveedores.fecha_configuracion (
	id int8 NOT NULL DEFAULT nextval('citas_proveedores.seq_fecha_configuracion'::regclass),
	fecha date NOT NULL,
	is_current bool NULL DEFAULT true,
	deprecated bool NOT NULL DEFAULT false,
	created_at timestamptz(0) NOT NULL DEFAULT timezone('America/Mexico_City'::text, now()),
	updated_at timestamptz(0) NULL,
	deleted_at timestamptz(0) NULL,
	CONSTRAINT fecha_configuracion_pk PRIMARY KEY (id)
);



--------------------------------------------
------------- R O L E S---- ----------------
CREATE TABLE IF NOT EXISTS citas_proveedores.roles(
	id BIGINT NOT NULL DEFAULT NEXTVAL('citas_proveedores.seq_roles') CHECK(id > 0),
	nombre  varchar(100) not null,
    deprecated BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP,
	deleted_at TIMESTAMP ,
	CONSTRAINT PK_roles PRIMARY KEY (id)
);



--------------------------------------------
------------- U S U A R I O S ----------------
CREATE TABLE IF NOT EXISTS citas_proveedores.usuarios(
	id BIGINT NOT NULL DEFAULT NEXTVAL('citas_proveedores.seq_usuarios') CHECK(id > 0),
	id_rol  BIGINT not null,
	nombre citas_proveedores.ENTITY_NAME_STRICT,
  primer_apellido citas_proveedores.ENTITY_NAME_STRICT,
  segundo_apellido citas_proveedores.ENTITY_NAME_OPTIONAL,
  correo varchar NOT NULL,
  clave_privada VARCHAR not null,
  "curp" varchar not null,
  estatus boolean not null default true,
  bloqueado bool NOT NULL DEFAULT false, 
  deprecated BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP,
	deleted_at TIMESTAMP ,
	FOREIGN KEY (id_rol) REFERENCES citas_proveedores.roles (id),
	CONSTRAINT PK_usuarios PRIMARY KEY (id)
);


--------------------------------------------
-----------R E C O M E N D A C I O N E S ---
CREATE TABLE citas_proveedores.recomendaciones (
	id int8 NOT NULL DEFAULT nextval('citas_proveedores.seq_recomendaciones'::regclass),
	recomendacion varchar NOT NULL,
	estatus bool NOT NULL DEFAULT true,
  ordenamiento int8 NULL,
	deprecated bool NOT NULL DEFAULT false,
	created_at timestamptz(0) NOT NULL DEFAULT now(),
	updated_at timestamptz(0) NULL,
	deleted_at timestamptz(0) NULL,
	CONSTRAINT recomendaciones_pk PRIMARY KEY (id)
);



----Disparadores -------------
create trigger updated after update of deprecated on citas_proveedores.citas for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.dias for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.fecha_configuracion for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.logs for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.roles for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.tramites for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.union_tramites_configuracion for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.usuarios for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.recomendaciones for each row execute function citas_proveedores.updateddeprecated();
create trigger updated after update of deprecated on citas_proveedores.estados for each row execute function citas_proveedores.updateddeprecated();



