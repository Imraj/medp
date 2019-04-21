import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController, Platform, Navbar } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { EmailComposer } from '@ionic-native/email-composer';

import { HTTP } from '@ionic-native/http';
import { Storage } from "@ionic/storage"

import { HttpClient } from "@angular/common/http";
import { HttpParams } from "@angular/common/http"
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

import { HomePage } from "../home/home";
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

  fullname: string;

  @ViewChild(Navbar) navBar: Navbar;

  email : string
  constructor(public navCtrl: NavController, public navParams: NavParams,private emailComposer: EmailComposer,
              private http: HttpClient,private toastCtrl: ToastController,private storage: Storage,
              private loadingCtrl: LoadingController, public splitPane: SplitPaneProvider,
              public platform: Platform) {

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

  shareWithContacts(){

    let email1 = this.share.email1
    let email2 = this.share.email2
    let email3 = this.share.email3
    let message = this.share.message

    let loader = this.loadingCtrl.create({
      content:"Sending...",
    });
    loader.present();

    
    

    this.storage.get("currentEmail").then((val)=>{
        this.email = val

        this.storage.get("fullname").then((val)=>{
          console.log("val-fullname",val)
          this.fullname = val

          const params = new HttpParams().set("email1",email1)
                            .set("email2",email2)
                            .set("message",message)
                            .set("email3",email3)
                            .set("from",this.email)
                            .set("first_name",this.fullname.split(" ")[0])
          console.log(this.fullname.split(" ")[0])
          //http://medexp.000webhostapp.com/share.php
          this.http.get("http://www.medexpiration.com/share.php",{params})
          .subscribe(
            data => {
              loader.dismiss()
              const toast = this.toastCtrl.create({
                message:"Message Sent Successfully",
                duration:5000
              })
              toast.present()

            },
            error => {
                loader.dismiss()
                //console.log(error)
                const toast = this.toastCtrl.create({
                  message:"Error Sending Message",
                  duration:5000
                })
                toast.present()
            }
          )

        })

    })

    

  }

}
