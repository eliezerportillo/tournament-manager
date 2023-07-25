import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';



interface Item {

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  
  
  
  listRef: AngularFirestoreCollection<Item[]>;



  constructor(private db: AngularFirestore) {

    this.listRef = db.collection<Item[]>('items');
  }
}

