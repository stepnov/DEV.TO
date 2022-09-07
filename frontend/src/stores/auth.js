import * as config from "@/config";
import axios from 'axios';
import decode from 'jwt-decode';
import router from '../router';
import { defineStore } from "pinia";
import { notify } from '@kyvg/vue3-notification';

export const useAuthStore = defineStore('auth', {
  namespaced: true,
  state: () => ({
    isFetching: false,
    errorMessage: '',
    currentUser: null,
    notify: {
      showNotification: false,
      textNotification: '',
      typeNotification: 'warn',
    }
  }),
  actions: {
    showNotify(payload) {
      this.notify.showNotification = true
      this.notify.textNotification = payload
    },
    async findMe() {
      try {
        const response = await axios.get('/auth/me');
        return response.data;
      } catch (e) {
        // dispatch('snackbar/showSnackbar', e, { root: true });
        this.logoutUser();
      }
    },
    async doInit() {
      try {
        let currentUser = null;
        let token = localStorage.getItem('token');
        if (token) {
          currentUser = await this.findMe();
        }
        this.loginSuccess(currentUser)
      } catch (e) {
        this.loginFailure(e)
      }
    },
    async loginUser(payload) {
      this.loginRequest();
      if (payload.social) {
        window.location.href =
          config.baseURLApi + '/auth/signin/' + payload.social;
      } else if (payload.email && payload.password) {
        try {
          const res = await axios.post('/auth/signin/local', payload);
          const token = res.data;
          this.receiveToken(token);
          await this.doInit();
        } catch (e) {
          this.showNotify(e.response.data)
          this.loginError(e.response.data);
        }
      } else {
        this.loginFailure('Something was wrong. Try again')
      }
    },
    async register(payload) {
      try {
        this.isFetching = true;
        if (payload.email && payload.password) {
          await axios.post('/auth/signup', payload);
          this.isFetching = false;
          router.push('/login');
          notify({
            title: "Registration",
            text: 'Please check your email for verification link',
            type: 'success',
          })
        } else {
          notify({
            title: "Registration",
            text: 'Fill email and password fields',
            type: 'error',
          })
        }
      } catch (e) {
        notify({
          title: "Registration",
          text: e,
          type: 'error',
        })
      }
    },
    async verifyEmail(token) {
      try {
        const res = await axios.put('/auth/verify-email', {token});
        if (res) {
          notify({
            title: "Auth",
            text: 'Your email was verified',
            type: 'success',
          })
          router.push('/login');
        }
      } catch (e) {
        notify({
          title: "Auth",
          text: e,
          type: 'error',
        })
      }
    },
    async changePassword(payload) {
      if (!payload) return false;
      try {
        await axios.put('/auth/password-update', payload);
        notify({
          title: "Auth",
          text: 'Password has been changed',
          type: 'success',
        })
        router.push('/');
      } catch (e) {
        notify({
          title: "Auth",
          text: e,
          type: 'error',
        })
      }
    },
    async resetPassword(payload) {
      try {
        await axios.put('/auth/password-reset', payload);
        notify({
          title: "Auth",
          text: 'Password has been changed',
          type: 'success',
        })
        router.push('/login');
      } catch (e) {
        notify({
          title: "Auth",
          text: e,
          type: 'error',
        })
      }
    },
    async forgotPassword(payload) {
      try {
        await axios.post('/auth/send-password-reset-email', {
          email: payload,
        });
        notify({
          title: "Auth",
          text: 'Check your email address',
          type: 'success',
        })
        router.push('/login');
      } catch (e) {
        notify({
          title: "Auth",
          text: e,
          type: 'error',
        })
      }
    },
    receiveToken(token) {
      let user = decode(token);
      this.loginSuccess()
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      router.push('/');
    },
    logoutUser() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      axios.defaults.headers.common['Authorization'] = '';
      router.push('/login');
    },
    loginError(payload) {
      this.loginFailure(payload);
    },
    loginRequest(){
      this.isFetching = true;
    },
    loginSuccess(user) {
      this.isFetching = false;
      this.errorMessage = '';
      this.currentUser = user || null;
      this.setUser(user);
    },
    setUser(user) {
      this.currentUser = user;
    },
    loginFailure(payload){
      this.isFetching = false;
      this.errorMessage = payload;
      this.currentUser = null;
    }
  },
});
