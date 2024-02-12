import {
  IDoesFilterPassParams,
  IFilterComp,
  IFilterParams,
} from "ag-grid-community";

export class CategoricalFilter implements IFilterComp {
  filterParams!: IFilterParams;
  gui!: HTMLDivElement;
  selectedCategories: Set<string> = new Set();
  checkboxes: HTMLInputElement[] = [];

  init(params: IFilterParams & { values: string[] }): void {
    this.filterParams = params;
    this.gui = document.createElement("div");
    this.gui.style.display = "flex";
    this.gui.style.flexDirection = "column";
    this.gui.style.gap = "6px";
    this.gui.style.padding = "8px";

    const categories = params.values;
    categories.forEach((category) => {
      const checkboxContainer = document.createElement("div");
      checkboxContainer.style.display = "flex";
      checkboxContainer.style.gap = "6px";
      checkboxContainer.style.alignItems = "center";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = category;
      checkbox.value = category;
      checkbox.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
          this.selectedCategories.add(target.value);
        } else {
          this.selectedCategories.delete(target.value);
        }
        params.filterChangedCallback();
      });

      checkboxContainer.appendChild(checkbox);
      const label = document.createElement("label");
      label.htmlFor = category;
      label.appendChild(document.createTextNode(category));
      checkboxContainer.appendChild(label);

      this.gui.appendChild(checkboxContainer);
      this.checkboxes.push(checkbox);
    });
  }

  isFilterActive(): boolean {
    return this.selectedCategories.size > 0;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const { node } = params;
    const value = this.filterParams.getValue(node).toString();

    return this.selectedCategories.has(value);
  }

  getModel() {
    if (!this.isFilterActive()) {
      return null;
    }

    return {
      filter: Array.from(this.selectedCategories),
      filterType: "category",
    };
  }

  setModel(model: any): void {
    this.selectedCategories.clear();
    this.checkboxes.forEach((checkbox) => {
      if (model && model.includes(checkbox.value)) {
        checkbox.checked = true;
        this.selectedCategories.add(checkbox.value);
      } else {
        checkbox.checked = false;
      }
    });
  }

  getGui(): HTMLElement {
    return this.gui;
  }
}
