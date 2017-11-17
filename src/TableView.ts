import {AView} from 'tdp_core/src/views/AView';

const someData = [
  ['twitter', 'facebook'],
  ['google', 'reddit-alien', 'slack'],
  ['youtube'],
  ['paypal', 'pinterest', 'lastfm', 'medium', 'skype'],
  ['amazon', 'android', 'spotify'],
];

export default class TableView extends AView {

  protected initImpl() {
    super.initImpl();
    return this.build();
  }

  private build() {
    this.node.innerHTML = `<div class="tv-flex-table">`;

    const table = this.node.querySelector('.tv-flex-table');
    let i = 0;
    for (let col of someData) {
      table.innerHTML += `
      <ul class="tv-col">
        <li class="tv-col-heading"><h1>${i}</h1></li>
        ${col.map((c) => `<li class="tv-col-cell"><i class="fa fa-2x fa-${c}"></i></li>`).join('')}
      </ul>`;
      i++;
    }

    return null;
  }
}
