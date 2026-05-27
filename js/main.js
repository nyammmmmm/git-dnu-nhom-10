const resultsEl = document.getElementById("results");
const summaryEl = document.getElementById("summary");
const diaryListEl = document.getElementById("diaryList");
const totalsEl = document.getElementById("totals");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const messageEl = document.getElementById("message");
let foodsData = [];
let diaryEntries = [];

function renderFoodList(list) {
  if (list.length === 0) {
    resultsEl.innerHTML = "<p>Không tìm thấy món ăn. Thử nhập lại tên khác.</p>";
    summaryEl.innerHTML = "<p>Chọn một món để xem chi tiết của dinh dưỡng.</p>";
    return;
  }

  resultsEl.innerHTML = "";
  list.forEach((food) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <div class="food-card__media">
        ${food.image ? `<img class="food-image" src="${food.image}" alt="${food.name}" />` : `<div class="food-image food-image--placeholder">Chưa có ảnh</div>`}
      </div>
      <div class="food-card__body">
        <h3>${food.name}</h3>
        <p class="food-group">Nhóm: ${food.group || "Chưa có"}</p>
        <p>Calories: ${food.calories} kcal</p>
        <p>Protein: ${food.protein} g · Carb: ${food.carbs} g · Fat: ${food.fat} g</p>
        <div class="entry-actions">
          <button type="button" class="detailBtn" data-id="${food.id}">Xem chi tiết</button>
          <div class="entry-controls">
            <input
              type="number"
              min="1"
              value="1"
              class="entry-quantity"
              data-id="${food.id}"
            />
            <button type="button" class="addDiaryBtn" data-id="${food.id}">Thêm vào nhật ký</button>
          </div>
        </div>
      </div>
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
      <div class="nutri-item"><strong>${food.group || "Không rõ"}</strong>Nhóm</div>
    </div>
  `;
}

function renderDiaryList(entries) {
  if (entries.length === 0) {
    diaryListEl.innerHTML = "<p>Nhật ký đang trống. Thêm món ăn để bắt đầu.</p>";
    totalsEl.innerHTML = "";
    return;
  }

  diaryListEl.innerHTML = "";
  entries.forEach((entry) => {
    const food = foodsData.find((item) => item.id === entry.foodId);
    if (!food) return;

    const card = document.createElement("div");
    card.className = "diary-item";
    const totalCalories = food.calories * entry.quantity;
    const totalProtein = food.protein * entry.quantity;
    const totalCarbs = food.carbs * entry.quantity;
    const totalFat = food.fat * entry.quantity;

    card.innerHTML = `
      <div class="diary-meta">
        <h3>${food.name}</h3>
        <p>${entry.quantity} phần • ${totalCalories} kcal</p>
      </div>
      <p>Protein: ${totalProtein} g · Carb: ${totalCarbs} g · Fat: ${totalFat} g</p>
      <button type="button" class="deleteDiaryBtn danger" data-id="${entry.id}">Xóa</button>
    `;
    diaryListEl.appendChild(card);
  });
}

function renderTotals(entries) {
  const totals = entries.reduce(
    (acc, entry) => {
      const food = foodsData.find((item) => item.id === entry.foodId);
      console.log(food);
      if (!food) return acc;
      acc.calories += food.calories * entry.quantity;
      acc.protein += food.protein * entry.quantity;
      acc.carbs += food.carbs * entry.quantity;
      acc.fat += food.fat * entry.quantity;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const caloriesFromProtein = totals.protein * 4;
  const caloriesFromCarbs = totals.carbs * 4;
  const caloriesFromFat = totals.fat * 9;
  const macroCalories = caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;
  const percent = (value) => (macroCalories ? Math.round((value / macroCalories) * 100) : 0);

  totalsEl.innerHTML = `
    <div class="totals-grid">
      <div class="nutri-item"><strong>${totals.calories} kcal</strong>Tổng calo</div>
      <div class="nutri-item"><strong>${totals.protein.toFixed(1)} g</strong>Protein</div>
      <div class="nutri-item"><strong>${totals.carbs.toFixed(1)} g</strong>Carb</div>
      <div class="nutri-item"><strong>${totals.fat.toFixed(1)} g</strong>Fat</div>
      <div class="nutri-item"><strong>${percent(caloriesFromProtein)}%</strong>Protein</div>
      <div class="nutri-item"><strong>${percent(caloriesFromCarbs)}%</strong>Carb</div>
      <div class="nutri-item"><strong>${percent(caloriesFromFat)}%</strong>Fat</div>
    </div>
  `;
}

resultsEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const foodId = Number(button.dataset.id);
  const food = foodsData.find((item) => item.id === foodId);
  if (!food) return;

  if (button.classList.contains("detailBtn")) {
    renderSummary(food);
    return;
  }

  if (button.classList.contains("addDiaryBtn")) {
    const card = button.closest(".food-card");
    const quantityInput = card.querySelector(".entry-quantity");
    const quantity = Number(quantityInput.value) || 1;
    await addDiaryItem(foodId, quantity);
  }
});

async function addDiaryItem(foodId, quantity) {
  if (quantity < 1) {
    window.NutriCheckUtils.showMessage(messageEl, "Số phần phải lớn hơn 0.", "error");
    return;
  }

  try {
    await window.NutriCheckAPI.createDiaryEntry({ foodId, quantity });
    window.NutriCheckUtils.showMessage(messageEl, "Đã thêm vào nhật ký.", "success");
    await loadDiary();
  } catch (error) {
    window.NutriCheckUtils.showMessage(messageEl, "Không thể thêm vào nhật ký.", "error");
  }
}

diaryListEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("deleteDiaryBtn")) {
    const entryId = Number(button.dataset.id);
    await deleteDiaryEntry(entryId);
  }
});

async function deleteDiaryEntry(entryId) {
  try {
    await window.NutriCheckAPI.deleteDiaryEntry(entryId);
    window.NutriCheckUtils.showMessage(messageEl, "Đã xóa mục trong nhật ký.", "success");
    await loadDiary();
  } catch (error) {
    window.NutriCheckUtils.showMessage(messageEl, "Không thể xóa mục trong nhật ký.", "error");
  }
}

function handleSearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = foodsData.filter((food) => food.name.toLowerCase().includes(keyword));
  renderFoodList(filtered);
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

async function loadFoods() {
  foodsData = await window.NutriCheckAPI.fetchFoods();
  renderFoodList(foodsData);
}

async function loadDiary() {
  diaryEntries = await window.NutriCheckAPI.fetchDiaryEntries();
  renderDiaryList(diaryEntries);
  renderTotals(diaryEntries);
}

async function init() {
  try {
    await loadFoods();
    await loadDiary();
  } catch (error) {
    window.NutriCheckUtils.showMessage(messageEl, "Không thể tải dữ liệu. Vui lòng thử lại sau.", "error");
  }
}

init();
