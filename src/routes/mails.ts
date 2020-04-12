import { Router } from 'express';
import express = require('express');
import nodemailer = require('nodemailer');
import * as fs from 'fs';
import MySQL from '../mysql/mysql';

const router = Router();

router.post('/contactar', (req: express.Request, res: express.Response) => {
  let body = req.body;
  console.log(body);

  console.log('Configuramos el envio del mail');
  let confMail = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sadcasolutions@gmail.com',
      pass: process.env.PASSMAIL,
    },
  });

  console.log('Construimos el mail');
  let mailOpt: nodemailer.SendMailOptions = {
    from: 'sadcasolutions@gmail.com',
    to: 'contacto@sadca.es',
    subject: 'Contacto App Movil - ' + body.motivo,
    text:
      'Correo de contacto: ' +
      body.correo +
      '\nTeléfono de contacto: ' +
      body.telefono +
      '\nMotivo: ' +
      body.motivo +
      '\nObservaciones: ' +
      body.observaciones +
      '\nComentario: ' +
      body.comentario,
  };

  console.log('Enviamos el mail');
  confMail.sendMail(mailOpt, (error: any, info: nodemailer.SentMessageInfo) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        error,
      });
    } else {
      console.log('Email enviado correctamente');

      console.log('Insertamos en BBDD los datos');
      const query = `INSERT INTO 
      data_forms VALUES ('', '${body.correo}', '${body.motivo}', '${body.observaciones}', 
                        '${body.telefono}', '${body.comentario}', ${body.acuerdoComer}, current_timestamp())`;

      MySQL.ejecutarQuery(query, (err: any, datos: Object[]) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log(datos);
        }
      });

      return res.json({
        ok: true,
        mensaje: 'Email enviado correctamente',
      });
    }
  });
});

router.post(
  '/ahorrar-factura',
  (req: express.Request, res: express.Response) => {
    let body = req.body;
    console.log(body);

    let files = req.files;
    console.log(files);

    let archivosTemp: any[] = [];
    let archivos: any[] = [];
    if (files) {
      if (files.archivo) {
        let arch: any = files.archivo;
        archivosTemp.push(arch);
      }

      if (files.archivo2) {
        let arch2: any = files.archivo2;
        archivosTemp.push(arch2);
      }

      if (files.archivo3) {
        let arch3: any = files.archivo3;
        archivosTemp.push(arch3);
      }

      if (files.archivo4) {
        let arch4: any = files.archivo4;
        archivosTemp.push(arch4);
      }

      if (files.archivo5) {
        let arch5: any = files.archivo5;
        archivosTemp.push(arch5);
      }

      for (let archivo of archivosTemp) {
        console.log('Subimos el archivo ' + archivo.name);
        archivo.mv(`public/${archivo.name}`, (err: any) => {
          if (err) {
            console.log('Error al subir el archivo');
            console.log(err);
            return res.status(500).json({
              ok: false,
              err,
              message:
                'El archivo no se ha podido subir correctamente, pruebe de nuevo o contacte con el administrador',
            });
          } else {
            console.log('Archivo subido correctamente');
          }
        });

        archivos.push({ path: `public/${archivo.name}` });
      }
    }
    console.log('Archivos ' + archivos);

    console.log('Configuramos el envio del mail');
    let confMail = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sadcasolutions@gmail.com',
        pass: process.env.PASSMAIL,
      },
    });

    console.log('Construimos el mail');
    let mailOpt: nodemailer.SendMailOptions = {
      from: 'sadcasolutions@gmail.com',
      to: 'contacto@sadca.es',
      subject: 'Ahorrar Factura App Movil',
      text:
        'Correo de contacto: ' +
        body.correo +
        '\nTeléfono de contacto: ' +
        body.telefono +
        '\nComentario: ' +
        body.comentario,
      attachments: archivos,
    };

    console.log('Enviamos el mail');
    confMail.sendMail(
      mailOpt,
      (error: any, info: nodemailer.SentMessageInfo) => {
        if (error) {
          console.error('Email NO enviado');
          console.log(error);
          return res.status(500).json({
            ok: false,
            error,
          });
        } else {
          console.log('Email enviado correctamente');
          for (let archivo of archivosTemp) {
            console.log('Borrando...');
            fs.unlinkSync(`public/${archivo.name}`);
          }

          console.log('Insertamos en BBDD los datos');
          const query = `INSERT INTO 
          data_forms VALUES ('', '${body.correo}', 'AhorraFactura', '', 
                        '${body.telefono}', '${body.comentario}', ${body.acuerdoComer}, current_timestamp())`;

          MySQL.ejecutarQuery(query, (err: any, datos: Object[]) => {
            if (err) {
              console.log('Error', err);
            } else {
              console.log(datos);
            }
          });

          return res.json({
            ok: true,
            mensaje: 'Email enviado correctamente',
          });
        }
      }
    );
  }
);

export default router;
