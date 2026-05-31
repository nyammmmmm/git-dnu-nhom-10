window.NutriCheckAPI = (() => {
  const API_BASE = "https://6a09e0f0e7e3f433d4838906.mockapi.io";
  console.log('NutriCheck API base:', API_BASE);

  const useMock = false;

  // Fallback local nếu API lỗi
  let localFoods = [];
  let localDiaryEntries = [];

  async function fetchFoods() {
    try {
      const response = await fetch(`${API_BASE}/foods`);
      if (!response.ok) throw new Error(`Foods fetch returned ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn("Foods fetch failed, using local fallback:", error);
      return Promise.resolve([...localFoods]);
    }
  }

  async function createFood(food) {
    try {
      const response = await fetch(`${API_BASE}/foods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(food),
      });
      if (!response.ok) throw new Error(`Foods create returned ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn("Food create failed:", error);
      const nextId = localFoods.length ? Math.max(...localFoods.map(i => i.id)) + 1 : 1;
      const newFood = { id: nextId, ...food };
      localFoods.push(newFood);
      return Promise.resolve(newFood);
    }
  }

  async function updateFood(id, food) {
    try {
      const response = await fetch(`${API_BASE}/foods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(food),
      });
      if (!response.ok) throw new Error(`Foods update returned ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn("Food update failed:", error);
      localFoods = localFoods.map(item => item.id === id ? { ...item, ...food } : item);
      return Promise.resolve(localFoods.find(item => item.id === id));
    }
  }

  async function deleteFood(id) {
    try {
      const response = await fetch(`${API_BASE}/foods/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Foods delete returned ${response.status}`);
      return true;
    } catch (error) {
      console.warn("Food delete failed:", error);
      localFoods = localFoods.filter(item => item.id !== id);
      return Promise.resolve(true);
    }
  }

  async function fetchDiaryEntries() {
    try {
      const response = await fetch(`${API_BASE}/diary_entries`);
      if (!response.ok) throw new Error(`Diary fetch returned ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn("Diary fetch failed, using local fallback:", error);
      return Promise.resolve([...localDiaryEntries]);
    }
  }

  async function createDiaryEntry(entry) {
    try {
      const response = await fetch(`${API_BASE}/diary_entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error(`Diary create returned ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn("Diary create failed, using local fallback:", error);
      const nextId = localDiaryEntries.length ? Math.max(...localDiaryEntries.map(i => i.id)) + 1 : 1;
      const newEntry = { id: nextId, foodId: entry.foodId, quantity: entry.quantity, createdAt: new Date().toISOString() };
      localDiaryEntries.push(newEntry);
      return Promise.resolve(newEntry);
    }
  }

  async function deleteDiaryEntry(id) {
    try {
      const response = await fetch(`${API_BASE}/diary_entries/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Diary delete returned ${response.status}`);
      return true;
    } catch (error) {
      console.warn("Diary delete failed, using local fallback:", error);
      localDiaryEntries = localDiaryEntries.filter(item => item.id !== id);
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