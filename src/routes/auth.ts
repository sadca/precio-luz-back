import { Router } from 'express';
import express = require('express');
import bcrypt from 'bcryptjs';
import MySQL from '../mysql/mysql';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req: express.Request, res: express.Response) => {
  console.log(req.body);

  let body = req.body;

  const query = `SELECT * FROM user WHERE email = '${body.user}';`;

  MySQL.ejecutarQuery(query, (err: any, datos: any[]) => {
    if (err) {
      console.log('Error', err);
      if (err == 'El registro solicitado no existe') {
        return res.status(400).json({
          ok: false,
          message: 'Usuario o contraseña incorrectos',
        });
      } else {
        return res.status(500).json({
          ok: false,
          message: 'Ha ocurrido un error. Vuelva a intentarlo más tarde.',
        });
      }
    } else {
      console.log(datos);

      if (!bcrypt.compareSync(body.pass, datos[0].pass)) {
        return res.status(400).json({
          ok: false,
          message: 'Usuario o contraseña incorrectos.',
        });
      } else {
        // TODO: DEVOLVER TOKEN PARA EL LOGIN
        return res.json({
          ok: true,
          message: 'Sesión iniciada correctamente.',
        });
      }
    }
  });
});

router.post('/register', (req: express.Request, res: express.Response) => {
  console.log(req.body);

  let body = req.body;

  let pass = bcrypt.hashSync(body.pass, 10);

  let token = jwt.sign({ user: body.user }, process.env.SEED || '', {
    expiresIn: 720000,
  });

  const query = `INSERT INTO 
                  user VALUES ('', '${body.user}', '${pass}', current_timestamp(), null, 1, '${token}')`;

  MySQL.ejecutarQuery(query, (err: any, datos: Object[]) => {
    if (err) {
      console.log('Error', err);
      console.log('Code', err.code);

      let mensaje = 'Ha ocurrido un error. Vuelva a intentarlo más tarde.';

      if (err.code == 'ER_DUP_ENTRY') {
        mensaje = 'Ya existe un usuario con esa dirección de correo.';

        return res.status(400).json({
          ok: false,
          message: mensaje,
        });
      } else {
        return res.status(500).json({
          ok: false,
          message: mensaje,
        });
      }
    } else {
      console.log(datos);

      return res.json({
        ok: true,
        message: 'Revise su correo y confirme su cuenta antes de hacer login.',
        token,
      });
    }
  });
});

router.put(
  '/confirm_mail/:token',
  (req: express.Request, res: express.Response) => {
    console.log(req.body);

    var token = req.params.token;

    console.log(token);

    let seed = process.env.SEED || '';

    jwt.verify(token, seed, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          message: 'Token no válido',
          err,
        });
      }

      console.log(decoded.user);

      const query = `UPDATE user SET estado = 2 WHERE email = '${decoded.user}'`;

      MySQL.ejecutarQuery(query, (err: any, datos: Object[]) => {
        if (err) {
          console.log('Error', err);

          let mensaje = 'Ha ocurrido un error. Vuelva a intentarlo más tarde.';

          return res.status(500).json({
            ok: false,
            message: mensaje,
          });
        } else {
          console.log(datos);

          return res.json({
            ok: true,
            message:
              'Se ha validado su usuario. Realice el inicio de sesión cuando quiera.',
          });
        }
      });
    });
  }
);

router.post('/change_pass', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true,
  });
});

router.post('/remember_pass', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true,
  });
});

export default router;
