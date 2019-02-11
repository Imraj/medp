import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, AlertController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';

import { Storage } from "@ionic/storage"

import { SubscriptionPage } from '../subscription/subscription';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

import { CompleterService, CompleterData } from 'ng2-completer';

import { Keyboard } from 'ionic-angular';



/**
 * Generated class for the InsulinguidePage page
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { IonicSelectableComponent } from 'ionic-selectable';

class Brand {
  public name: string;
}

class Generic {
  public name: string;
}

@IonicPage()
@Component({
  selector: 'page-insulinguide',
  templateUrl: 'insulinguide.html',
})
export class InsulinguidePage {

  showRes = false
  notShowRes = false
  resDate = new Date();
  resNote: string = "";
  extraDays = 0

  insulinGuide: any
  currentEmail : string

  ins = {
    brand: "",
    date: ""
  }

  public brands: string[] = [];

  private list: string[] = [];
  public input: string = '';
  public countries: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public db: AngularFireDatabase,public storage: Storage, public alertCtrl: AlertController,
              private completerService: CompleterService,private keyboard: Keyboard) 
  {
    var app = this

    db.list("insulinguides").valueChanges()
    .subscribe((snapshot)=>{
      snapshot.forEach(element => {
         const mObject = <any>element
         this.list.push( mObject.brand )
      })
    })

    this.storage.get("subscribed").then((val)=>{
      if(val == false){
         app.navCtrl.pop()
         app.navCtrl.push(SubscriptionPage)
      }
    })

    this.insulinGuide = db.list("/insulinguides").valueChanges() 

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad InsulinguidePage');
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

  calcInsulin(){

    var app = this
    let loader = this.loadingCtrl.create({
      content:"Processing...",
      duration: 5000
    });
    loader.present();

    let f_brand = this.ins.brand
    let f_date = this.ins.date


    if(this.ins.brand == "" ||  this.ins.date == ""
    || this.ins.brand == null ||  this.ins.date == null )
    {
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: "All fields are required",
        buttons: ['Ok']
      })
      alert.present()
    }
    else{
    
      let f_brand = this.ins.brand
      let f_date = this.ins.date

      this.db.list("/insulinguides",ref=>ref.orderByChild("brand").equalTo(f_brand))
          .valueChanges()
          .subscribe(data=>{
            
              loader.dismiss()
              
              for(let i=0;i<data.length;i++){
                let d = data[i];
                //console.log("d-res",d)
                app.extraDays = parseInt(d["date"])
                
                if(app.extraDays < 0){
                    
                  app.resNote = d["note"]
                  app.showRes = true

                }else{
                  let rDate = new Date(app.ins.date);
                  rDate.setDate(rDate.getDate() + app.extraDays)
                  //console.log("rDate",rDate)
                  app.resDate = rDate
                  app.resNote = d["note"]
                  //console.log("d[note]",d["note"])
                  app.showRes = true
                }
                
                
              } 
          })

    }
    
  }

  add(item: string) {
    this.input = item;
    this.countries = [];
    this.ins.brand = this.input
  }

  removeFocus() {
    this.keyboard.close();
  }

  search() {
    if (!this.input.trim().length || !this.keyboard.isOpen()) {
      this.countries = [];
      return;
    }
    
    this.countries = this.list.filter(item => item.toUpperCase().startsWith(this.input.toUpperCase()));
  }

}
