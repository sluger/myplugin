import {AView} from 'tdp_core/src/views/AView';
import * as moment from 'moment';

export default class HelloWorldView extends AView {

 protected initImpl() {
   super.initImpl();
   return this.build();
 }

 protected selectionChanged() {
   super.selectionChanged();
   this.build();
 }

 private build() {
   const time = moment().format('MMMM Do YYYY, h:mm:ss a');

   return this.resolveSelection().then((names) => {
     this.node.innerHTML = `current selection:
     <ul>
       ${names.map((name) => `<li>${name}</li>`).join('')}
     </ul>

     current time: ${time}`;
   });
 }
}