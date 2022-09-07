import {
  mdiDesktopMac,
  mdiSquareEditOutline,
  mdiTable,
  mdiLock,
  mdiFileDocumentOutline
} from '@mdi/js'

const externalLink = () => {
  return process.env.NODE_ENV === 'production' ? window.location.origin + '/api-docs' : 'http://localhost:8080/api-docs';
}

export default [
  'General',
  [
    {
      to: '/',
      label: 'Dashboard',
      icon: mdiDesktopMac
    }
  ],
  'Entities',
  [

  {
    to: '/users',
    label: 'Users',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Users/UsersView.vue'),
},

  {
    to: '/tags',
    label: 'Tags',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Tags/TagsView.vue'),
},

  {
    to: '/articles',
    label: 'Articles',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Articles/ArticlesView.vue'),
},

  {
    to: '/categories',
    label: 'Categories',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Categories/CategoriesView.vue'),
},

  {
    to: '/comments',
    label: 'Comments',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Comments/CommentsView.vue'),
},

    {
      to: '/change_password',
      label: 'Change Password',
      icon: mdiLock,
      component: () => import('@/views/ChangePasswordView.vue'),
    },
    {
      href: externalLink(),
      label: 'API docs',
      icon: mdiFileDocumentOutline,
    },
  ],
]
