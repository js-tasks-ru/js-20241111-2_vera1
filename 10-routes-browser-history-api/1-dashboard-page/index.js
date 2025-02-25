import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {

  element;
  subElements = {};
  ordersChart;
  salesChart;
  customersChart;
  sortableTable;

  selectingFrom = true;
  selected = {
    from: new Date(),
    to: new Date()
  };

  constructor() {

    this.ordersChart = new ColumnChart({label: 'orders', link: '/sales', url: 'api/dashboard/orders', range: this.getRange()});
    this.salesChart = new ColumnChart({label: 'sales', url: 'api/dashboard/sales', range: this.getRange()});
    this.customersChart = new ColumnChart({label: 'customers', url: 'api/dashboard/customers', range: this.getRange()});

    this.sortableTable = new SortableTable(
      this.getHeadersConfig(), { url: this.getUrl(this.getRange().from, this.getRange().to),
        sorted: {id: this.getHeadersConfig().find(item => item.sortable).id, order: 'asc'},
        isSortLocally: this.getHeadersConfig().find(item => item.sortable).sortable
      },
    );

    this.rangePicker = new RangePicker(this.getRange());

    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();

    this.initEventListeners();
  }

  async update(newDate) {
    this.ordersChart.update(newDate.from, newDate.to);
    this.salesChart.update(newDate.from, newDate.to);
    this.customersChart.update(newDate.from, newDate.to);

    const data = await fetchJson(this.getUrl(newDate.from, newDate.to));
    this.sortableTable.renderRows(data);
  }

  getHeadersConfig() {
    return header;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  render() {
    this.appendElements();
    return this.element;
  }

  createElement(template) {
    const element = document.createElement(`div`);
    element.innerHTML = template;
    return element.firstElementChild;
  }

  appendElements() {
    this.subElements.ordersChart.append(this.ordersChart.element);
    this.subElements.salesChart.append(this.salesChart.element);
    this.subElements.customersChart.append(this.customersChart.element);
    this.subElements.sortableTable.append(this.sortableTable.element);
    this.subElements.rangePicker.append(this.rangePicker.element);
  }

  createTemplate() {
    return `
    <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <div data-element="ordersChart" class="dashboard__chart_orders">
        
        </div>
        <div data-element="salesChart" class="dashboard__chart_sales">
  
        </div>
        <div data-element="customersChart" class="dashboard__chart_customers">
      
        </div>
      </div>

      <h3 class="block-title">Best sellers</h3>

      <div data-element="sortableTable">

      </div>
    </div>`;
  }

  initEventListeners() {
    this.subElements.rangePicker.addEventListener('click', this.handleSelectorClick);
  }
  
  handleSelectorClick = (event) => {

    if (!event.target.classList.contains('rangepicker__cell')) {
      return;
    }

    const { value } = event.target.dataset;

    if (value) {
      const dateValue = new Date(value);
      if (this.selectingFrom) {
        this.selected = {
          from: dateValue,
          to: null
        };
        this.selectingFrom = false;
      } else {
        if (dateValue > this.selected.from) {
          this.selected.to = dateValue;
        } else {
          this.selected.to = this.selected.from;
          this.selected.from = dateValue;
        }
        this.selectingFrom = true;
      }

      if (this.selected.from && this.selected.to) {
        this.update(this.selected);
      }
    }
  }

  formatDate(date) {
    return date.toLocaleString('ru', {dateStyle: 'short'});
  }

  getRange = () => {
    const now = new Date();
    const to = new Date();
    const from = new Date(now.setMonth(now.getMonth() - 1));
    return { from, to };
  }

  getUrl(from, to) {
    const url = new URL("api/dashboard/bestsellers", BACKEND_URL);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);
    return url;
  }

  remove() {
    this.subElements.rangePicker.addEventListener('click', event => this.handleSelectorClick(event));
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
