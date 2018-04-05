import { Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { SubirPage } from '../subir/subir';

import { SocialSharing } from '@ionic-native/social-sharing';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';

import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hayMas:boolean = true;

  // posts: Observable<any[]>;

  constructor( private modalCtrl: ModalController,
               private _cap: CargaArchivoProvider,
               private socialSharing: SocialSharing,
               public platform: Platform ) {
                // this.posts = afDB.list('post').valueChanges();
               }

  mostrar_modal() {
    let modal = this.modalCtrl.create( SubirPage );
    modal.present();
  }


  doInfinite(infiniteScroll) {

    console.log('Begin async operation');

    this._cap.cargar_imagenes().then(
      ( hayMas: boolean ) => {
        console.log(hayMas);
        this.hayMas = hayMas;
        infiniteScroll.complete()
      }
    );

  }

  compartirFace( post: any ) {
    // this.socialSharing.shareViaFacebook( post.titulo, post.img, post.img)
    //                   .then( () => {}) // Se pudo compartir
    //                   .catch( () => {} ) // si sucede un error

    /*ALTERNATIVO*/

    this.platform.ready()
        .then(() =>
        {
          this.socialSharing.shareViaFacebook( post.titulo, null, post.img)
                             .then( () => {
                               console.log('Se ha compartido con éxito');
                             }) // Se pudo compartir
                             .catch( () => {
                             console.log('No se pudo compartir');
                           } ) // si sucede un error

        });

  }

  compartirWhats( post: any ) {
    // this.socialSharing.shareViaWhatsApp( post.titulo, post.img, post.img)
    //                   .then( () => {}) // Se pudo compartir
    //                   .catch( () => {} ) // si sucede un error

    /*Alternativo*/

    this.platform.ready()
        .then(() =>
        {
          // let img = this.decodeFromBase64(post.img);
          this.socialSharing.shareViaWhatsApp( post.titulo, null, post.img)
                             .then( () => {
                               console.log(post.titulo);
                               console.log(post.img);

                               console.log('Se ha compartido con éxito');
                             }) // Se pudo compartir
                             .catch( (ERROR) => {
                               console.log('No se pudo compartir');
                               console.log(JSON.stringify( ERROR ));
                           } ) // si sucede un error

        });

  }

  decodeFromBase64(input: string) {
  input = input.replace(/\s/g, '');
  return atob(input);
}


}
