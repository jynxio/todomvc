import { Show, For, createMemo, createSignal, createUniqueId, onCleanup, onMount, createComputed } from "solid-js";
import { createStore } from "solid-js/store"

type Todo = { id: string; title: string; completed: boolean };

const storageKey = "todomvc";

function App() {
    const [todos, setTodos] = createStore<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    const [getEditingId, setEditingId] = createSignal<string>();
    const [getFilterType, setFilterType] = createSignal<"all" | "active" | "completed">("all");
    const getActiveCount = createMemo(() => todos.filter(todo => !todo.completed).length);
    const getFilteredTodos = createMemo(() => {
        const type = getFilterType();

        if (type === "all") return [...todos];
        if (type === "completed") return todos.filter(todo => todo.completed);
        if (type === "active") return todos.filter(todo => !todo.completed);

        return [];
    });

    // handle routing
    onMount(() => globalThis.addEventListener("hashchange", handleHashChange));
    onCleanup(() => globalThis.removeEventListener("hashchange", handleHashChange));

    // persistent storage
    createComputed(() => localStorage.setItem(storageKey, JSON.stringify(todos)));

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
                        <For each={getFilteredTodos()}>{todo =>
                            <li class="todo" classList={{ completed: todo.completed, editing: getEditingId() === todo.id }}>
                                <div class="view">
                                    <input class="toggle" type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                                    <label onDblClick={() => setEditingId(todo.id)}>{todo.title}</label>
                                    <button class="destroy" onClick={() => removeTodo(todo.id)}></button>
                                </div>
                                <Show when={getEditingId() === todo.id}>
                                    <input class="edit" type="text" value={todo.title} onBlur={handleBlurEvent} onKeyUp={handleKeyupEvent}
                                        ref={ref => Promise.resolve().then(() => ref.focus())} />
                                </Show>
                            </li>
                        }</For>
                    </ul>
                </section>
            </Show>
            <Show when={todos.length}>
                <footer class="footer">
                    <span class="todo-count">
                        <strong>{getActiveCount()}</strong>
                        <span> item{getActiveCount() > 1 && "s"} left</span>
                    </span>
                    <ul class="filters">
                        <li><a href="#/all" classList={{ selected: getFilterType() === "all" }}>All</a></li>
                        <li><a href="#/active" classList={{ selected: getFilterType() === "active" }}>Active</a></li>
                        <li><a href="#/completed" classList={{ selected: getFilterType() === "completed" }}>Completed</a></li>
                    </ul>
                    <Show when={getActiveCount() < todos.length}>
                        <button class="clear-completed" onClick={clearCompletedTodo}>Clear completed</button>
                    </Show>
                </footer>
            </Show>
        </section>
    );

    function addTodo({ key, target }: KeyboardEvent) {
        if (key.toLowerCase() !== "enter") return;
        if (!target) return

        const input = target as HTMLInputElement;

        if (!input.value) return

        setTodos([...todos, { id: createUniqueId(), title: input.value, completed: false }]);
        input.value = "";
    }

    function toggleAll() {
        setTodos({ from: 0, to: todos.length - 1 }, "completed", getActiveCount() !== 0);
    }

    function toggleTodo(id: string) {
        setTodos(todos.findIndex(todo => todo.id === id), todo => ({ ...todo, completed: !todo.completed }),)
    }

    function removeTodo(id: string) {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    function handleBlurEvent({ target }: FocusEvent) {
        const input = target as HTMLInputElement;
        const index = todos.findIndex(todo => todo.id === getEditingId());

        if (index === -1) return;

        setTodos(index, "title", input.value);
        setEditingId();
    }

    function handleKeyupEvent({ key, target }: KeyboardEvent) {
        const input = target as HTMLInputElement;

        if (key.toLowerCase() === "enter") {
            input.blur();
            return;
        }

        if (key.toLowerCase() === "escape") {
            input.value = todos.find(todo => todo.id === getEditingId())?.title ?? input.value;
            input.blur();
            return;
        }
    }

    function clearCompletedTodo() {
        setTodos(todos.filter(todo => !todo.completed))
    }

    function handleHashChange() {
        const route = globalThis.location.hash.replace(/#\/?/, "");

        if (route === "all" || route === "active" || route === "completed") {
            setFilterType(route)
            return;
        }

        globalThis.location.hash = "";
        setFilterType("all");
    }
}

export default App
