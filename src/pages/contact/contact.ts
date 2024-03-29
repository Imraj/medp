import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams, ToastController,LoadingController, Platform } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { EmailComposer } from '@ionic-native/email-composer';

import { HomePage } from "../home/home";
//import { HTTP } from '@ionic-native/http';
import { Storage } from "@ionic/storage"
import { HttpClient } from '@angular/common/http'
import { HttpParams } from "@angular/common/http"

import { SplitPaneProvider } from "../../providers/split-pane/split-pane";

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

  @ViewChild(Navbar) navBar: Navbar;

  contact = {
    type:"",
    subject:"",
    message:"",
  }

  email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private toastCtrl: ToastController, public loadingCtrl: LoadingController,
      private emailComposer: EmailComposer, private http: HttpClient,private storage: Storage,
      public splitPane: SplitPaneProvider, public platform: Platform) {
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => { 
      let pages = [
        {
          page: HomePage
        }
      ];
      this.navCtrl.setPages(pages);
    }
  }

  ionViewWillEnter() {  
    if(this.platform.width() > 700){
      this.splitPane.splitPaneState = true;
    }   
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
      message:this.contact.message,
      type: this.contact.type
    }    
    
    //console.log("let-email",email)

    let loader = this.loadingCtrl.create({
      content:"Sending...",
    });
    loader.present();

    this.storage.get("currentEmail").then((val)=>{

      this.email = val

      const params = new HttpParams().set("type",email.type).set("subject",email.subject)
                                     .set("message",email.message).set("from",this.email)

      //https://medexp.000webhostapp.com/contact.php
      this.http.get('https://medexp.000webhostapp.com/contact.php', {params})
          .subscribe(data => {
            const toast = this.toastCtrl.create({
              message:"Message Sent Successfully",
              duration:5000
            })
            toast.present()
            loader.dismiss()

        },error=>{
            loader.dismiss()
            const toast = this.toastCtrl.create({
              message:"Error Sending Message",
              duration:5000
            })
            toast.present()

        });

    })

  }

}
