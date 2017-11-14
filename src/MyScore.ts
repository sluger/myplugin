import {IScore, IScoreRow} from 'tdp_core/src/extensions';
import {resolve} from 'phovea_core/src/idtype';
import {numberCol} from 'tdp_core/src/lineup';
import {nameLookupDesc, FormDialog} from 'tdp_core/src/form';
import {getTDPScore} from 'tdp_core/src/rest';

/**
* interface describing the parameter needed for MyScore
*/
export interface IMyScoreParam {
 /**
  * a selection of an valid MyIDType id identified by its id and a textual representation
  */
 my: { text: string, id: string };
}

/**
* score implementation in this case a numeric score is computed
*/
export default class MyScore implements IScore<number> {

 /**
  * defines the IDType of which score values are returned. A score row is a pair of id and its score, e.g. {id: 'EGFR', score: 100}
  * @type {IDType}
  */
 readonly idType = resolve('IDTypeA');

 constructor(private readonly params: IMyScoreParam) {

 }

 /**
  * creates the column description used within LineUp to create the oclumn
  * @returns {IAdditionalColumnDesc}
  */
 createDesc() {
   const label = `MyScore of ${this.params.my.text}`;
   return numberCol('', 0, 100, {label});
 }

 /**
  * computes the actual scores and returns a Promise of IScoreRow rows
  * @returns {Promise<IScoreRow<number>[]>}
  */
 compute(): Promise<IScoreRow<number>[]> {
   return getTDPScore('mydb', `mytable_single_score`, {
     my_id: this.params.my.id
   });
 }
}

/**
* builder function for building the parameters of the MyScore
* @returns {Promise<IMyScoreParam>} a promise for the parameter
*/
export function create() {
 /**
  * a formDialog is a modal dialog showing a form to the user. The first argumen is the dialog title, the second the label of the submit button
  * @type {FormDialog}
  */
 const dialog = new FormDialog('Add my score', 'Add');

 const FORM_ID = 'my';
 /**
  * adds another field to this diallog. In the MyScore example a name lookup of valid my_id entries.
  */
 dialog.append(nameLookupDesc('mydb', 'mytable', {formID: FORM_ID, label: 'Choose an entry'}));

 return dialog.showAsPromise((r) => {
   // retrieve the entered values, each one identified by its formID
   const data = r.getElementValues();
   return <IMyScoreParam>{
     my: data[FORM_ID]
   };
 });
}