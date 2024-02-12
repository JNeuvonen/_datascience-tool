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

    const categories = params.values;
    categories.slice(0, 10).forEach((category) => {
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

      const label = document.createElement("label");
      label.htmlFor = category;
      label.appendChild(document.createTextNode(category));

      this.gui.appendChild(checkbox);
      this.gui.appendChild(label);
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

    return Array.from(this.selectedCategories);
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

  componentMethod(message: string): void {
    alert(`Alert from CategoricalFilterComponent: ${message}`);
  }
}
