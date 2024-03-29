import { Component, ViewChild } from '@angular/core';
import { Platform, Navbar, IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { ChangeCardPage } from '../change-card/change-card';
import { Stripe } from "@ionic-native/stripe"
import * as firebase from 'firebase/app';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"

import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

import { HomePage } from "../home/home";
@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {

  @ViewChild(Navbar) navBar: Navbar;

  subscribe = {
    cardno : "",
    cardyear:0,
    cardmonth:0,
    cardcvv: ""
  }
  email: string
  subscribed: boolean
  subscribed_date : string

  card_brand: string;
  card_last4: string;
  card_exp_month: string;
  card_exp_year: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,private stripe: Stripe,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController,
              public http: HttpClient, public db: AngularFireDatabase,private storage: Storage,
              public toastCtrl : ToastController,public modalCtrl: ModalController,
              public splitPane: SplitPaneProvider, public platform: Platform) {
                var app = this
                this.storage.get("currentEmail").then((val)=>{
                  this.email = val
                  
                  const profile = this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.email))
                  .snapshotChanges()
                  .subscribe(item => {
                    item.forEach(element=>{
                      var y = element.payload.toJSON();
                      y["key"] = element.key
                      this.subscribed = y["subscribed"]

                      this.card_brand = y["card_brand"]
                      this.card_last4 = y["card_last4"]
                      this.card_exp_month = y["card_exp_month"]
                      this.card_exp_year = y["card_exp_year"]

                    })
                  });

                })
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

  changeCreditCard(){
    let changeCardModal = this.modalCtrl.create(ChangeCardPage, { userId: 8675309 });
    changeCardModal.present();
  }

  subscribeUser(){
    let cardno = this.subscribe.cardno
    let cardcvv = this.subscribe.cardcvv
    let cardmonth = this.subscribe.cardmonth
    let cardyear = this.subscribe.cardyear

    if(cardno == "" || cardno == null || cardcvv == "" || cardcvv == "" || cardmonth == 0 ||
       cardmonth == null || cardyear == 0 || cardyear == null)
    {
      let toast = this.toastCtrl.create({
        message : "All the fields are required",
        duration : 5000
      })
      toast.present()
    }
    else
    {
      this.storage.get("currentEmail").then((val)=>{
        
          this.email = val
          // if user's subscription info is not already provided, Store the details
        
      })

      let loading = this.loadingCtrl.create({
        content: "Processing...Please wait",
      })
      loading.present()
  
      this.stripe.setPublishableKey("pk_test_0KMxtsbXPks01fPYCs3etMqW")

      this.stripe.createCardToken({
        number: cardno,
        expMonth: cardmonth,
        expYear: cardyear,
        cvc: cardcvv
      })
      .then(token=>{
        /*console.log("Token")
        console.log(token.card)*/
  
        const body = JSON.stringify({stripetoken: token.id});
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
  
        this.http.post("https://medexp-payment.herokuapp.com/processpay",body,httpOptions)
        .subscribe(res=>{
          
            loading.dismiss()
            if(res["success"])
            {
              
              this.http.post("https://www.medexpiration.com/mail.php",
                JSON.stringify({email : this.email}),httpOptions
              )
  
              const profile = this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.email))
              .snapshotChanges()
              .map(changes=>{
                return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
              })
              .subscribe(snapshots => {
                snapshots.forEach(snapshot => {
  
                    var today = new Date()
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime = date+' '+time;

                    this.db.list("profiles").update(snapshot.key,{
                        subscribed: true,
                        card_last4: token.card.last4,
                        card_exp_month: token.card.exp_month,
                        card_exp_year: token.card.exp_year,
                        card_id: token.card["id"],
                        card_brand: token.card.brand,
                        token_id: token.id,
                        subscribed_date: dateTime
                    })
                    loading.dismiss();
  
                });
              });
              let alert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Subscription successful',
                buttons: ['OK']
              })
              alert.present()
            }
            else{
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Please try again later',
                buttons: ['OK']
              })
              alert.present()
            }
        },err=>{
            //console.log("Payment-Err",err)
            loading.dismiss()
        })
      })
      .catch(error=>{
        //console.log(error)
        this.alertCtrl.create({
          title:"Error",
          subTitle:"Error Completing transaction...Please try again",
          buttons: ['OK']
        }).present();
  
        loading.dismiss();
      })

    }

    
    
    
   


  }

}
