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
