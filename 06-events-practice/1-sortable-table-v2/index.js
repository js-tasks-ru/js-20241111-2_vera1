import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {

  isSortLocally;
  arrowElement;
  
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}, 
  isSortLocally = true) 
  {
    super(headersConfig, data);

    this.id = sorted.id;
    this.order = sorted.order;

    this.isSortLocally = isSortLocally;
    this.createListeners();
    this.sort(this.id, this.order);
  }

  sort (idField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(idField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(idField, sortOrder) {
    super.sort(idField, sortOrder);
  }

  sortOnServer() {
    /**  */
  } 

  handleHeaderPointerDown = (event) => {
    const cellElement = event.target.closest('.sortable-table__cell');
    if (!cellElement) {
      return;
    }

    const isSortable = cellElement.dataset.sortable;
    if (!isSortable) {
      return;
    }

    const idField = cellElement.dataset.id;

    let sortOrder = cellElement.dataset.order;

    if (sortOrder === undefined) {
      sortOrder = 'asc';
    } else if (sortOrder === 'asc') {
      sortOrder = 'desc';
    } else if (sortOrder === 'desc') {
      sortOrder = 'asc';
    } 

    this.sort(idField, sortOrder);
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderPointerDown);
  }

  destroyListners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderPointerDown);
  }

  destroy() {
    this.destroyListners();
    super.destroy();
  }
}
