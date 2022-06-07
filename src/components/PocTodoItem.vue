<template>
  <div>
    <q-item>
      <q-item-section avatar>
        <q-checkbox
          true-value="done"
          false-value="pending"
          indeterminate-value="canceled"
          v-model="checked"
          val="teal"
          color="teal"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label :class="todo.state === 'canceled' ? 'text-strike' : ''">
          {{ todo.label }}
        </q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-btn
          icon="delete"
          flat
          round
          @click="$emit('delete', { _id: todo._id, state: 'canceled' })"
        ></q-btn>
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PocTodoItem',
}
</script>

<script lang="ts" setup>
import { computed, PropType, defineEmits, defineProps } from 'vue'
import { TodoItem } from 'src/models/entities/TodoItem'
const props = defineProps({
  todo: {
    type: Object as PropType<TodoItem>,
    required: true,
  },
})

const emit = defineEmits(['click', 'delete'])

const checked = computed({
  get: () => props.todo.state,
  set: (value) => {
    emit('click', { _id: props.todo._id, state: value })
  },
})
</script>
