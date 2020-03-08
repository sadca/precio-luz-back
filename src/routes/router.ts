import { Router, Request, Response } from 'express';
import express = require('express');
import nodemailer = require('nodemailer');
const path = require('path');

const router = Router();

router.post('/contactar', (req: express.Request, res: express.Response) => {
  let body = req.body;
  console.log(body);
  let confMail = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sadcasolutions@gmail.com',
      pass: 'klwzxjmbjxiimvcf'
    }
  });

  let archivos: any[] = [
    {
      path:
        'https://d500.epimg.net/cincodias/imagenes/2018/11/13/lifestyle/1542113135_776401_1542116070_noticia_normal.jpg'
    }
  ];

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
    attachments: archivos
  };

  confMail.sendMail(mailOpt, (error: any, info: nodemailer.SentMessageInfo) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        error
      });
    } else {
      console.log('Email enviado');
      return res.json({
        ok: true,
        mensaje: 'Email enviado'
      });
    }
  });
});

router.get('/', (req: any, res: any) => {
  return res.json({
    ok: true
  });
});

export default router;
