<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title> POC V2 Front </q-toolbar-title>

        <q-btn-dropdown stretch flat :label="user.name || 'Menu'">
          <q-list>
            <q-item
              v-if="user.name"
              clickable
              v-close-popup
              tabindex="0"
              @click="logout"
            >
              <q-item-section avatar>
                <q-avatar icon="logout" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Log out</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-else
              clickable
              v-close-popup
              tabindex="0"
              @click="loginDialog"
            >
              <q-item-section avatar>
                <q-avatar icon="login" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Log in</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="user"
              clickable
              v-close-popup
              tabindex="0"
              @click="logout"
            >
              <q-item-section avatar>
                <q-avatar icon="clear" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section @click="clearDB">
                <q-item-label>Clear database</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <Suspense>
        <router-view />
      </Suspense>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, onMounted } from 'vue'
import { userCollection } from 'src/boot/pouchorm'
import { useAuthStore } from 'src/store/auth'
import { tasksScheduler } from 'src/boot/cron'

const $q = useQuasar()

const authStore = useAuthStore()
const user = computed(() => {
  return authStore.getUser
})

const loginDialog = () => {
  $q.dialog({
    title: 'Login',
    message: 'Type your username',
    prompt: {
      model: '',
      type: 'text', // optional
    },
    cancel: true,
    persistent: true,
  })
    .onOk((name: string) => {
      void authStore.login(name)
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

const logout = () => {
  authStore.setUser({
    _id: '',
    name: '',
  })
  $q.sessionStorage.set('user', '')
  tasksScheduler.stop()
}

onMounted(async () => {
  tasksScheduler.stop()
  const storedUser = $q.sessionStorage.getItem('user')
  if (storedUser) {
    try {
      const user = await userCollection.findOneOrFail({ name: storedUser })
      if (user) {
        await authStore.login(user.name)
      }
    } catch {
      // NOTE: we couldn't find the user on the localDB
      logout()
    }
  }
})

const clearDB = () => {
  $q.dialog({
    title: 'Confirmation',
    message: 'Are you sure you want to clear the database?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      // TODO: implement
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}
</script>
