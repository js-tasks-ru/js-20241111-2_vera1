export default class SortableTable {

  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
  }

  createElement(template) {
    const elem = document.createElement('div');
    elem.innerHTML = template;
    return elem.firstElementChild;
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

    this.subElements.body.innerHTML = this.createTableBodyTemplate();

    this.addOrderAttribute(field, order);
  }

  addOrderAttribute(field, order) {
    const elementOrderOld = this.subElements.header.querySelector(`[data-order]`);
    if (elementOrderOld) {
      elementOrderOld.removeAttribute('data-order');
    }
    const elementOrderNew = this.subElements.header.querySelector(`[data-id='${field}']`);
    elementOrderNew.setAttribute('data-order', order);
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map(item => (`<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
                ${item.sortable ? this.createArrowTemplate() : ''}
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

  destroy() {
    this.element.remove();
  }
}

