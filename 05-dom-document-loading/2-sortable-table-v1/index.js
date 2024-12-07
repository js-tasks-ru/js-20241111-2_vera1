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

  sort(fieldValue, orderValue) {
    this.setAttributeElementRow(orderValue);
    this.selectSubElements();
    const { body } = this.subElements;
    const cellIndexFieldSort = this.headerConfig.findIndex(obj => obj.id === fieldValue);
    const sortType = this.headerConfig[cellIndexFieldSort].sortType;
    const elementsRows = body.querySelectorAll('.sortable-table__row');
    const arrayElementsRows = [];
    for (let i = 0; i < elementsRows.length; i++) {
      arrayElementsRows[i] = elementsRows[i];
    }
    const arrayElementsRowsSorted = this.sortStrings(arrayElementsRows, orderValue, cellIndexFieldSort, sortType);
    for (let i = 0; i < arrayElementsRowsSorted.length; i++) {
      body.append(arrayElementsRowsSorted[i]);
    }
  }

  setAttributeElementRow(sortType) {
    const elem = document.body.querySelector(`[data-id='title']`);
    elem.setAttribute('data-order', sortType);
  }

  sortStrings(arr, param = 'asc', cellIndexFieldSort, sortType) {

    if (sortType === "string") {
      if (param === "asc") {
        return arr.slice().sort((a, b)=>a.children[cellIndexFieldSort].textContent.localeCompare(b.children[cellIndexFieldSort].textContent, ['ru', 'en'], {caseFirst: "upper"}));
      } else {
        let sorted = arr.slice().sort((a, b)=>a.children[cellIndexFieldSort].textContent.localeCompare(b.children[cellIndexFieldSort].textContent, ['ru', 'en'], {caseFirst: "lower"}));
        return sorted.reverse();
      }
    }

    if (sortType === "number") {
      if (param === "asc") {
        return arr.slice().sort((a, b)=>a.children[cellIndexFieldSort].textContent.localeCompare(b.children[cellIndexFieldSort].textContent, ['ru', 'en'], { numeric: true }));
      } else {
        return arr.slice().sort((a, b)=>b.children[cellIndexFieldSort].textContent.localeCompare(a.children[cellIndexFieldSort].textContent, ['ru', 'en'], { numeric: true }));              
      }
    }
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

