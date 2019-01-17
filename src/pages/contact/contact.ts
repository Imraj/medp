import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { EmailComposer } from '@ionic-native/email-composer';

import { HTTP } from '@ionic-native/http';
import { Storage } from "@ionic/storage"

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  contact = {
    type:"",
    subject:"",
    message:"",
  }

  email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private toastCtrl: ToastController,
      private emailComposer: EmailComposer, private http: HTTP,private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
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

  submitFeedback(){
    let email = {
      to: "admin@medexpiration.com",
      subject: this.contact.type + ":" + this.contact.subject,
      body:this.contact.message,
      type: this.contact.type
    }    
    

    this.storage.get("currentEmail").then((val)=>{

      this.email = val

      this.http.get('https://medexp.000webhostapp.com/contact.php', {subject:email.subject,message:email.body,type:email.type,from:val}, {})
        .then(data => {

          console.log("Getting Data")
          console.log(data.status);
          console.log(data.data);
          console.log(data.headers);

          const toast = this.toastCtrl.create({
            message:"Message Sent Successfully",
            duration:5000
          })
          toast.present()

        })
        .catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });

    })

  }

}
