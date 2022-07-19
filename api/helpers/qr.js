import { toDataURL } from 'qrcode';

const QR_OPTIONS = { errorCorrectionLevel: 'H' };

let _generateQrCode = async data => {
  return toDataURL(data, QR_OPTIONS);
};

export { _generateQrCode };
