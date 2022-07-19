import * as inspect from "yup";

inspect.setLocale({
  mixed: {
    required: "${path} es un campo obligatorio"
  },
  string: {
    length: "${path} debe contener ${length} carácteres exactos",
    matches: "${path} debe coincidir con ${regex}",
    min: "${path} debe contener mínimo ${min} carácteres",
    max: "${path} debe contener máximo ${max} carácteres",
    email: "${path} debe tener un formato válido"
  },
  number: {
    integer: "${path} debe ser entero",
    positive: "${path} debe ser un número positivo",
    min: "${path} debe ser mínimo ${min}"
  }
});

inspect.id = () => {
  return inspect
    .number()
    .required()
    .typeError()
    .positive()
    .integer();
};

inspect.text_required = () => {
  return inspect
    .string()
    .required()
    .typeError()
    .trim()
    .uppercase();
};

inspect.text_required_n_format = () => {
  return inspect
    .string()
    .required()
    .typeError()
    .trim();
};

inspect.text_optional_n_format = () => {
  return inspect
    .string()
    .nullable(true)
    .typeError()
    .trim()
    .uppercase();
};

inspect.json = () => {
  return inspect
    .mixed()
    .required()
    .typeError();
};

inspect.text_n_required_n_format = () => {
  return inspect
    .string()
    .nullable(true)
    .typeError()
    .trim();
};

inspect.number_n_required = () => {
  return inspect
    .number()
    .typeError()
    .positive()
    .integer();
};

inspect.telefono = () => {
  return inspect
    .string()
    .required()
    .typeError()
    .trim()
    .length(10)
    .matches(/^[0-9]{10}$/);
};

inspect.email = () => {
  return inspect
    .string()
    .required()
    .nullable(true)
    .typeError()
    .trim()
    .email();
};

export { inspect };
