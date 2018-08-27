import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { Stripe } from "@ionic-native/stripe"

//import { Headers,Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,private stripe: Stripe,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController,
              public http: HttpClient, public db: AngularFireDatabase,private storage: Storage) {

                this.storage.get("currentEmail").then((val)=>{

                  this.email = val
                  console.log("this.email",this.email)

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

  subscribeUser(){
    let cardno = this.subscribe.cardno
    let cardcvv = this.subscribe.cardcvv
    let cardmonth = this.subscribe.cardmonth
    let cardyear = this.subscribe.cardyear

    let loading = this.loadingCtrl.create({
      content: "Processing...Please wait",
    })
    loading.present()

    this.stripe.setPublishableKey("pk_test_LFo0YaVcnQ2PpM5EAibqhEWJ")
    
    this.stripe.createCardToken({
      number: cardno,
      expMonth: cardmonth,
      expYear: cardyear,
      cvc: cardcvv
    })
    .then(token=>{
      console.log(token)
      console.log("token.id",token.id)
      this.http.post("https://medpayment.herokuapp.com/processpay",{stripetoken:token.id})
      .subscribe(res=>{
          console.log("Payment-Resp-2",res)
          loading.dismiss()
          if(res){
            
            this.http.post("https://medexp.000webhostapp.com/mail.php",{
              email: this.email
            })

            const profile = this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.email))
            .snapshotChanges()
            .map(changes=>{
              return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            })
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
              console.log('Snapshot Key: ', snapshot.key);
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
