import { defineStore } from 'pinia'
import axios from 'axios'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    data: [],
    loading: false,
    notify: {
      showNotification: false,
      textNotification: '',
      typeNotification: 'warn',
    },

            searchResultAuthor: [],

            searchResultArticle: [],

  }),
  actions: {
    async fetch(id = '', query) {
      this.startLoading()
      try {
        const result = await axios.get(`comments${query || (id ? `/${id}` : '')}`);
        this.getData(id ? result.data : result.data.rows)
      } catch (e) {
        // dispatch('snackbar/showSnackbar', e, { root: true });
      } finally {
        this.finishLoading()
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`/comments/${id}`);
        this.showNotification('Users has been deleted', 'success');
        await this.fetch()
      } catch (e) {
        console.log('deleteItem error', e)
        // dispatch('snackbar/showSnackbar', e, { root: true });
      }
    },
    async newItem(payload) {
      this.startLoading();
      try {
        const result = await axios.post('/comments', { data: payload });
        this.showNotification('Comments has been created', 'success');
        this.getData(result.data)
      } catch (e) {
        console.log(e)
        // dispatch('snackbar/showSnackbar', e, { root: true });
      } finally {
        this.finishLoading()
      }
    },
    async edit(payload) {
      this.startLoading();
      try {
        const result = await axios.put(`/comments/${payload.id}`, {id: payload.id, data: payload.data})
        // 
        this.showNotification('Comments has been updated', 'success');
        this.getData(result.data)
      } catch (e) {
        this.showNotification(e, 'error');
      } finally {
        this.finishLoading()
      }
    },

            async searchAuthor(val) {
              try {
                if (val) {
                  const result = await axios(
                    `/users/autocomplete?query=${val}&limit=100`,
                  );
                  this.setAuthor(result.data);
                } else {
                  const result = await axios(`/users/autocomplete?limit=100`);
                  this.setAuthor(result.data);
                }
              } catch (e) {
                this.showNotification(e, 'error')
                this.setAuthor([]);
              }
            },

            async searchArticle(val) {
              try {
                if (val) {
                  const result = await axios(
                    `/articles/autocomplete?query=${val}&limit=100`,
                  );
                  this.setArticle(result.data);
                } else {
                  const result = await axios(`/articles/autocomplete?limit=100`);
                  this.setArticle(result.data);
                }
              } catch (e) {
                this.showNotification(e, 'error')
                this.setArticle([]);
              }
            },

    startLoading() {
      this.loading = false;
    },
    getData(payload) {
      this.data = payload;
    },
    finishLoading() {
      this.loading = false;
    },
    showNotification(payload, type) {
      this.notify.showNotification = true
      this.notify.textNotification = payload
      this.notify.typeNotification = type
    },
    hideNotification() {
      this.notify.showNotification = false
      this.notify.textNotification = ''
    },

        setAuthor(payload) {
            this.searchResultAuthor = payload
        },

        setArticle(payload) {
            this.searchResultArticle = payload
        },

  }
})
