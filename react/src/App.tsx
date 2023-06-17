import { useState, useLayoutEffect, useMemo, KeyboardEvent } from "react";

type Todo = {
    uuid: number;
    name: string;
    editable: boolean;
    complete: boolean;
};
type FilteredType = "all" | "complete" | "incomplete";

const storageKey = "react-todomve";

function App() {
    const [filteredType, setFilteredType] = useState<FilteredType>("all");
    const [todos, setTodos] = useState<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    const filteredTodos = useMemo(() => {
        if (filteredType === "all") return todos;
        if (filteredType === "complete") return todos.filter(todo => todo.complete);
        if (filteredType === "incomplete") return todos.filter(todo => !todo.complete);

        return [];
    }, [todos, filteredType]);

    useLayoutEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    }, [todos]);

    return <>
        <section><input placeholder="What needs to be done?" onKeyUp={addTodo} /></section>
        <section>
            <ol>{
                filteredTodos.map(todo => <li key={todo.uuid}>
                    <input type="checkbox" checked={todo.complete}
                        onChange={() => setTodos(todos.map(item => item.uuid === todo.uuid ? { ...item, complete: !item.complete } : item))}
                    />
                    <span
                        onDoubleClick={() => setTodos(todos.map(item => item.uuid === todo.uuid ? { ...item, editable: !item.editable } : item))}
                    ><input disabled={!todo.editable} value={todo.name}
                        onBlur={() => setTodos(todos.map(item => item.uuid === todo.uuid ? { ...item, editable: false } : item))}
                        onChange={e => setTodos(todos.map(item => item.uuid === todo.uuid ? { ...item, name: e.target.value } : item))}
                        /></span>
                    <button onClick={() => setTodos(todos.filter(item => item.uuid !== todo.uuid))}>delete</button>
                </li>)
            }</ol>
        </section>
        <section>
            <button onClick={toggleAll}>toggle</button>
            <select onChange={e => setFilteredType(e.target.value as FilteredType)}>
                <option value="all">all</option>
                <option value="complete">complate</option>
                <option value="incomplete">incomplete</option>
            </select>
        </section>
    </>;

    function addTodo(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key.toLowerCase() !== "enter") return;

        const target = e.target as HTMLInputElement;

        if (!target.value) return;

        const todo: Todo = {
            uuid: Date.now(),
            name: target.value,
            editable: false,
            complete: false,
        };

        target.value = "";
        setTodos(todos => [...todos, todo]);
    }

    function toggleAll() {
        const isAllCompleted = !todos.some(todo => !todo.complete);

        setTodos(todos.map(todo => ({ ...todo, complete: !isAllCompleted })));
    }
}

export default App
