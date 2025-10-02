 // --- super simple state + helpers ---
      const STORAGE_KEY = "dummy-todos:v1";
      const $ = (sel, root = document) => root.querySelector(sel);
      const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

      const initialDummy = [
        { id: crypto.randomUUID(), text: "Read docs for project", done: false },
        { id: crypto.randomUUID(), text: "Design onboarding UI", done: true },
        { id: crypto.randomUUID(), text: "Fix small CSS bug", done: false }
      ];

      const load = () => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      };

      const save = (todos) => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

      let todos = load() ?? structuredClone(initialDummy);

      // --- DOM refs ---
      const form = $("#todo-form");
      const input = $("#todo-input");
      const list = $("#todo-list");
      const count = $("#count");
      const clearBtn = $("#clear-completed");
      const resetBtn = $("#reset-dummy");
      const itemTpl = $("#todo-item-template");

      // --- rendering ---
      function render() {
        list.innerHTML = "";
        todos.forEach((t) => list.appendChild(makeItem(t)));
        const active = todos.filter((t) => !t.done).length;
        count.textContent = `${todos.length} item${todos.length !== 1 ? "s" : ""} • ${active} left`;
        save(todos);
      }

      function makeItem(todo) {
        const node = itemTpl.content.firstElementChild.cloneNode(true);
        const checkbox = $("input[type='checkbox']", node);
        const label = $("span", node);
        const delBtn = $("button", node);

        checkbox.checked = todo.done;
        label.textContent = todo.text;
        label.className = "flex-1 text-sm " + (todo.done ? "line-through text-slate-400" : "");

        checkbox.addEventListener("change", () => {
          todo.done = checkbox.checked;
          render();
        });

        delBtn.addEventListener("click", () => {
          todos = todos.filter((t) => t.id !== todo.id);
          render();
        });

        return node;
      }

      // --- events ---
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        todos.unshift({ id: crypto.randomUUID(), text, done: false });
        input.value = "";
        render();
      });

      clearBtn.addEventListener("click", () => {
        todos = todos.filter((t) => !t.done);
        render();
      });

      resetBtn.addEventListener("click", () => {
        todos = structuredClone(initialDummy);
        render();
      });

      // initial paint
      render();