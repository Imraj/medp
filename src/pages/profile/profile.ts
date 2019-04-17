import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController, Platform, Navbar } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { ForgotpwdPage } from "../forgotpwd/forgotpwd"


import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

import { HomePage } from "../home/home";
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  @ViewChild(Navbar) navBar: Navbar;

  countryList = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
	,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"
  ]

  profile = {
    email: "",
    age:"",
    ethnicity:"",
    occupation:"",
    fullname: "",
    gender:"",
    country:"",
    state:""
  }
  email : string
  newsletter : boolean

  profileAge: string
  profileEmail: string
  profileEthnicity: string
  profileFullname: string 
  profileGender: string
  profileOccupation: string
  profileState: string
  profileCountry: string

  subEmail: string
  subFullname: string

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public afAuth: AngularFireAuth, public db: AngularFireDatabase,
              public storage: Storage,public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,public splitPane: SplitPaneProvider,
              public platform: Platform) 
  { 
    this.newsletter = false
    this.storage.get("currentEmail").then((val)=>{

        this.email = val
        //console.log("this.email",this.email)

        this.profile.email = val

        const profile = db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.email)).valueChanges()
        profile.subscribe(data => {
          /*console.log("Data")
          console.log(data)
          console.log( data[0] )*/
        
          this.profile.age = data[0]["age"]
          this.profile.email = data[0]["email"]
          this.profile.ethnicity = data[0]["ethnicity"]
          this.profile.fullname = data[0]["fullname"]
          this.profile.gender = data[0]["gender"]
          this.profile.occupation = data[0]["occupation"]
          this.profile.state = data[0]["state"]
          this.profile.country = data[0]["country"]

        },err=>{
          /*console.log("Err")
          console.log(err)*/
        });

    })

    this.storage.get("age").then((val)=>{
      this.profile.age = val
    })

    this.storage.get("ethnicity").then((val)=>{
      this.profile.ethnicity = val
    })

    this.storage.get("fullname").then((val)=>{
      this.profile.fullname = val
    })

    this.storage.get("gender").then((val)=>{
       this.profile.gender = val
    })

    this.storage.get("occupation").then((val)=>{
        this.profile.occupation = val
    })

    this.storage.get("state").then((val)=>{
        this.profile.state = val
    })

    this.storage.get("country").then((val)=>{
        this.profile.country = val
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

  updateProfile()
  {
    var app = this
    let age = this.profile.age
    let gender = this.profile.gender
    let ethnicity = this.profile.ethnicity
    let occupation = this.profile.occupation
    let state = this.profile.state
    let country = this.profile.country

    const loading = this.loadingCtrl.create({
      content:"Updating...Please wait",
    });
    loading.present();

    this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.email))
                        .snapshotChanges()
                        .map(changes=>{
                          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                        })
                        .subscribe(snapshots => {
                          snapshots.forEach(snapshot => {
                          //console.log('Snapshot Key: ', snapshot.key);
                            this.db.list("profiles").update(snapshot.key,{
                                age: age,
                                gender: gender,
                                ethnicity: ethnicity,
                                occupation: occupation,
                                state: state,
                                country: country
                            })
                          });

                          const toast = this.toastCtrl.create({
                            message:"Profile updated successfully",
                            duration:5000
                          })
                          toast.present()

                          loading.dismiss();

                        });
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

  subscribeToNewsletter(){
    if(this.newsletter){

      this.storage.get("currentEmail").then((val)=>{
        this.subEmail = val

        const profile = this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.subEmail))
        .snapshotChanges()
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            //console.log('Snapshot Key: ', snapshot.key);
            this.db.list("profiles").update(snapshot.key,{
                newsletter: true,
            })
          });
          let toast = this.toastCtrl.create({
            message:"You've been subscribed from our newsletter",
            duration: 5000
          })
          toast.present()

        });

      })
    }
    else
    {

      this.storage.get("currentEmail").then((val)=>{
        this.subEmail = val

        const profile = this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.subEmail))
        .snapshotChanges()
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            
            this.db.list("profiles").update(snapshot.key,{
                newsletter: false,
            })
            
          });
          let toast = this.toastCtrl.create({
            message:"You've been unsubscribed from our newsletter",
            duration: 5000
          })
          toast.present()
          
        });

      })

    }
  }

  navToChangepwd(){
    //this.storage.clear()
    //this.navCtrl.setRoot(ForgotpwdPage)
    this.navCtrl.push(ForgotpwdPage)
  }

}
