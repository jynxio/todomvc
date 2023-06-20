<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

type Todo = { id: number; title: string; completed: boolean };

const storageKey = "todomvc";

const editedTodoId = ref<number>();
const editedTodoMemo = ref("");
const todos = ref<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"))
const filteredType = ref<"all" | "completed" | "active">("all");
const filteredTodos = computed(() => {
    return filteredType.value === "all" ? [...todos.value]
        : filteredType.value === "completed" ? todos.value.filter(todo => todo.completed)
            : filteredType.value === "active" ? todos.value.filter(todo => !todo.completed)
                : [];
});
const activeCount = computed(() => todos.value.filter(todo => !todo.completed).length)

watch(todos, value => {
    localStorage.setItem(storageKey, JSON.stringify(value))
}, { flush: "sync", deep: true });

handleHashChange();
onMounted(() => globalThis.addEventListener("hashchange", handleHashChange));
onUnmounted(() => globalThis.removeEventListener("hashchange", handleHashChange));

function addTodo(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement

    if (!target.value) return;

    todos.value.push({ id: Date.now(), title: target.value.trim(), completed: false });
    target.value = "";
}

function toggleAll() {
    activeCount.value === 0
        ? todos.value.forEach(todo => todo.completed = false)
        : todos.value.forEach(todo => todo.completed = true)
}

function handleHashChange() {
    const route = globalThis.location.hash.replace(/#\/?/, "");

    if (route === "all" || route === "active" || route === "completed") {
        filteredType.value = route;
        return;
    }

    globalThis.location.hash = "";
    filteredType.value = "all";
}

function handleVnodeMounted ({ el }: { el: HTMLInputElement }) {
    el.focus();
}
</script>

<template>
    <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" autofocus placeholder="What needs to be done?" @keyup.enter="addTodo" />
        </header>
        <section class="main" v-show="filteredTodos.length">
            <input id="toggle-all" class="toggle-all" type="checkbox" :checked="activeCount === 0" @change="toggleAll" />
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                <li v-for="todo in filteredTodos" class="todo" :key="todo.id"
                    :class="{ completed: todo.completed, editing: editedTodoId === todo.id }">
                    <div class="view">
                        <input class="toggle" type="checkbox" v-model="todo.completed" />
                        <label @dblclick="editedTodoId = todo.id, editedTodoMemo = todo.title">{{ todo.title }}</label>
                        <button class="destroy"
                            @click="todos.splice(todos.findIndex(item => item.id === todo.id), 1)"></button>
                    </div>
                    <input v-if="todo.id === editedTodoId" class="edit" type="text" v-model="todo.title"
                        @blur="editedTodoId = undefined" @keyup.enter="editedTodoId = undefined"
                        @vnode-mounted="handleVnodeMounted"
                        @keyup.escape="editedTodoId = undefined, todos.find(item => item.id === todo.id && (item.title = editedTodoMemo))" />
                </li>
            </ul>
        </section>
        <footer class="footer" v-show="todos.length">
            <span class="todo-count">
                <strong>{{ activeCount }}</strong>
                <span>{{ activeCount === 1 ? ' item' : ' items' }} left</span>
            </span>
            <ul class="filters">
                <li>
                    <a href="#/all" :class="{ selected: filteredType === 'all' }">All</a>
                </li>
                <li>
                    <a href="#/active" :class="{ selected: filteredType === 'active' }">Active</a>
                </li>
                <li>
                    <a href="#/completed" :class="{ selected: filteredType === 'completed' }">Completed</a>
                </li>
            </ul>
            <button class="clear-completed" @click="todos = todos.filter(todo => !todo.completed)" v-show="activeCount">
                Clear completed
            </button>
        </footer>
    </section>
</template>

<style>
@import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
</style>