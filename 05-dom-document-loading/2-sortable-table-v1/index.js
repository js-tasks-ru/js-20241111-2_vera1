export default class SortableTable {

  element;
  subElements = {};
  arrowElement;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();

    this.arrowElement = this.createArrowElement();
  }

  createElement(template) {
    const elem = document.createElement('div');
    elem.innerHTML = template;
    return elem.firstElementChild;
  }

  
  createArrowElement() {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = this.createArrowTemplate();
    return tempElement.firstElementChild;
  }

  createArrowTemplate() {
    return (
      `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
      </span>`
    );
  }

  createTemplate() {
    return `<div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                 
                    ${this.createTableHeaderTemplate()}
                </div>
                <div data-element="body" class="sortable-table__body">
                    ${this.createTableBodyTemplate()}
                </div>
                <div>
                  <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                  <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder"><div>
                  <p>No products satisfies your filter criteria</p>
                  <button type="button" class="button-primary-outline">Reset all filters</button>
                </div>
        </div>            
    </div>`;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  sort(field, order) {
    const config = this.headerConfig.find(item => item.id === field);

    if (!config) {
      return;
    }

    const k = order === 'asc' ? 1 : -1;

    if (config['sortType'] === "string") {
      this.data.sort((a, b) => k * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' }));
    }

    if (config['sortType'] === "number") {
      this.data.sort((a, b) => k * (a[field] - b[field]));
    }

    if (config['sortable']) {
      this.subElements.body.innerHTML = this.createTableBodyTemplate();
      this.updateHeaders(field, order);
    }
  }
 
  updateHeaders(field, order) {
    const elementOrder = this.subElements.header.querySelector(`[data-id='${field}']`);
    elementOrder.appendChild(this.arrowElement);
    elementOrder.dataset.order = order;
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map(item => (`<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
      </div>`
    )).join('');
  }

  createArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
    <span class="sort-arrow"></span>
    </span>`;
  }

  createTableBodyTemplate() {
    return this.data.map(product => { return this.createTableBodyRowTemplate(product); }).join('');
  }

  createTableBodyRowTemplate(product) {
    return ` 
      <a href="${product.id}" class="sortable-table__row">
         ${this.headerConfig.map(item => this.createTableBodyCellTemplate(item, product)).join('')}
      </a>`;
  }

  createTableBodyCellTemplate(config, product) {
    const fieldId = config.id;
    if (fieldId === "images") {
      return config.template(product[fieldId]);
    }
    return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
  }

  update(newData) {
    this.data = newData;
    this.element.querySelector(`[data-element="body"]`).innerHTML = this.createTableBodyTemplate();
  }

  destroy() {
    this.element.remove();
  }
}

