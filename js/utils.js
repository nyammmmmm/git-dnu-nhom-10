window.NutriCheckUtils = {
  formatNutrient(value) {
    if (typeof value === "number") {
      return `${value}${Number.isInteger(value) ? "" : ""}`;
    }
    return String(value);
  },
  showMessage(container, text, type = "info") {
    container.innerHTML = `<div class="message ${type}">${text}</div>`;
  },
  clearMessage(container) {
    container.innerHTML = "";
  },
};
