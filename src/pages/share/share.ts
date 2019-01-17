import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { EmailComposer } from '@ionic-native/email-composer';

import { HTTP } from '@ionic-native/http';
import { Storage } from "@ionic/storage"

/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

  share = {
    email1:"",
    email2:"",
    email3:"",
    message: ""
  }


  email : string
  constructor(public navCtrl: NavController, public navParams: NavParams,private emailComposer: EmailComposer,
              private http: HTTP,private toastCtrl: ToastController,private storage: Storage) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
  }

  navToExpirationdate(){
    this.navCtrl.push(ExpirationdatePage)
  }

  navToRecall(){
    this.navCtrl.push(RecallPage)
  }

  navToInsulin(){
    this.navCtrl.push(InsulinguidePage)
  }

  shareWithContacts(){

    let email1 = this.share.email1
    let email2 = this.share.email2
    let email3 = this.share.email3
    let body = this.share.message

    let email = {
      to: email1,
      cc: email2,
      bcc:[email3],
      subject:"MedExp",
      body: body,
    }    
    //this.emailComposer.open(email)

    this.storage.get("currentEmail").then((val)=>{
        this.email = val

        this.http.get("https://medexp.000webhostapp.com/share.php",{from:val, email1: email1,
          email2:email2, email3:email3, subject:email.subject, message:email.body},{})
              .then(data=>{
                  console.log(data)
                  const toast = this.toastCtrl.create({
                    message:"Message Sent Successfully",
                    duration:5000
                  })
                  toast.present()
              })
              .catch(error=>{
                  console.log(error)
              })

    })

    

  }

}
