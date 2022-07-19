# ws_citas_proveedores

__Versión de proyecto__: 1.0.0

---

## Descripción
Servicio web para el proceso de citas de proveedores


## Instalación
Para iniciar de manera local sigue las siguientes instrucciones.

  1. Realiza un `fork` de este este repositorio

  1. Clonalo en tu computadora usando git

  1. Asegurate de estar corriendo una versión de  `NODE 14.17.0` o superior.
  Puedes ver las instrucciones [aquí](https://nodejs.org/en/download/).

  1. Ejecuta `npm install` en la carpeta raíz de tu clonación de este proyecto para instalar las correspondientes dependencias

## Modos de ejecución
__ws_citas_proveedores__ se ejecuta en dos diferentes ambientes, desarrollo o producción, ambos requieren tener las dependencias instaladas correctamente.


### Desarrollo
~~~
  $: npm run dev
~~~

The .env file is required

### Producción
~~~
  $: npm run start
~~~

## Variables de ambiente
Para ejecutar en modo desarrollo y ser construido requiere de un .env archivo, el cual expondrá tus variables.
~~~
  # Enviroment
    NODE_ENV = DEV || production
    PORT
    DB_CITAS_HOST
    DB_CITAS_USER
    DB_CITAS_PASSWD
    DB_CITAS_NAME
    DB_CITAS_SCHEMA
    DB_CITAS_PORT
    TELEGRAM_KEY
    CHAT_ID
    EMAIL_HOST
    EMAIL_PORT
    EMAIL_SENDER
    EMAIL_PASSWORD
~~~
