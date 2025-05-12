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
    });
  
    this.data = data;
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;
    this.headersConfig = headersConfig;

    this.render();

  }

  createUrl({ id, order, start, end }) {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.set('_sort', id);
    url.searchParams.set('_order', order);
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);

    return url;
  }

  async loadData(id, order, start = this.start, end = this.end) {
    try {
      this.element.classList.add('sortable-table_loading');
      this.loading = true;

      const url = this.createUrl({ id, order, start, end });
      const data = await fetchJson(url);

      if (data.length) {
        this.element.classList.remove('sortable-table_empty');
      } else {
        this.element.classList.add('sortable-table_empty');
      }
      return data;
    } catch (err) {
      console.warn(err);
    } finally {
      this.element.classList.remove('sortable-table_loading');
      this.loading = false;
    }
    return [];
  }

  async render() {

    const {id, order} = this.sorted;
    let data = this.data;

    if (this.url !== '' && !data.length) {
      data = await this.loadData(id, order, this.start, this.end);
    }

    if (data.length) {
      super.update(Object.values(data));
    }
    
    return data;
  }

  async sortOnServer (id, order, start = this.start, end = this.end) {
    try {
      const data = await this.loadData(id, order, start, end);
      const config = this.headerConfig.find(item => item.id === id);
      if (config.sortable === true) {
        super.update(Object.values(data));
        super.updateHeaders(id, order);
      }
    } catch (err) {
      console.log(err);
    }
  }

  sortOnClient (id, order) {
    super.sortOnClient(id, order);
  }

  createListeners() {
    super.createListeners();
    this.handleWindowScroll = this.handleWindowScroll.bind(this);
    document.addEventListener('scroll', this.handleWindowScroll);
  }

  destroyListners() {
    super.destroyListners();
    document.addEventListener('scroll', this.handleWindowScroll);
  }
  
  async handleWindowScroll() {
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    const shouldScroll = bottom < document.documentElement.clientHeight && !this.loading; // && !this.sortLocally

    if (shouldScroll) {
      this.start = this.end;
      this.end = this.start + this.step;

      const data = await this.loadData(id, order, this.start, this.end);
      this.data = [...this.data, ...data];
      this.update(this.data);
    }
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

  destroy() {
    super.destroy();
    this.destroyListners();
  }
}
