import { Injectable } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { activity } from "../models/activity";
// import { project } from '../models/project';
// import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  activitiesCollection: AngularFirestoreCollection<activity>;
  activities: Observable<activity[]>;
  activityDoc: activity;


  constructor(private db: AngularFirestore) {
 
  }

  getActivities() {

    this.activitiesCollection = this.db.collection('activities', ref => ref.where('deleted', '==', ''));
    this.activities = this.activitiesCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as activity;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    return this.activities;

  }

  getActivity(id: string) {
    return new Promise((resolve, reject) => {
      this.db.collection('activities').doc(id).ref.get()
        .then(res => resolve(res.data()),
          err => reject(err));
    });
  }

  addActivity(activity: activity) {
    return new Promise((resolve, reject) => {
      this.db.collection('activities').add({

        title: activity.title,
        description: activity.description,
        subproject: activity.subproject,
        project_id : activity.project_id,
        start: activity.start,
        end: activity.end,
        insumos : activity.insumos,
        users : activity.users,
        deleted : '',
      }).then((res: any) => resolve(res), err => reject(err));
    })

  }

  ImportActivity(name:string, project_id:string, subproject: string) {
    return new Promise((resolve, reject) => {
      this.db.collection('activities').add({
        title: name,
        description: '',
        subproject: subproject,
        project_id : project_id,
        start: new Date().toJSON().substr(0, 16),
        end: new Date().toJSON().substr(0, 16),
        insumos : [],
        users : [],
        deleted : '',
      }).then((res: any) => resolve(res), err => reject(err));
    })

  }



  updateActivity(activity: activity)
  {
    return new Promise ((resolve, reject) => {
      this.db.collection('activities').doc(activity.id).update({
        title: activity.title,
        description: activity.description,
        subproject: activity.subproject,
        project_id : activity.project_id,
        start: activity.start,
        end: activity.end,
        insumos : activity.insumos,
      }).then((res:any) => resolve(res), err => reject(err));
    })


    
  }

  // deleteActivity(key:string)
  // {

  //   return new Promise((resolve, reject) => {
  //     this.activitiesList.update(key, {active : false})
  //       .then(res => resolve(key),
  //         err => reject(err));
  //   });

  // }

}
