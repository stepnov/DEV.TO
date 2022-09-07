<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useLayoutStore } from '@/stores/layout.js'
import {
  mdiForwardburger,
  mdiBackburger,
  mdiClose,
  mdiDotsVertical,
  mdiMenu,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import NavBarItemLabel from '@/components/NavBarItemLabel.vue'
import NavBarMenu from '@/components/NavBarMenu.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import BaseIcon from '@/components/BaseIcon.vue'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const layoutStore = useLayoutStore()

const isNavBarVisible = computed(() => !layoutStore.isFullScreen)

const isAsideMobileExpanded = computed(() => layoutStore.isAsideMobileExpanded)

const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger)

const menuToggleMobile = () => layoutStore.asideMobileToggle()

const isMenuNavBarActive = ref(false)

const menuNavBarToggleIcon = computed(() => isMenuNavBarActive.value ? mdiClose : mdiDotsVertical)

const menuNavBarToggle = () => {
  isMenuNavBarActive.value = !isMenuNavBarActive.value
}

const menuOpenLg = () => {
  layoutStore.asideLgToggle(true)
}

const logout = () => {
  authStore.logoutUser()
}
</script>

<template>
  <nav
    v-show="isNavBarVisible"
    class="main-navbar top-0 left-0 right-0 fixed flex bg-white h-14 z-30 w-screen
    transition-position xl:pl-60 lg:w-auto lg:items-stretch"
    :class="{'ml-60 lg:ml-0':isAsideMobileExpanded}"
  >
    <div class="flex-1 items-stretch flex h-14">
      <NavBarItem
        type="flex lg:hidden"
        @click.prevent="menuToggleMobile"
      >
        <BaseIcon
          :path="menuToggleMobileIcon"
          size="24"
        />
      </NavBarItem>
      <NavBarItem
        type="hidden lg:flex xl:hidden"
        @click.prevent="menuOpenLg"
      >
        <BaseIcon
          :path="mdiMenu"
          size="24"
        />
      </NavBarItem>
    </div>
    <div class="flex-none items-stretch flex h-14 lg:hidden">
      <NavBarItem @click.prevent="menuNavBarToggle">
        <BaseIcon
          :path="menuNavBarToggleIcon"
          size="24"
        />
      </NavBarItem>
    </div>
    <div
      class="absolute w-screen top-14 left-0 bg-white shadow
        lg:w-auto lg:items-stretch lg:flex lg:grow lg:static lg:border-b-0 lg:overflow-visible lg:shadow-none dark:bg-gray-900"
      :class="[isMenuNavBarActive ? 'block' : 'hidden']"
    >
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible lg:flex lg:items-stretch lg:justify-end lg:ml-auto"
      >

        <NavBarMenu has-divider>
          <NavBarItemLabel :label="currentUser?.firstName || 'Admin'">
            <UserAvatar v-if="!currentUser?.avatar?.length"
                        class="w-10 h-10 md:mr-6"
            />
            <img v-else
                 class="rounded-full w-6 h-6 mr-3 inline-flex"
                 :src="currentUser.avatar[0].publicUrl"
                 :alt="currentUser.avatar[0].name"
            />
          </NavBarItemLabel>

          <template #dropdown>
            <NavBarItem to="/profile">
              <NavBarItemLabel
                :icon="mdiAccount"
                label="My Profile"
              />
            </NavBarItem>

            <BaseDivider nav-bar />
            <NavBarItem
              @click="logout"
            >
              <NavBarItemLabel
                :icon="mdiLogout"
                label="Log Out"
              />
            </NavBarItem>
          </template>
        </NavBarMenu>

      </div>
    </div>
  </nav>
</template>
