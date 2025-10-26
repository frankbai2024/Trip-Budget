//arrow functions
//template literals
//array/object destructuring
//spread operator
//function hoisting(函数声明会提升，函数表达式不会)
//

//dom helpers
const $ = (sel) => document.querySelector(sel);
//``
const fmt = (num) => `$ ${Number(num).toFixed(2)}`;

let state = {
  meta: { createdAt: new Date().toISOString().slice(0, 10), currency: "AUD" },
  expenses: [], //{id, title, category,amount,date}
};
//----------剩余参数      回调函数                               初始值为0
const sum = (...nums) => nums.reduce((acc, n) => acc + Number(n || 0), 0);
//----render UI
function render(list = state.expenses) {
  const ul = $("#items");
  ul.innerHTML = list
    .map(
      ({ id, title, category, amount, date }) => `
    <li>
        <div>
            <div>
                <strong>${title}</strong>
                <span class='pill'>${category}</span>
            </div>
            <div class='meta'>${date || "-"}</div>     
        </div>
        <div>
          <span class='amount'>${fmt(amount)}</span>
          <button class='remove' data-id='${id}'>Remove</button>
        </div>
    </li>
  `
    )
    .join("");
  const total = sum(...state.expenses.map((item) => item.amount));
  $("#total").textContent = `Total: ${fmt(total)}`;
}

//----add new expense
$("#add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const el = e.currentTarget.elements;
  const { value: title } = el.itemTitle;
  const { value: category } = el.category;
  const { value: amountStr } = el.amount;
  const { value: date } = el.date;

  if (!title.trim()) return;

  const amount = Number(amountStr || 0);
  //crypto浏览器自己内置的API，全局对象
  //如果browser不支持，则使用
  const id =
    crypto.randomUUID?.() ?? Date.now() + Math().random().toString(16).slice(2);
  const item = { id, title, category, amount, date };
  state = { ...state, expenses: [...state.expenses, item] };

  e.currentTarget.reset();
  render();
  applyFilters();
});

//----filters
$("#clear").addEventListener("click", () => {
  $("#search").value = "";
  $("#cat").value = "All";
  render();
  applyFilters();
});
const applyFilters = () => {
  const search = $("#search").value.trim().toLowerCase();
  const cat = $("#cat").value;
  const list = state.expenses.filter(
    ({ title, category }) =>
      (cat === "All" || category === cat) &&
      (search === "" || title.toLowerCase().includes(search))
  );
  render(list);
};
$("#search").addEventListener("input", applyFilters);
$("#cat").addEventListener("change", applyFilters);

//----sort
$("#sort-amount").addEventListener("click", () => {
  state = {
    ...state,
    expenses: [...state.expenses].sort((a, b) => a.amount - b.amount),
  };
  render();
  applyFilters();
});
$("#sort-date").addEventListener("click", () => {
  state = {
    ...state,
    expenses: [...state.expenses].sort((a, b) =>
      (b.date || "").localeCompare(a.date || "")
    ),
  };
  render();
  applyFilters();
});
//----remove
$("#items").addEventListener("click", (e) => {
  const btn = e.target.closest("button.remove"); //最近的ITEM
  if (!btn) return;
  const { id } = btn.dataset;
  state = {
    ...state,
    expenses: state.expenses.filter((item) => item.id !== id),
  }; //不需要再显示这个ITEM了

  render();
  applyFilters();
});
//----load initial data
$("#seed").addEventListener("click", () => {
  const base = [
    {
      title: "Metro Card",
      category: "Transport",
      amount: 25,
      date: "2025-10-22",
    },
    {
      title: "Street Tacos",
      category: "Food",
      amount: 12.5,
      date: "2025-10-23",
    },
    {
      title: "Hotel Night",
      category: "Lodging",
      amount: 145,
      date: "2025-10-25",
    },
    {
      title: "Museum Ticket",
      category: "Entertainment",
      amount: 18,
      date: "2025-10-24",
    },
  ];
  const extra = [
    { title: "Coffee", category: "Food", amount: 4.2, date: "2025-10-22" },
    { title: "Taxi", category: "Transport", amount: 32.5, date: "2025-10-23" },
  ];

  // 用数组 spread 合并 base + extra，并给每个对象加上随机 id
  const seeded = [...base, ...extra].map((e) => ({
    id:
      crypto?.randomUUID?.() ??
      Date.now() + Math.random().toString(16).slice(2),
    ...e,
  }));
  // 嵌套解构 demo：从对象 setup 中直接取深层属性
  const setup = {
    ui: { theme: "dark", page: 1 },
    filters: { q: "", cat: "All" },
  };
  const {
    ui: { page },
  } = setup;
  console.log("Nested destructuring demo, page= ", page);

  // 用 seeded 数据覆盖当前 state.expenses
  state = { ...state, expenses: seeded };
  render();
  applyFilters();
});
//----initial render
render();
