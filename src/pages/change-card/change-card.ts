import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ViewController,LoadingController, AlertController, Platform } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"

import { HomePage } from "../home/home";

import { Stripe } from "@ionic-native/stripe"

import { SplitPaneProvider } from "../../providers/split-pane/split-pane";


/**
 * Generated class for the ChangeCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-card',
  templateUrl: 'change-card.html',
})
export class ChangeCardPage {

  @ViewChild(Navbar) navBar: Navbar;
  
  card = {
    cardno:"",
    cardcvv:"",
    cardmonth:0,
    cardyear:0
  }

  email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, public db: AngularFireDatabase,private storage: Storage,
    public alertCtrl: AlertController,private stripe: Stripe, public splitPane: SplitPaneProvider,
    public platform: Platform) 
  {

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

  closeModal(){
    this.viewCtrl.dismiss()
  }

  dismiss() {
   
  }

  updateCreditCard(){

    let loading = this.loadingCtrl.create({
      content: "Updating...Please wait",
    })
    loading.present()

    this.storage.get("currentEmail").then((val)=>{
        
      this.stripe.setPublishableKey("pk_test_0KMxtsbXPks01fPYCs3etMqW")

      this.stripe.createCardToken({
        number: this.card.cardno,
        expMonth: this.card.cardmonth,
        expYear: this.card.cardyear,
        cvc: this.card.cardcvv
      })
      .then(token=>{

          this.email = val

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
                  card_last4: token.card.last4,
                  card_exp_month: token.card.exp_month,
                  card_exp_year: token.card.exp_year,
                  card_id: token.card["id"],
                  card_brand: token.card.brand,
                  token_id: token.id,
                })
                loading.dismiss();

            });
          });
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: 'Credit Card Updated Successfully',
            buttons: ['OK']
          })
          alert.present()

      })
      .catch(error=>{
        console.log(error)
        this.alertCtrl.create({
          title:"Error",
          subTitle:"Error Updating Credit Card...Please try again",
          buttons: ['OK']
        }).present();
  
        loading.dismiss();
      })

      

    })

  }

}
