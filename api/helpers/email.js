import { createTransport } from 'nodemailer';
import moment from 'moment-timezone';
import { _generateQrCode } from '../helpers/qr';

moment.locale('es');

let transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT | 587,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});

let sendMail = async ({
  id,
  nombre,
  primer_apellido,
  segundo_apellido,
  email,
  fecha,
  hora,
  tramite,
  requisitos,
  razon_social,
  rfc,
  tipo_persona,
  id_dia,
  recomendaciones
}) => {
  let fecha_format = moment(fecha).tz('America/Mexico_City').format(`LL`);
  let hora_format = hora.substring(0, 5);
  let requisitos_html = null;
  let recomendaciones_html = null;
  if (requisitos) {
    requisitos_html = ``;
    for (const REQ of requisitos) {
      requisitos_html += `<li>${REQ.nombre_largo}</li>`;
    }
  }

  if (recomendaciones) {
    recomendaciones_html = ``;
    for (const REQ of recomendaciones) {
      recomendaciones_html += `<li>${REQ.recomendacion}</li>`;
    }
  }

    let nom=razon_social==null?nombre+' '+primer_apellido+(segundo_apellido==null?'':' '+segundo_apellido):razon_social
  let tip_per=tipo_persona=='M'?'MORAL':'FISICA'
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Confirmación de cita |',
    attachDataUrls: true,
    html: `
    <link
      href="https://fonts.googleapis.com/css?family=Baloo+2&display=swap"
      rel="stylesheet"
    />

    <div style="background-color: #ffffff;width: auto;color: black;">
        <div style="width: 80%;margin-left: 10%;background-color: #ffffff;">
            <div style="text-align: center;">
            <img
              src="data:image/jpeg;base64,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"
            style="max-width: 400px;"
            />
            </div>
            <div style="background-color: #ffffff;padding: 20px;">

                <section>
                    <p style="font-size: 18px;text-align: justify;">
                    <p>CONFIRMACIÓN DE CITA PARA EL TRÁMITE <b>${tramite}</b> DE LA ADMINISTRACIÓN PÚBLICA ESTATAL DEL GOBIERNO DE OAXACA.</p>
                    
                </section>
                <section>
                    <table
                        style="width: 100%;border: 1px solid #050505;border-collapse: collapse;"
                    >
                        <tr>
                            <td style="text-align:center;border: 1px ;">
                            <p><b>Fecha:</b> ${fecha_format}</p>
                            </td>
                            

                            <td style="text-align: center;border: 1px solid #000000;">
                                <p><b> Hora:</b> ${hora_format} h.</p>
                            </td>

                        </tr>

                        <tr>
                            <td style="text-align: center;border: 1px solid #000000;">
                              <p><b> Número de la cita:</b> ${id_dia} </p>
                            </td>

                            <td style="text-align: center;border: 1px solid #000000;">
                                <p><b> Folio:</b> ${id}</p>
                            </td>
                        </tr>

                        <tr style="text-align: center">
                            <p style="text-align: center">
                              <p><b> Nombre del tramitante:</b> ${nom} </p>
                            </p>

                        </tr>

                        <tr>
                        <td style="text-align: center;border: 1px solid #000000;">
                          <p><b> Persona fisica o moral:</b> ${tip_per} </p>
                        </td>

                        <td style="text-align: center;border: 1px solid #000000;">
                            
                            <p><b> R.F.C:</b> ${rfc} </p>
                        </td>
                    </tr>

                    </table>
                </section>
                ${
                  requisitos_html
                    ? `<section><div style="color: #ffffff;background-color: #C4131B;text-align: center;padding: 10px 10px;margin-top: 20px;"><span>Requisitos</span></div><ul>${requisitos_html}</ul></section>`
                    : ``
                }

                ${recomendaciones_html
                ?`<section>
                    <div
                        style="color: #ffffff;background-color: #545555;text-align: center;padding: 10px 10px;margin-top: 20px;"
                    >
                        <span>Recomendaciones</span>
                    </div>
                    <ul>
                      ${recomendaciones_html}
                    </ul>
                </section>`:``
                }
            </div>
            <div style="text-align: center; padding-top: 25px;">

            <div style="text-align: center; padding-top: 25px;">
                <p  style="font-size: 26px;text-align: center;">
                <b> NO responda a este correo, fue enviado automáticamente</b>
                </p>
            </div>
        </div>
    </div>
    `
  };

  try {

  await transporter.sendMail(mailOptions);
    return true;
  } catch (e) {    
    return false;
  }
};

let sendMailContrase = async ({
  nombre,
  primer_apellido,
  segundo_apellido,
  email,
  clave
}) => {

  let requisitos_html = null;


  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Creación de usuario |',
    attachDataUrls: true,
    html: `
    <link
      href="https://fonts.googleapis.com/css?family=Baloo+2&display=swap"
      rel="stylesheet"
    />

    <div style="background-color: #ffffff;width: auto;color: black;">
        <div style="width: 80%;margin-left: 10%;background-color: #ffffff;">
            <div style="text-align: center;">
            </div>
            <div style="background-color: #ffffff;padding: 20px;">
            <section>
              <p style="background-color: #f3f3f3;text-align: center;font-size: 30px;">
                  <b
                    >Estimado(a) ${nombre} ${primer_apellido} ${segundo_apellido ? segundo_apellido : ''} :
                </b>
            </p>
        </section>

                <section>
                    <p style="font-size: 18px;text-align: justify;">
                        INFORMACIÓN DE USUARIO  </p>
                </section>
                <section>
                    <table
                        style="width: 100%;border: 1px solid #050505;border-collapse: collapse;"
                    >
                        <tr>
                            <th style="text-align: center;border: 1px solid #000000;">
                                Correo: ${email}
                            </th>

                            <th style="text-align: center;border: 1px solid #000000;">
                                Contraseña: ${clave}
                            </th>

                        </tr>
                    </table>
                </section>
                ${
                  requisitos_html
                    ? `<section><div style="color: #ffffff;background-color: #C4131B;text-align: center;padding: 10px 10px;margin-top: 20px;"><span>Requisitos</span></div><ul>${requisitos_html}</ul></section>`
                    : ``
                }
            </div>
            <div style="text-align: center; padding-top: 25px;">
                <p  style="font-size: 26px;text-align: center;">
                <b> NO responda a este correo, fue enviado automáticamente</b>
                </p>
            </div>
        </div>
    </div>
    `
  };

  try {

  await transporter.sendMail(mailOptions);
    return true;
  } catch (e) {    
    return false;
  }
};

let sendMailNotificaion = async ({
  nombre,
  primer_apellido,
  segundo_apellido,
  razon_social,
  email,
  mensaje
}) => {

  let nom=razon_social==null?nombre+' '+primer_apellido+(segundo_apellido==null?'':' '+segundo_apellido):razon_social

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Notificación de cita',
    attachDataUrls: true,
    html: `
    <link
      href="https://fonts.googleapis.com/css?family=Baloo+2&display=swap"
      rel="stylesheet"
    />

    <div style="background-color: #ffffff;width: auto;color: black;">
        <div style="width: 80%;margin-left: 10%;background-color: #ffffff;">
            <div style="text-align: center;">
            </div>
            <div style="background-color: #ffffff;padding: 20px;">
                <section>
                  <p style="background-color: #f3f3f3;text-align: center;font-size: 30px;">
                      <b
                        >Estimado(a) ${nom}
                        </b>
                  </p>
                 </section>
                 <b
                 > ${mensaje}
               </b>
                <section>
                    


            </div>
            <div style="text-align: center; padding-top: 25px;">
                <p  style="font-size: 26px;text-align: center;">
                <b> NO responda a este correo, fue enviado automáticamente</b>
                </p>
            </div>
        </div>
    </div>
    `
  };

  try {

  await transporter.sendMail(mailOptions);
    return true;
  } catch (e) {
    return false;
  }
};
  

export { sendMail,sendMailContrase,sendMailNotificaion };
