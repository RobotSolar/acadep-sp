import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../models/event';
// import { Action } from 'rxjs/internal/scheduler/Action';

import * as moment from 'moment';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventsCollection: AngularFirestoreCollection<Event>;
  events: Observable<Event[]>;
  eventDoc: Event;

  public nameEvent: string;
  constructor(public db: AngularFirestore) { }

  getEvents() {
    this.eventsCollection = this.db.collection('events', ref => ref.where('deleted', '==', '').orderBy("start", "desc"));
    this.events = this.eventsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.events;
  }

  addEvent(event: Event) {
    this.nameEvent = event.title;
    return new Promise((resolve, reject) => {
      this.db.collection('events').add({
        active: true,
        activity_id: event.activity_id,
        user_id: event.user_id,
        type_activity: event.type,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        tools: event.tools,
        staff: event.staff,
        deleted: '',
        status: 1,
        advanced : 0,
        total : event.total
      }).then((res: any) => {
        this.db.collection('events').doc(res.id).update({
          id: res.id
        }).then(async res => {
          //notificacion push
          // $.ajax({
          //   data: {
          //     "app_id": "d7d8b147-ad7c-48f6-be54-a1b9c423d4c5",
          //     "included_segments": ["All"],
          //     "headings": { "es": "📆 Nuevo evento", "en": "📆 Nuevo evento" },
          //     "contents": { "es": this.nameEvent, "en": this.nameEvent }
          //   },
          //   url: 'https://onesignal.com/api/v1/notifications',
          //   type: 'post',
          //   beforeSend: function (xhr) {
          //     xhr.setRequestHeader("Authorization", "Basic NTc5YzY4MWItMmU2ZC00MzhjLWI2MzQtM2RlMmUxMTM3ZTYz");
          //     xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
          //   },
          //   success: function (res) {
          //     console.log(res);
          //   }
          // })
        })
        resolve(res)
      }, err => reject(err));
    })
  }

  deleteEvent(key: string) {

    return new Promise((resolve, reject) => {
    
      this.db.collection('events').doc(key).update({
        deleted : new Date().toJSON().substr(0, 16)
      }).then((res:any) => resolve(res)).catch(err => reject(err))
    })

  }

  updateEvent(event: Event) {
    return new Promise((resolve, reject) => {
      this.db.collection('events').doc(event.id).update({
        active: true,
        activity_id: event.activity_id,
        user_id: event.user_id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        tools: event.tools,
        staff: event.staff,
        status: event.status
      }).then((res: any) => resolve(res), err => reject(err));
    })
  }


  getEventById(id){

    return new Promise((resolve, reject) => {
      this.db.collection('events').doc(id).ref.get()
        .then(res => resolve(res.data()),
          err => reject(err));
    });
  }

  ImportEvent(name: string, unit:string, number:number, id_act : string, user_mail:string) {

    let start = moment().format('Y-MM-DDThh:mm');
    let end = moment().add(1, 'minute').format('Y-MM-DDThh:mm');
    return new Promise((resolve, reject) => {
      this.db.collection('events').add({
        active: true,
        activity_id: id_act,
        user_id: 'undefined',
        type_activity: 'default',
        title: name,
        description: '',
        start: start,
        user_mail : user_mail,
        end: end,
        tools: [],
        staff: [],
        deleted: '',
        status: 1,
        advanced : 0,
        total : {
          unit: unit,
          number : number
        }
      }).then((res: any) => {
        this.db.collection('events').doc(res.id).update({
          id: res.id
        }).then(updated => {

          resolve(res)
        })
      }, err => reject(err));
    })
  }

  getEventsUndefined2(){
    this.eventsCollection = this.db.collection('events', ref => ref
    .where('deleted', '==', '')
    .where('user_id', '==', 'undefined')
    .limit(10));

    this.events = this.eventsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.events;
  }

  getEventsUndefined(){
    this.eventsCollection = this.db.collection('events', ref => ref
    .where('deleted', '==', '')
    .where('user_id', '==', 'undefined'));

    this.events = this.eventsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.events;
  }

}


