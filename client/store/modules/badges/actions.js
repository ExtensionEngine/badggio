import generateActions from '@/store/helpers/actions';
const { get, fetch, save, setApiUrl } = generateActions('/badges');

export { get, fetch, save, setApiUrl };
