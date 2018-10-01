import find from 'lodash/find';

export const getById = ({ items }) => id => find(items, { id });
