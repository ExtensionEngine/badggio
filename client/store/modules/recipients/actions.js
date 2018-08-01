import generateActions from '@/store/helpers/actions';
const { fetch, setApiUrl } = generateActions('/recipients');

export { fetch, setApiUrl };
