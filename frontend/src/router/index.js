import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Tables from '@/views/TablesView.vue'
import decode from 'jwt-decode';

function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const date = new Date().getTime() / 1000;
  const data = decode(token);
  if (!data) return;
  return date < data.exp;
}

const routes = [

  {
    meta: {
      title: 'Dashboard',
    },
    path: '/',
    name: 'Dashboard',
    component: Home
  },

    {
      meta: {
        title: 'Users'
      },
      path: '/users',
      name: 'Users',
      component: () => import('@/views/CRUD/Users/UsersView.vue'),
    },
    {
      meta: {
        title: 'New Users'
      },
      path: '/users/new',
      name: 'NewUsers',
      component: () => import('@/views/CRUD/Users/UsersNew.vue'),
    },
    {
      meta: {
        title: 'Edit Users'
      },
      path: '/users/:id/edit',
      name: 'EditUsers',
      component: () => import('@/views/CRUD/Users/UsersEdit.vue'),
    },

    {
      meta: {
        title: 'Tags'
      },
      path: '/tags',
      name: 'Tags',
      component: () => import('@/views/CRUD/Tags/TagsView.vue'),
    },
    {
      meta: {
        title: 'New Tags'
      },
      path: '/tags/new',
      name: 'NewTags',
      component: () => import('@/views/CRUD/Tags/TagsNew.vue'),
    },
    {
      meta: {
        title: 'Edit Tags'
      },
      path: '/tags/:id/edit',
      name: 'EditTags',
      component: () => import('@/views/CRUD/Tags/TagsEdit.vue'),
    },

    {
      meta: {
        title: 'Articles'
      },
      path: '/articles',
      name: 'Articles',
      component: () => import('@/views/CRUD/Articles/ArticlesView.vue'),
    },
    {
      meta: {
        title: 'New Articles'
      },
      path: '/articles/new',
      name: 'NewArticles',
      component: () => import('@/views/CRUD/Articles/ArticlesNew.vue'),
    },
    {
      meta: {
        title: 'Edit Articles'
      },
      path: '/articles/:id/edit',
      name: 'EditArticles',
      component: () => import('@/views/CRUD/Articles/ArticlesEdit.vue'),
    },

    {
      meta: {
        title: 'Categories'
      },
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/CRUD/Categories/CategoriesView.vue'),
    },
    {
      meta: {
        title: 'New Categories'
      },
      path: '/categories/new',
      name: 'NewCategories',
      component: () => import('@/views/CRUD/Categories/CategoriesNew.vue'),
    },
    {
      meta: {
        title: 'Edit Categories'
      },
      path: '/categories/:id/edit',
      name: 'EditCategories',
      component: () => import('@/views/CRUD/Categories/CategoriesEdit.vue'),
    },

    {
      meta: {
        title: 'Comments'
      },
      path: '/comments',
      name: 'Comments',
      component: () => import('@/views/CRUD/Comments/CommentsView.vue'),
    },
    {
      meta: {
        title: 'New Comments'
      },
      path: '/comments/new',
      name: 'NewComments',
      component: () => import('@/views/CRUD/Comments/CommentsNew.vue'),
    },
    {
      meta: {
        title: 'Edit Comments'
      },
      path: '/comments/:id/edit',
      name: 'EditComments',
      component: () => import('@/views/CRUD/Comments/CommentsEdit.vue'),
    },

  {
    meta: {
      title: 'Change Password'
    },
    path: '/change_password',
    name: 'Change Password',
    component: () => import('@/views/ChangePasswordView.vue'),
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
    {
      meta: {
        title: 'Register',
        fullScreen: true
      },
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      meta: {
        title: 'Verify',
        fullScreen: true
      },
      path: '/verify-email',
      name: 'Verify',
      component: () => import('@/views/VerifyEmailView.vue')
    },
    {
      meta: {
        title: 'Forgot',
        fullScreen: true
      },
      path: '/forgot',
      name: 'Forgot',
      component: () => import('@/views/ForgotPasswordView.vue')
    },
    {
      meta: {
        title: 'Reset',
        fullScreen: true
      },
      path: '/password-reset',
      name: 'Reset',
      component: () => import('@/views/ResetPasswordView.vue')
    },
  {
    meta: {
      title: 'Error',
      fullScreen: true
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  },
    {
      meta: {
        title: 'Starter',
        fullScreen: true
      },
      path: '/starter',
      name: 'Starter',
      component: () => import('@/views/StarterView.vue')
    },
    {
        meta: {
          title: 'Profile',
        },
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue')
      }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to, from) => {
  if (
    !isAuthenticated() && !['Login', 'Register', 'Verify', 'Reset', 'Forgot', 'Starter'].includes(to.name)
  ) {
    return { name: 'Starter' }
  }
})

export default router
