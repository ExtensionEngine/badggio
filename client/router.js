import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import Router from 'vue-router';
import store from './store';
import Vue from 'vue';

import Auth from '@/components/auth';
import BadgeList from '@/components/badges/list';
import Badges from '@/components/badges';
import BadgeSave from '@/components/badges/save';
import ForgotPassword from '@/components/auth/ForgotPassword';
import Index from '@/components/index';
import Login from '@/components/auth/Login';
import NotFound from '@/components/common/NotFound';
import ResetPassword from '@/components/auth/ResetPassword';
import Users from '@/components/users';

Vue.use(Router);

const paramsNumParser = route => mapValues(route.params, Number);

// Handle 404
const fallbackRoute = {
  path: '*',
  component: NotFound
};

const router = new Router({
  routes: [{
    path: '/auth',
    name: 'auth',
    component: Auth,
    children: [{
      path: 'login',
      name: 'login',
      component: Login
    }, {
      path: 'forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    }, {
      path: 'reset-password/:token',
      name: 'reset-password',
      component: ResetPassword
    }]
  }, {
    path: '/',
    name: 'home',
    component: Index,
    meta: { auth: true },
    children: [{
      path: '/users',
      name: 'users',
      component: Users
    }, {
      path: '/badges',
      name: 'badges',
      component: Badges,
      children: [{
        path: '',
        name: 'badge-list',
        component: BadgeList
      }, {
        path: 'create',
        name: 'badge-create',
        component: BadgeSave
      }, {
        path: ':id',
        name: 'badge-edit',
        component: BadgeSave,
        props: paramsNumParser
      }]
    }, fallbackRoute]
  }, fallbackRoute]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(it => it.meta.auth) && !get(store.state, 'auth.user')) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
