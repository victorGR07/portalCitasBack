import moment from 'moment-timezone';
import binary from 'decimal-to-binary';

import { name, description, version } from '../../../package.json';

let time = binary.convertToBinary(
  moment(new Date()).tz('America/Mexico_City').format(`YYYYMMDD`)
);

const INFO = {
  project: name,
  description: description,
  version: `${version}`,
  date: time,
  contact: `computer unit`
};

export { INFO };
