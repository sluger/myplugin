import {ARankingView, categoricalCol, numberCol, stringCol, single} from 'tdp_core/src/lineup';
import {getTDPData, getTDPDesc, getTDPScore, IServerColumn} from 'tdp_core/src/rest';
import {resolve} from 'phovea_core/src/idtype';

export default class HelloRankingView extends ARankingView {

 /**
  * determines the IDType of the represented item rows
  * @returns {IDType}
  */
 get itemIDType() {
   return resolve('IDTypeB');
 }

 protected loadColumnDesc() {
   return getTDPDesc('dummy', 'b');
 }

 protected loadRows() {
   return getTDPData('dummy', 'b');
 }

 protected getColumnDescs(columns: IServerColumn[]) {
   const findColumn = (column: string) => columns.find((c) => c.column === column);

   return [
     stringCol('b_name', {label: 'Name'}),
     categoricalCol('b_cat1', findColumn('b_cat1').categories, {label: 'Category'}),
     numberCol('b_real', 0, 1, {label: 'Real'})
   ];
 }

 createSelectionAdapter() {
  return single({
    createDesc: (_id, id) => numberCol(`col_${_id}`, 0, 1, {label: id}),
    loadData: (_id, id) => getTDPScore<number>('dummy', 'b_single_score',
                                              {attribute: 'ab_real', name: id}, {})
  });
}
}