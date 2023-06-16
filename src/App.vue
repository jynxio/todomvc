<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";

type Todo = {
    uuid: number;
    name: string;
    editable: boolean;
    complete: boolean;
};

const storageKey = "vue-todomvc";
const input = ref("");
const todos = reactive<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
const filteredType = ref<"all" | "complete" | "incomplete">("all");
const filteredTodos = computed(() => {
    if (filteredType.value === "all") return todos;
    if (filteredType.value === "complete") return todos.filter(todo => todo.complete);
    if (filteredType.value === "incomplete") return todos.filter(todo => !todo.complete);
});
const isAllCompleted = computed(() => !Boolean(todos.find(todo => !todo.complete)))

watch(todos, value => localStorage.setItem(storageKey, JSON.stringify(value)));

function addTodo() {
    if (!input.value) return;

    const todo: Todo = {
        uuid: Date.now(),
        name: input.value.trim(),
        complete: false,
        editable: false,
    };

    todos.push(todo);
    input.value = "";
}

function updateTodoName(event: InputEvent, todo: Todo) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    todo.name = value;
}
</script>

<template>
    <main>
        <section><input v-model="input" @keyup.enter="addTodo" placeholder="What needs to be done?" />
        </section>
        <section>
            <div v-for="todo in filteredTodos" :key="todo.uuid">
                <span @click="todo.complete = !todo.complete;">{{ todo.complete ? "✅" : "❎" }}</span>
                <span @dblclick="todo.editable = !todo.editable">
                    <input :value="todo.name" :disabled="!todo.editable" @blur="todo.editable = false"
                        @input="(event: InputEvent) => updateTodoName(event, todo)" />
                </span>
                <span @click="todos.splice(todos.indexOf(todo), 1)">delete</span>
            </div>
        </section>
        <section>
            <button
                @click="isAllCompleted ? todos.forEach(todo => todo.complete = false) : todos.forEach(todo => todo.complete = true)">
                Toggle
            </button>
            <button @click="filteredType = 'all'">All</button>
            <button @click="filteredType = 'complete'">Completed</button>
            <button @click="filteredType = 'incomplete'">Incompleted</button>
        </section>
    </main>
</template>