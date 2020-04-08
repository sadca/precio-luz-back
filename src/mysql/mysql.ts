import mysql = require('mysql');
export default class MySQL {
  private static _instance: MySQL;

  conection: mysql.Connection;
  conectado: boolean = false;

  constructor() {
    console.log('Clase inicializada');

    this.conection = mysql.createConnection({
      host: process.env.BBDD,
      user: process.env.BBDD_USER,
      password: process.env.BBDD_PASS,
      database: process.env.BBDD_DB,
    });

    this.conectarDB();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private conectarDB() {
    this.conection.connect((err: mysql.MysqlError) => {
      if (err) {
        console.log(err.message);
        return;
      }
      this.conectado = true;
      console.log('Conectado a BBDD');
    });
  }

  static ejecutarQuery(query: string, callback: Function) {
    this.instance.conection.query(query, (err, results: Object[], fields) => {
      if (err) {
        console.log('Error en la query');
        console.log(err);
        // throw err;
        return callback(err);
      }
      if (results.length === 0) {
        callback('El registro solicitado no existe');
      } else {
        callback(null, results);
      }
    });
  }
}
