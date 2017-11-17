import { IResult, ISearchProvider } from 'dTiles/src/extensions';
import { getTDPFilteredRows, getTDPLookup } from 'tdp_core/src/rest';
import './styles/idtype_color.scss';
import { resolve } from 'phovea_core/src/idtype';

export default class MyDBSearchProvider implements ISearchProvider {

  format(item: IResult, node: HTMLElement, mode: 'result' | 'selection', currentSearchQuery: RegExp) {
    
    switch (mode) {
      case 'result':
        if (currentSearchQuery) {
          //highlight match
          return item.text.replace(new RegExp(`(${currentSearchQuery})`, 'im'), '<span class="match">$1</span>');
        }
        return item.text;
      case 'selection': {
        return `<b>${item.text}</b>`;
      }
    }
  }

 search(query: string, page: number, pageSize: number) {
   return getTDPLookup('mydb', `mytable_items`, {
     column: `name`,
     query,
     page: page + 1, //required to start with 1 instead of 0
     limit: pageSize
   });
 }

 validate(query: string[]): Promise<IResult[]> {
   return getTDPFilteredRows('mydb', `mytable_items_verify`, {}, {
     name: query
   });
 }
}
