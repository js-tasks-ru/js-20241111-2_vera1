import fetchJson from './utils/fetch-json.js';
import SortableTable2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class SortableTable extends SortableTable2 {

  step = 30;
  start = 0;
  end = this.start + this.step;
  loading = false;

  constructor(headersConfig, {
    data = [],
    url = '',
    isSortLocally = false,
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
  } = {}) {

    super(headersConfig, {
      data,
      sorted,
    }, isSortLocally);
  
    this.data = data;
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;
    this.headersConfig = headersConfig;

    this.render();

    this.initEventListeners();
  }

  async loadData(id, order, start = this.start, end = this.end) {

    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    this.element.classList.add('sortable-table_loading');

    const data = await fetchJson(this.url.toString());

    if (data.length) {
      this.element.classList.remove('sortable-table_empty');
    } else {
      this.element.classList.add('sortable-table_empty');
    }
    this.element.classList.remove('sortable-table_loading');

    return data;
  }

  async render() {

    const {id, order} = this.sorted;
    let data = this.data;

    if (this.url !== '' && !data.length) {
      data = await this.loadData(id, order, this.start, this.end);
    }

    if (data.length) {
      super.update(Object.values(data));
      this.updateAttributeOrderHeader(id, order);
    }
    
    return data;
  }

  sortOnClient(idField, sortOrder) {
    super.sort(idField, sortOrder);
  }

  async sortOnServer (id, order, start = this.start, end = this.end) {
    try {
      const data = await this.loadData(id, order, start, end);
      super.update(Object.values(data));
      this.updateAttributeOrderHeader(id, order);
    } catch (err) {
      throw err;
    }
  }

  sortOnClient (id, order) {
    super.sortOnClient(id, order);
  }

  initEventListeners() {
    document.addEventListener('scroll', this.handleWindowScroll);
  }
  
  handleWindowScroll = async() => {

    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.sortLocally) {

      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      const data = await this.loadData(id, order, this.start, this.end);

      this.updateScroll(Object.values(data));

      this.loading = false;
    }

  }

  updateScroll(newDataScroll) {
    const elementDiv = document.createElement('div');

    elementDiv.innerHTML = this.createTableRows(newDataScroll);

    this.subElements.body.append(...elementDiv.childNodes);
  }

  createTableRows(data) {
    return data.map(item => `
      <div class="sortable-table__row"> ${this.createTableRow(item)} </div>`
    ).join('');
  }

  createTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return { id, template };
    });

    return cells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  updateAttributeOrderHeader(id, order) {
    const elementOrderOld = this.subElements.header.querySelector(`[data-order]`);
    if (elementOrderOld) {
      elementOrderOld.removeAttribute('data-order');
    }
    const elementOrderNew = this.subElements.header.querySelector(`[data-id='${id}']`);
    elementOrderNew.setAttribute('data-order', order);
  }

  remove() {
    super.remove();
    document.removeEventListener('scroll', this.handleWindowScroll);
  }
}
