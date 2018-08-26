import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public afAuth: AngularFireAuth, public db: AngularFireDatabase,
              public storage: Storage,public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,) 
  { 
    this.newsletter = false
    this.storage.get("currentEmail").then((val)=>{

        this.email = val
        console.log("this.email",this.email)

        this.profile.email = val

        // const profile = db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.email)).valueChanges()
        // profile.subscribe(data => {
        //   console.log("Data")
        //   console.log(data)
        //   console.log( data[0] )
        
        //   this.profile.age = data[0]["age"]
        //   this.profile.email = data[0]["email"]
        //   this.profile.ethnicity = data[0]["ethnicity"]
        //   this.profile.fullname = data[0]["fullname"]
        //   this.profile.gender = data[0]["gender"]
        //   this.profile.occupation = data[0]["occupation"]
        //   this.profile.state = data[0]["state"]
        //   this.profile.country = data[0]["country"]
  
        //   console.log("pf",this.profile.age,this.profile.email,this.profile.ethnicity,
        //             this.profile.fullname,this.profile.gender,this.profile.occupation,
        //             this.profile.state,this.profile.country)
        // },err=>{
        //   console.log("Err")
        //   console.log(err)
        // });

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

  updateProfile(){
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
    const profile = this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(this.email))
                        .snapshotChanges()
                        .map(changes=>{
                          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                        })
                        .subscribe(snapshots => {
                          snapshots.forEach(snapshot => {
                          console.log('Snapshot Key: ', snapshot.key);

                          this.db.list("profiles").update(snapshot.key,{
                              age: age,
                              gender: gender,
                              ethnicity: ethnicity,
                              occupation: occupation,
                              state: state,
                              country: country
                          })

                          const toast = this.toastCtrl.create({
                            message:"Profile updated successfully",
                            duration:5000
                          })
                          toast.present()

                          loading.dismiss();

                          });
                        });


    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
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
      let toast = this.toastCtrl.create({
        message:"You've been succesfully subscribed to our newsletter",
        duration: 5000
      })
      toast.present()
    }else{
      let toast = this.toastCtrl.create({
        message:"You've been unsubscribed from our newsletter",
        duration: 5000
      })
      toast.present()
    }
  }

}
