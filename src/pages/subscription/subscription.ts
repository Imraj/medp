import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { Stripe } from "@ionic-native/stripe"
import * as firebase from 'firebase/app';
//import { Headers,Http } from '@angular/http';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {

  subscribe = {
    cardno : "",
    cardyear:0,
    cardmonth:0,
    cardcvv: ""
  }
  email: string
  subscribed: boolean
  subscribed_date : string

  constructor(public navCtrl: NavController, public navParams: NavParams,private stripe: Stripe,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController,
              public http: HttpClient, public db: AngularFireDatabase,private storage: Storage,
              public toastCtrl : ToastController) {
                var app = this
                this.storage.get("currentEmail").then((val)=>{
                  this.email = val
                  this.subscribed = val.subscribed
                  this.subscribed_date = val.subscribed_date

                  this.db.list("/subscription",ref=> ref.orderByChild("email").equalTo(this.email))
                    .valueChanges()
                    .subscribe(data=>{
                        console.log("data[0]",data)
                        app.subscribe.cardno = data[0]["cardno"]
                        app.subscribe.cardyear = data[0]["cardyear"]
                        app.subscribe.cardmonth = data[0]["cardmonth"]
                        app.subscribe.cardcvv = data[0]["cardcvv"]
                    })

                })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionPage');
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

  updateCreditCard(){

    let cardno = this.subscribe.cardno
    let cardcvv = this.subscribe.cardcvv
    let cardmonth = this.subscribe.cardmonth
    let cardyear = this.subscribe.cardyear

    this.db.list("/subscription",ref=> ref.orderByChild("email").equalTo(this.email))
    .snapshotChanges()
    .map(changes=>{
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    })
    .subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        this.db.list("subscription").update(snapshot.key,{
          cardnumber : cardno,
          cardcvv : cardcvv,
          cardmonth : cardmonth,
          cardyear : cardyear,
        })

      });
    });


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
          if( this.db.list("/subscription",ref=> ref.orderByChild("email").equalTo(this.email)) == null ){
            firebase.database().ref('subscription').push({
              cardnumber : cardno,
              cardcvv : cardcvv,
              cardmonth : cardmonth,
              cardyear : cardyear,
              email : this.email
            });
          }
          else{
            // Else if user's subscription info is already provided, Update the details
            this.db.list("/subscription",ref=> ref.orderByChild("email").equalTo(this.email))
                .snapshotChanges()
                .map(changes=>{
                  return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                })
                .subscribe(snapshots => {
                  snapshots.forEach(snapshot => {
                  console.log('Snapshot Key: ', snapshot.key);

                    this.db.list("subscription").update(snapshot.key,{
                      cardnumber : cardno,
                      cardcvv : cardcvv,
                      cardmonth : cardmonth,
                      cardyear : cardyear,
                    })

                  });
                });
          }
        
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
        console.log(token)
        console.log("token.id",token.id)
  
        const body = JSON.stringify({stripetoken: token.id});
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
  
        this.http.post("https://medexp-payment.herokuapp.com/processpay",body,httpOptions)
        .subscribe(res=>{
            console.log("Payment-Resp-2",res)
            console.log("Payment-Success",res["success"])
            loading.dismiss()
            if(res["success"])
            {
              //console.log("email-this",this.email)
              this.http.post("https://medexp.000webhostapp.com/mail.php",
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
            console.log("Payment-Err",err)
            loading.dismiss()
        })
      })
      .catch(error=>{
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
