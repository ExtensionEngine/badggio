import includes from 'lodash/includes';
import VeeValidate from 'vee-validate';

const alphanumerical = {
  getMessage: field => {
    return `The ${field} field must contain at least 1 letter and 1 numeric value.`;
  },
  validate: value => {
    return (/\d/.test(value) && /[a-zA-Z]/.test(value));
  }
};

const unique = {
  getMessage: field => {
    return `The value is already present in the ${field}.`;
  },
  validate: (value, collection) => {
    return !includes(collection, value);
  }
};

VeeValidate.Validator.extend('alphanumerical', alphanumerical);
VeeValidate.Validator.extend('unique', unique);

export default VeeValidate;

const mixin = ({ inherit = false } = {}) => {
  if (inherit) return { inject: ['$validator'] };
  return { $_veeValidate: { validator: 'new' } };
};

export const withValidation = mixin;
