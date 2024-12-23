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
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map(columnConfig => ( `<div class="sortable-table__cell" data-id="${columnConfig.id}" data-sortable="${columnConfig.sortable}">
          <span>${columnConfig.title}</span>
                ${this.createTableHeaderImgTemplate(columnConfig.title)}
        </span>
      </div>`
    )).join('');
  }

  createTableHeaderImgTemplate(title) {
    let result = '';
    if (title === "Name") {
      result = `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
    }
    return result;
  }

  createTableBodyTemplate() {
    return this.data.map(product => { return this.createTableBodyRowTemplate(product); }).join(''); 
  }

  createTableBodyRowTemplate(product) {
    return ` 
      <a href="${product.id}" class="sortable-table__row">
         ${this.headerConfig.map(columnConfig => this.createTableBodyCellTemplate(columnConfig, product)).join('')}
      </a>`; 
  }

  createTableBodyCellTemplate(columnConfig, product) {
    const fieldId = columnConfig.id;
    if (fieldId === "images") {
      return columnConfig.template(product[fieldId]);
    }
    return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
  }

  destroy() {
    this.element.remove();
  }
}

