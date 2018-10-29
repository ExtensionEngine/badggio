import filter from 'lodash/filter';
import find from 'lodash/find';
import reject from 'lodash/reject';

const INTEGRATION = 'INTEGRATION';

export const users = state => reject(state.items, { role: INTEGRATION });

export const integrations = state => filter(state.items, { role: INTEGRATION });

export const get = state => id => find(state.items, { id });
