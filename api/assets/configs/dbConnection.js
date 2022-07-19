const DB_CITAS_CONFIG = {
  host: process.env.DB_CITAS_HOST,
  user: process.env.DB_CITAS_USER,
  database: process.env.DB_CITAS_NAME,
  password: process.env.DB_CITAS_PASSWD,
  port: parseInt(process.env.DB_CITAS_PORT)
};

export { DB_CITAS_CONFIG };
