<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title> POC V2 Front </q-toolbar-title>

        <q-btn-dropdown stretch flat :label="user.name">
          <q-list>
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

            <q-item
              v-if="user"
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
            <q-item v-else clickable v-close-popup tabindex="0" @click="login">
              <q-item-section avatar>
                <q-avatar icon="login" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Log in</q-item-label>
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
import { reactive } from 'vue'
import { TodoRepositorySingletonFactory } from 'src/models/repositories/TodoRepository'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const user = reactive({
  name: 'Fandresena',
})

const login = () => {
  // TODO: implement
}

const logout = () => {
  // TODO: implement
}

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
