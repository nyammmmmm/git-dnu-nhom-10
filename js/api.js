window.NutriCheckAPI = (() => {
  const API_BASE = "https://6a09e0f0e7e3f433d4838906.mockapi.io";
  console.log('NutriCheck API base:', API_BASE);
  let localFoods = [
    { id: 1, name: "Cơm trắng", group: "Tinh bột", image: "img/com-trang.jpg", calories: 130, protein: 2.4, carbs: 28, fat: 0.3 },
    { id: 2, name: "Ức gà nướng", group: "Protein", image: "img/uc-ga.jpg", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: 3, name: "Salad rau trộn", group: "Rau củ", image: "img/salad-rau.jpg", calories: 90, protein: 2, carbs: 7, fat: 6 },
    { id: 4, name: "Sinh tố chuối", group: "Trái cây", image: "img/sinh-to-chuoi.jpg", calories: 210, protein: 4, carbs: 45, fat: 2 },
  ];
  let localDiaryEntries = [];

  const useMock = true;

  async function fetchFoods() {
    if (useMock) {
      return Promise.resolve([...localFoods]);
    }
    const response = await fetch(`${API_BASE}/foods`);
    return response.json();
  }

  async function createFood(food) {
    if (useMock) {
      const nextId = localFoods.length ? Math.max(...localFoods.map((item) => item.id)) + 1 : 1;
      const newFood = { id: nextId, ...food };
      localFoods.push(newFood);
      return Promise.resolve(newFood);
    }
    const response = await fetch(`${API_BASE}/foods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(food),
    });
    return response.json();
  }

  async function updateFood(id, food) {
    if (useMock) {
      localFoods = localFoods.map((item) => (item.id === id ? { ...item, ...food } : item));
      return Promise.resolve(localFoods.find((item) => item.id === id));
    }
    const response = await fetch(`${API_BASE}/foods/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(food),
    });
    return response.json();
  }

  async function deleteFood(id) {
    if (useMock) {
      localFoods = localFoods.filter((item) => item.id !== id);
      return Promise.resolve(true);
    }
    await fetch(`${API_BASE}/foods/${id}`, { method: "DELETE" });
    return true;
  }

  async function fetchDiaryEntries() {
    if (useMock) {
      return Promise.resolve([...localDiaryEntries]);
    }

    try {
      const response = await fetch(`${API_BASE}/diary_entries`);
      if (!response.ok) {
        throw new Error(`Diary endpoint returned ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.warn("Diary fetch failed, using local fallback:", error);
      return Promise.resolve([...localDiaryEntries]);
    }
  }

  async function createDiaryEntry(entry) {
    if (useMock) {
      const nextId = localDiaryEntries.length ? Math.max(...localDiaryEntries.map((item) => item.id)) + 1 : 1;
      const newEntry = {
        id: nextId,
        foodId: entry.foodId,
        quantity: entry.quantity,
        createdAt: new Date().toISOString(),
      };
      localDiaryEntries.push(newEntry);
      return Promise.resolve(newEntry);
    }

    try {
      const response = await fetch(`${API_BASE}/diary_entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!response.ok) {
        throw new Error(`Diary create returned ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.warn("Diary create failed, using local fallback:", error);
      const nextId = localDiaryEntries.length ? Math.max(...localDiaryEntries.map((item) => item.id)) + 1 : 1;
      const newEntry = {
        id: nextId,
        foodId: entry.foodId,
        quantity: entry.quantity,
        createdAt: new Date().toISOString(),
      };
      localDiaryEntries.push(newEntry);
      return Promise.resolve(newEntry);
    }
  }

  async function deleteDiaryEntry(id) {
    if (useMock) {
      localDiaryEntries = localDiaryEntries.filter((item) => item.id !== id);
      return Promise.resolve(true);
    }

    try {
      const response = await fetch(`${API_BASE}/diary_entries/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Diary delete returned ${response.status}`);
      }
      return true;
    } catch (error) {
      console.warn("Diary delete failed, using local fallback:", error);
      localDiaryEntries = localDiaryEntries.filter((item) => item.id !== id);
      return Promise.resolve(true);
    }
  }

  return {
    fetchFoods,
    createFood,
    updateFood,
    deleteFood,
    fetchDiaryEntries,
    createDiaryEntry,
    deleteDiaryEntry,
  };
})();
