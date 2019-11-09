import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Record } from '../interfaces/record';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private recordCollection: AngularFirestoreCollection<Record>;

  constructor(private afs: AngularFirestore) {
    this.recordCollection = this.afs.collection<Record>('Record');
   }

   getRecords() {
    return this.recordCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  addRecord(record: Record) {
    return this.recordCollection.add(record);
  }

}
