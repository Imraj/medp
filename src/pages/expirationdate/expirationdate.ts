import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams, LoadingController, ToastController, AlertController, Platform } from 'ionic-angular';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { ContactPage } from "../contact/contact"

import { HomePage } from "../home/home";

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
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

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

  @ViewChild(Navbar) navBar: Navbar;

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
  public types: any[] = [];

  public inputBrand: string = '';
  public inputType: string = '';

  public sugBrands : string[] = []
  public sugTypes : string[] = []

  private list: string[] = [];
  public input: string = '';
  public countries: string[] = [];

  expBtnCssClass : string;
  expResCssClass : string;

  order: string = "name"
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,private db: AngularFireDatabase,public storage: Storage,
              public alertCtrl: AlertController,private keyboard: Keyboard, public splitPane: SplitPaneProvider,
              public platform: Platform) 
  {
      this.medTypes = db.list("medtype",ref => ref.orderByChild('medname')).valueChanges()
      //db.list('/items', ref => ref.orderByChild('size').equalTo('large'))

      db.list("medtype",ref => ref.orderByChild('medname')).valueChanges()
        .subscribe((snapshot)=>{
          snapshot.forEach(element => {
            const mObject = <any>element
            this.types.push(
              {"name": mObject.medname}
            )
          })
          
        })
      this.medications = db.list("medications").valueChanges()
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
  

  calcExpirationDate(){
    this.expBtnCssClass = "animated rubberBand"

    if(this.expdate.medtype == "" || this.expdate.meddate == "" || this.expdate.medbrand == ""
    || this.expdate.medtype == null || this.expdate.meddate == null || this.expdate.medbrand == null)
    {
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: "All fields are required",
        buttons: ['Ok']
      })
      setTimeout(function(){
        alert.present()
      },500)
     
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
              //console.log("Exp-Data-web2",data,data.length)
              for(let i=0;i<data.length;i++){
                let d = data[i];
                //console.log(typeof d["medType"], typeof String(f_medtype) )
                //console.log(d["medType"] == String(f_medtype) )
                if(d["medBrand"] == f_medbrand) {
                  app.extraDays = parseInt(d["medDate"])

                  if(app.extraDays < 0){
                    app.resNote = d["medNote"]
                    this.notShowRes = true
                  }else{
                    let rDate = new Date(app.expdate.meddate)
                    //new Date(openYear+"-"+openMonth+"-"+openDay);
                    rDate.setDate(rDate.getDate() + app.extraDays)
                    
                    //console.log("rDate",rDate)
                    app.resDate = rDate
                    //console.log("resDate",app.resDate)
                    app.resNote = d["medNote"]
                    this.showRes = true
                    this.expResCssClass = "animated tada"
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
         //console.log("medtype",this.expdate.medtype)
         if(mObject.medType == $event){
            this.list.push(mObject.medBrand)
         }         
      })
      
  })

  }

}
