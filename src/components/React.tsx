import { useState, useEffect, useMemo, KeyboardEvent, FocusEvent } from "react";

type Todo = { id: string; title: string; completed: boolean };

const storageKey = "todomvc";

function App() {
    const [todos, setTodos] = useState<Todo[]>(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    const [filterType, setFilterType] = useState<"all" | "active" | "completed">("all");
    const [editingId, setEditingId] = useState<string>();

    const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos])
    const filteredTodos = useMemo(() => {
        if (filterType === "all") return [...todos];
        if (filterType === "active") return todos.filter(todo => !todo.completed);
        if (filterType === "completed") return todos.filter(todo => todo.completed);

        return [];
    }, [todos, filterType]);

    useEffect(() => localStorage.setItem(storageKey, JSON.stringify(todos)), [todos]);
    useEffect(() => {
        globalThis.addEventListener("hashchange", handleHashChange);
        return () => globalThis.removeEventListener("hashchange", handleHashChange);
    });

    return (
        <section className="todoapp">
            <header className="header">
                <h1>todos</h1>
                <input className="new-todo" autoFocus placeholder="What needs to be done?" onKeyUp={addTodo} />
            </header>
            {Boolean(filteredTodos.length) && <section className="main">
                <input id="toggle-all" className="toggle-all" type="checkbox" checked={activeCount === 0} onChange={toggleAll} />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul className="todo-list">{filteredTodos.map(todo =>
                    <li className={["todo", todo.completed ? "completed" : "", editingId === todo.id ? "editing" : ""].join(" ")} key={todo.id}>
                        <div className="view">
                            <input className="toggle" type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                            <label onDoubleClick={() => setEditingId(todo.id)}>{todo.title}</label>
                            <button className="destroy" onClick={() => removeTodo(todo.id)}></button>
                        </div>{editingId === todo.id &&
                            <input className="edit" type="text" defaultValue={todo.title} onBlur={handleBlurEvent} onKeyUp={handleKeyupEvent}
                                ref={ref => Promise.resolve().then(() => ref?.focus())} />
                        }</li>)}
                </ul>
            </section>}{Boolean(todos.length) && <footer className="footer">
                <span className="todo-count">
                    <strong>{activeCount}</strong>
                    <span> item{activeCount > 1 && "s"} left</span>
                </span>
                <ul className="filters">
                    <li><a href="#/all" className={filterType === "all" ? "selected" : ""}>All</a></li>
                    <li><a href="#/active" className={filterType === "active" ? "selected" : ""}>Active</a></li>
                    <li><a href="#/completed" className={filterType === "completed" ? "selected" : ""}>Completed</a></li>
                </ul>
                {activeCount < todos.length && <button className="clear-completed" onClick={clearCompletedTodo}>Clear completed</button>}
            </footer>}
        </section>
    );

    function addTodo({ key, target }: KeyboardEvent) {
        if (key.toLowerCase() !== "enter") return;
        if (!target) return

        const input = target as HTMLInputElement;

        if (!input.value) return

        setTodos([...todos, { id: String(Date.now()), title: input.value, completed: false }])
        input.value = "";
    }

    function toggleAll() {
        setTodos(todos.map(todo => ({ ...todo, completed: activeCount !== 0 })));
    }

    function toggleTodo(id: string) {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    }

    function removeTodo(id: string) {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    function handleBlurEvent({ target }: FocusEvent<HTMLInputElement>) {
        const input = target as HTMLInputElement;
        const index = todos.findIndex(todo => todo.id === editingId);

        if (index === -1) return;

        todos[index].title = input.value;
        setTodos(todos)
        setEditingId(undefined);
    }

    function handleKeyupEvent({ key, target }: KeyboardEvent) {
        const input = target as HTMLInputElement;

        if (key.toLowerCase() === "enter") {
            input.blur();
            return;
        }

        if (key.toLowerCase() === "escape") {
            input.value = todos.find(todo => todo.id === editingId)?.title ?? input.value;
            input.blur();
            return;
        }
    }

    function clearCompletedTodo() {
        setTodos(todos.filter(todo => !todo.completed));
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

export default App;
