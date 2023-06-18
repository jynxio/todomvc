<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

const storageKey = "todomvc";

const editedTodo = ref<Todo>();
const editingTodoMemo = ref("");

const todos = ref<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"))
const filteredType = ref<"all" | "completed" | "incomplete">("all");
const filteredTypes = ["all", "completed", "incomplete"];
const filteredTodos = computed(() => {
    return filteredType.value === "all" ? todos.value
        : filteredType.value === "completed" ? todos.value.filter(todo => todo.completed)
            : filteredType.value === "incomplete" ? todos.value.filter(todo => !todo.completed)
                : [];
});
const incompleteCount = computed(() => todos.value.filter(todo => !todo.completed).length)

watch(todos, value => {
    console.log(value)
    localStorage.setItem(storageKey, JSON.stringify(value))
}, { immediate: false, flush: 'sync' });

onMounted(() => {
    globalThis.addEventListener("hashchange", handleHashChange)
});
handleHashChange();

function addTodo(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement

    if (!target.value) return;

    const todo: Todo = {
        id: Date.now(),
        title: target.value.trim(),
        completed: false,
    };

    todos.value.push(todo);
    target.value = "";
}

function toggleAll() {
    incompleteCount.value === 0
        ? todos.value.forEach(todo => todo.completed = false)
        : todos.value.forEach(todo => todo.completed = true)
}

function handleHashChange() {
    const route = globalThis.location.hash.replace(/#\/?/, "");

    if (!filteredTypes.some(type => type === route)) {
        globalThis.location.hash = "";
        filteredType.value = "all";

        return;
    }

    filteredType.value = route; // TODO
}
</script>

<template>
    <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" autofocus placeholder="What needs to be done?" @keyup.enter="addTodo">
        </header>
        <section class="main" v-show="filteredTodos.length">
            <input id="toggle-all" class="toggle-all" type="checkbox" :checked="incompleteCount === 0" @change="toggleAll">
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                <li v-for="todo in filteredTodos" class="todo" :key="todo.id"
                    :class="{ completed: todo.completed, editing: editedTodo === todo }">
                    <div class="view">
                        <input class="toggle" type="checkbox" v-model="todo.completed">
                        <label @dblclick="editedTodo = todo, editingTodoMemo = todo.title">{{ todo.title }}</label>
                        <button class="destroy" @click="todos.splice(todos.indexOf(todo), 1)"></button>
                    </div>
                    <input v-if="todo === editedTodo" class="edit" type="text" v-model="todo.title"
                        @blur="editedTodo = undefined" @keyup.enter="editedTodo = undefined"
                        @keyup.escape="editedTodo.title = editingTodoMemo, editedTodo = undefined">
                </li>
            </ul>
        </section>
        <footer class="footer" v-show="todos.length">
            <span class="todo-count">
                <strong>{{ todos.filter(todo => !todo.completed).length }}</strong>
                <span>{{ incompleteCount === 1 ? ' item' : ' items' }} left</span>
            </span>
            <ul class="filters">
                <li>
                    <a href="#/all" :class="{ selected: filteredType === 'all' }">All</a>
                </li>
                <li>
                    <a href="#/incomplete" :class="{ selected: filteredType === 'incomplete' }">Active</a>
                </li>
                <li>
                    <a href="#/completed" :class="{ selected: filteredType === 'completed' }">Completed</a>
                </li>
            </ul>
            <button class="clear-completed" @click="todos = todos.filter(todo => !todo.completed)" v-show="incompleteCount">
                Clear completed
            </button>
        </footer>
    </section>
</template>

<style module>
@import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
</style>