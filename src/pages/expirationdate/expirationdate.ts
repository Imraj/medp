import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { ContactPage } from "../contact/contact"

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { Storage } from "@ionic/storage"

import { Observable } from 'rxjs';

import { SubscriptionPage } from '../subscription/subscription';

import { IonicSelectableComponent } from 'ionic-selectable';

import { CompleterService, CompleterData } from 'ng2-completer';

import { Keyboard } from 'ionic-angular';

/**
 * Generated class for the ExpirationdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class Brand {
  public brand: string;
}

class Type {
  public name: string;
}

@IonicPage()
@Component({
  selector: 'page-expirationdate',
  templateUrl: 'expirationdate.html',
})
export class ExpirationdatePage {

  showRes = false
  notShowRes = false

  extraDays = 0;
  resDate = new Date();
  resNote: string = "";

  medTypes: Observable<any[]>
  medications: Observable<any[]>

  currentEmail : string

  expdate = {
    medtype: "",
    medbrand: "",
    meddate: ""
  }
  
  public brands: string[] = [];
  public types: string[] = [];

  public inputBrand: string = '';
  public inputType: string = '';

  public sugBrands : string[] = []
  public sugTypes : string[] = []

  private list: string[] = [];
  public input: string = '';
  public countries: string[] = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,private db: AngularFireDatabase,public storage: Storage,
              public alertCtrl: AlertController,private keyboard: Keyboard) 
  {
      this.medTypes = db.list("medtype").valueChanges()


      db.list("medtype").valueChanges()
        .subscribe((snapshot)=>{
          snapshot.forEach(element => {
            const mObject = <any>element
            this.types.push(
              mObject.medname
            )
          })
          
        })

      // db.list("medications").valueChanges()
      //   .subscribe((snapshot)=>{
      //     snapshot.forEach(element => {
      //        const mObject = <any>element

      //        console.log("mObject")
      //        console.log(mObject)
      //        console.log("medtype",this.expdate.medtype)

      //        this.list.push(
      //         mObject.medBrand
      //        )
      //     })
          
      // })

      this.medications = db.list("medications").valueChanges()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpirationdatePage');
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
  

  calcExpirationDate(){
    if(this.expdate.medtype == "" || this.expdate.meddate == "" || this.expdate.medbrand == ""
    || this.expdate.medtype == null || this.expdate.meddate == null || this.expdate.medbrand == null)
    {
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: "All fields are required",
        buttons: ['Ok']
      })
      alert.present()
    }
    else{
      var app = this
      let loader = this.loadingCtrl.create({
          content:"Processing...",
          duration: 5000
      });
      loader.present();
  
      let f_medtype = this.expdate.medtype
      let f_meddate = this.expdate.meddate
      let f_medbrand = this.expdate.medbrand
      console.log("f_medtype",f_medtype)
      this.db.list("/medications",ref=>ref.orderByChild("medType").equalTo(f_medtype))
          .valueChanges()
          .subscribe(data=>{
              
              loader.dismiss()
              console.log("Exp-Data-web2",data,data.length)
              for(let i=0;i<data.length;i++){
                let d = data[i];
                console.log(typeof d["medType"], typeof String(f_medtype) )
                console.log(d["medType"] == String(f_medtype) )
                if(d["medBrand"] == f_medbrand) {
                  app.extraDays = parseInt(d["medDate"])

                  if(app.extraDays < 0){
                    app.resNote = d["medNote"]
                    this.notShowRes = true
                  }else{
                    let rDate = new Date(app.expdate.meddate)//new Date(openYear+"-"+openMonth+"-"+openDay);
                    rDate.setDate(rDate.getDate() + app.extraDays)
                    
                    //console.log("rDate",rDate)
                    app.resDate = rDate
                    console.log("resDate",app.resDate)
                    app.resNote = d["medNote"]
                    this.showRes = true
                  }

                  
                }
                
              } 
          }) 
    }

   

  }

  navToContact(){
     this.navCtrl.push(ContactPage)
  }

  removeFocus() {
    this.keyboard.close();
  }

  addType(item: string) {
    this.inputType = item;
    this.expdate.medtype = this.inputType
    this.sugTypes = [];
  }

  searchType() {
    if (!this.inputType.trim().length || !this.keyboard.isOpen()) {
      this.sugTypes = [];
      return;
    }
    this.sugTypes = this.types.filter(item => item.toUpperCase().startsWith(this.inputType.toUpperCase()));
  }

  add(item: string) {
    this.input = item;
    this.expdate.medbrand = this.input
    this.countries = [];
  }
  search() {
    if (!this.input.trim().length || !this.keyboard.isOpen()) {
      this.countries = [];
      return;
    }
    this.countries = this.list.filter(item => item.toUpperCase().startsWith(this.input.toUpperCase()));
  }

  onChange($event){
    this.list = []
    this.expdate.medbrand = ""
    
    this.db.list("medications").valueChanges()
    .subscribe((snapshot)=>{
      snapshot.forEach(element => {

         const mObject = <any>element
         console.log("medtype",this.expdate.medtype)
         if(mObject.medType == $event){
            this.list.push(mObject.medBrand)
         }         
      })
      
  })

  }

}
