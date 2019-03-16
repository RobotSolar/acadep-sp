import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  evidenceCollection: AngularFirestoreCollection<any>;
  evidence: Observable<any[]>;
  evidenceDoc: AngularFirestoreDocument;
  constructor(public db: AngularFirestore) { }

  getEvidence() {
    this.evidenceCollection = this.db.collection('evidence', ref => ref.orderBy('created_at', 'desc'));
    this.evidence = this.evidenceCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.evidence;
  }


  getNotifications() {
    this.evidenceCollection = this.db.collection('evidence', ref => ref.orderBy('created_at', 'desc').limit(10));

    this.evidence = this.evidenceCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.evidence;
  }

  getUnreadEvidence() {
    this.evidenceCollection = this.db.collection('evidence', ref => ref.where('read', '==', false));
    return this.evidenceCollection.snapshotChanges();
  }

  readNotification(id:string){

    return new Promise((resolve, reject) => {

      this.db.collection('evidence').doc(id).update({
        read : true
      }).then( res => {
        resolve('done')
      }).catch(err => reject(err))

      
    })

  }

  getEvidenceByEvent(id) {
    this.evidenceCollection = this.db.collection('evidence', ref => ref.where('ref_event.id', '==', id).orderBy('created_at', 'desc'));
    this.evidence = this.evidenceCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    // console.log(this.evidence)
    return this.evidence;
  }

  searchEvidence(idEvent, idUser) {
    // var ref = this.db.collection('evidence');


    if (idEvent != "" && idUser != "") {
      this.evidenceCollection = this.db.collection('evidence', ref => ref.where('user_id', '==', idUser).where('ref_event.id', '==', idEvent));
      this.evidence = this.evidenceCollection.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    } else if (idUser != "") {
      this.evidenceCollection = this.db.collection('evidence', ref => ref.where('user_id', '==', idUser));
      this.evidence = this.evidenceCollection.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    } else if (idEvent != "") {

      this.evidenceCollection = this.db.collection('evidence', ref => ref.where('ref_event.id', '==', idEvent));
      this.evidence = this.evidenceCollection.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data;
        });
      }));

    }

    // console.log(this.evidence)
    return this.evidence;
  }

  // getEvidenceById(id:string){
  //   this.evidenceDoc = this.db.collection('events').doc(id);
  //   return this.evidenceDoc.snapshotChanges();
  // }

}
