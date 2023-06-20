import { Show, For, createRenderEffect, createMemo, createSignal, createUniqueId } from "solid-js";
import { createStore } from "solid-js/store"

type Todo = { id: string; title: string; completed: boolean };

const storageKey = "solid-todomvc";

function App() {
    const [todos, setTodos] = createStore<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    const [getEditingId, setEditingId] = createSignal<string>();
    const [getFilterTipe, setFilterType] = createSignal<"all" | "active" | "completed">("all");
    const getFilteredTodos = createMemo(() => {
        const type = getFilterTipe();

        if (type === "all") return [...todos];
        if (type === "completed") return todos.filter(todo => todo.completed);
        if (type === "active") return todos.filter(todo => !todo.completed);

        return [];
    });
    const getActiveCount = createMemo(() => todos.filter(todo => !todo.completed).length);

    createRenderEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    });

    function addTodo({ key, target }: KeyboardEvent) {
        if (key.toLowerCase() !== "enter") return;
        if (!target.value) return;

        target.value = "";
        setTodos([...todos, { id: createUniqueId(), title: target.value || "", completed: false }]);
    }

    function toggleAll() {
        setTodos({ from: 0, to: todos.length - 1 }, "completed", getActiveCount() !== 0);
    }

    function editTodo() { }

    function removeTodo() { }

    function finishEditTodo() { }

    function cencalEditTodo() { }

    function clearCompletedTodo() { }

    return (
        <section class="todoapp">
            <header class="header">
                <h1>todos</h1>
                <input class="new-todo" autofocus placeholder="What needs to be done?" onKeyUp={addTodo} />
            </header>
            <Show when={getFilteredTodos().length}>
                <section class="main">
                    <input id="toggle-all" class="toggle-all" type="checkbox" checked={getActiveCount() === 0} onChange={toggleAll} />
                    <label for="toggle-all">Mark all as complete</label>
                    <ul class="todo-list">
                        <For each={getFilteredTodos()}>{
                            todo => <li class="todo" classList={{ completed: todo.completed, editing: getEditingId() === todo.id }}>
                                <div class="view">
                                    <input class="toggle" type="checkbox" checked={todo.completed /* v-model */} />
                                    <label onDblClick={editTodo}>{todo.title}</label>
                                    <button class="destroy" onclick={removeTodo}></button>
                                </div>
                                <Show when={getEditingId() === todo.id}>
                                    <input class="edit" type="text" value={todo.title /* v-model */}
                                        onBlur={finishEditTodo} onKeyUp={finishEditTodo /* is enter? is escape? */}
                                    // vnode-mounted = focues
                                    />
                                </Show>
                            </li>
                        }</For>
                    </ul>
                </section >
            </Show>
            <Show when={todos.length}>
                <footer class="footer">
                    <span class="todo-count">
                        <strong>{getActiveCount()}</strong>
                        <span>{getActiveCount() === 1 ? " item" : " items"} left</span>
                    </span>
                    <ul class="filters">
                        <li>
                            <a href="#/all" classList={{ selected: getFilterTipe() === "all" }}>All</a>
                        </li>
                        <li>
                            <a href="#/active" classList={{ selected: getFilterTipe() === "active" }}>Active</a>
                        </li>
                        <li>
                            <a href="#/completed" classList={{ selected: getFilterTipe() === "completed" }}>Completed</a>
                        </li >
                    </ul >
                    <Show when={getActiveCount}>
                        <button class="clear-completed" onClick={clearCompletedTodo}>Clear completed</button>
                    </Show>
                </footer >
            </Show>
        </section >
    );
}

export default App
