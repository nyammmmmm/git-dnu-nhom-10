const foods = [
  {
    
    name: "Cơm trắng",
    calories: 130,
    protein: 2.4,
    carbs: 28,
    fat: 0.3,
  },
  {
    name: "Ức gà nướng",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    name: "Salad rau trộn",
    calories: 90,
    protein: 2,
    carbs: 7,
    fat: 6,
  },
  {
    name: "Sinh tố chuối",
    calories: 210,
    protein: 4,
    carbs: 45,
    fat: 2,
  },
];

const resultsEl = document.getElementById("results");
const summaryEl = document.getElementById("summary");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function renderFoodList(list) {
  if (list.length === 0) {
    resultsEl.innerHTML = "<p>Không tìm thấy món ăn. Thử nhập lại tên khác.</p>";
    summaryEl.innerHTML = "<p>Chọn một món để xem chi tiết dinh dưỡng.</p>";
    return;
  }

  resultsEl.innerHTML = "";
  list.forEach((food, index) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <h3>${food.name}</h3>
      <p>Calories: ${food.calories} kcal</p>
      <p>Protein: ${food.protein} g</p>
      <button type="button" data-index="${index}">Xem chi tiết</button>
    `;
    resultsEl.appendChild(card);
  });
}

function renderSummary(food) {
  summaryEl.innerHTML = `
    <div class="nutri-grid">
      <div class="nutri-item"><strong>${food.calories} kcal</strong>Calories</div>
      <div class="nutri-item"><strong>${food.protein} g</strong>Protein</div>
      <div class="nutri-item"><strong>${food.carbs} g</strong>Carbs</div>
      <div class="nutri-item"><strong>${food.fat} g</strong>Fat</div>
    </div>
  `;
}

resultsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const index = Number(button.dataset.index);
  if (Number.isFinite(index)) {
    renderSummary(foods[index]);
  }
});

function handleSearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = foods.filter((food) => food.name.toLowerCase().includes(keyword));
  renderFoodList(filtered);
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

renderFoodList(foods);
