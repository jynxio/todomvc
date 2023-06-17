import { For, createRenderEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store"

type Todo = {
    uuid: number;
    name: string;
    editable: boolean;
    complete: boolean;
};
type FilteredType = "all" | "complete" | "incomplete";

function App() {
    let inputRef: HTMLInputElement | undefined;
    const storageKey = "solid-todomvc";
    const [todos, setTodos] = createStore<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    const [getFilteredType, setFilteredType] = createSignal<FilteredType>("all");
    const filteredTodos = createMemo(() => {
        const type = getFilteredType();

        if (type === "all") return todos;
        if (type === "complete") return todos.filter(todo => todo.complete);
        if (type === "incomplete") return todos.filter(todo => !todo.complete);

        return [];
    });

    createRenderEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    });

    return (
        <main>
            <section><input ref={inputRef} onKeyUp={addTodo} placeholder="What needs to be done?" /></section>
            <section><ol>
                <For each={filteredTodos()}>{
                    todo => <li>
                        <input type="checkbox" checked={todo.complete}
                            onChange={e => setTodos(todos.findIndex(item => item.uuid === todo.uuid), "complete", e.target.checked)}
                        />
                        <span ondblclick={() => setTodos(todos.findIndex(item => item.uuid === todo.uuid), "editable", true)}>
                            <input disabled={!todo.editable} value={todo.name}
                                onBlur={() => setTodos(todos.findIndex(item => item.uuid === todo.uuid), "editable", false)}
                                onChange={e => setTodos(todos.findIndex(item => item.uuid === todo.uuid), "name", e.target.value)}
                            />
                        </span>
                        <button onClick={() => setTodos(todos => todos.filter(item => item.uuid !== todo.uuid))}>delete</button>
                    </li>
                }</For></ol>
            </section>
            <section>
                <button onClick={toggleAll}>toggle</button>
                <select onChange={e => setFilteredType(e.target.value as FilteredType)}>
                    <option value="all">all</option>
                    <option value="complete">completed</option>
                    <option value="incomplete">incompleted</option>
                </select>
            </section>
        </main>
    )

    function addTodo(event: KeyboardEvent) {
        if (event.key.toLowerCase() !== "enter") return;
        if (!inputRef?.value) return;

        const todo: Todo = {
            uuid: Date.now(),
            name: inputRef.value,
            editable: false,
            complete: false,
        };

        inputRef.value = "";
        setTodos(todos => [...todos, todo]);
    }

    function toggleAll() {
        const isAllCompleted = !todos.some(todo => !todo.complete);

        setTodos({ from: 0, to: todos.length - 1 }, "complete", !isAllCompleted);
    }
}

export default App
