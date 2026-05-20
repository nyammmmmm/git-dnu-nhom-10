const productListEl = document.getElementById("productList");
const form = document.getElementById("productForm");
const inputName = document.getElementById("foodName");
const inputGroup = document.getElementById("foodGroup");
const inputImage = document.getElementById("foodImage");
const inputCalories = document.getElementById("foodCalories");
const inputProtein = document.getElementById("foodProtein");
const inputCarbs = document.getElementById("foodCarbs");
const inputFat = document.getElementById("foodFat");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const messageEl = document.getElementById("adminMessage");
let foodsData = [];
let editingId = null;

function renderProducts(list) {
  if (list.length === 0) {
    productListEl.innerHTML = "<p>Chưa có món ăn nào trong danh sách.</p>";
    return;
  }

  productListEl.innerHTML = "";
  list.forEach((food) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-card__media">
        ${food.image ? `<img class="product-img" src="${food.image}" alt="${food.name}" />` : ""}
      </div>
      <div class="product-card__body">
        <h3>${food.name}</h3>
        <p>Nhóm: ${food.group || "Chưa có nhóm"}</p>
        <p>Calories: ${food.calories} kcal · Protein: ${food.protein} g · Carbs: ${food.carbs} g · Fat: ${food.fat} g</p>
        <div class="admin-actions">
          <button type="button" data-id="${food.id}" class="editBtn">Chỉnh sửa</button>
          <button type="button" data-id="${food.id}" class="danger deleteBtn">Xóa</button>
        </div>
      </div>
    `;
    productListEl.appendChild(card);
  });
}

function fillForm(food) {
  inputName.value = food.name;
  inputGroup.value = food.group || "";
  inputImage.value = food.image || "";
  inputCalories.value = food.calories;
  inputProtein.value = food.protein;
  inputCarbs.value = food.carbs;
  inputFat.value = food.fat;
}

function resetForm() {
  editingId = null;
  formTitle.textContent = "Thêm món ăn mới";
  form.reset();
  window.NutriCheckUtils.clearMessage(messageEl);
}

productListEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);

  if (button.classList.contains("editBtn")) {
    const food = foodsData.find((item) => item.id === id);
    if (food) {
      editingId = id;
      formTitle.textContent = "Cập nhật món ăn";
      fillForm(food);
    }
    return;
  }

  if (button.classList.contains("deleteBtn")) {
    await handleDelete(id);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleSave();
});

cancelBtn.addEventListener("click", (event) => {
  event.preventDefault();
  resetForm();
});

async function handleSave() {
  const food = {
    name: inputName.value.trim(),
    group: inputGroup.value.trim(),
    image: inputImage.value.trim(),
    calories: Number(inputCalories.value),
    protein: Number(inputProtein.value),
    carbs: Number(inputCarbs.value),
    fat: Number(inputFat.value),
  };

  if (!food.name) {
    window.NutriCheckUtils.showMessage(messageEl, "Tên món ăn không được để trống.", "error");
    return;
  }

  try {
    if (editingId) {
      await window.NutriCheckAPI.updateFood(editingId, food);
      window.NutriCheckUtils.showMessage(messageEl, "Cập nhật thành công.", "success");
    } else {
      await window.NutriCheckAPI.createFood(food);
      window.NutriCheckUtils.showMessage(messageEl, "Thêm món ăn mới thành công.", "success");
    }
    await loadProducts();
    resetForm();
  } catch (error) {
    window.NutriCheckUtils.showMessage(messageEl, "Lỗi khi lưu dữ liệu.", "error");
  }
}

async function handleDelete(id) {
  try {
    await window.NutriCheckAPI.deleteFood(id);
    window.NutriCheckUtils.showMessage(messageEl, "Xóa món ăn thành công.", "success");
    await loadProducts();
  } catch (error) {
    window.NutriCheckUtils.showMessage(messageEl, "Không thể xóa món ăn.", "error");
  }
}

async function loadProducts() {
  foodsData = await window.NutriCheckAPI.fetchFoods();
  renderProducts(foodsData);
}

loadProducts();
