import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

import { ToastController } from 'ionic-angular';

import 'rxjs/add/operator/map';

@Injectable()
export class CargaArchivoProvider {

  imagenes: ArchivoSubir[] = [];
  lastKey: string = null;

  constructor( public toastCtrl: ToastController,
               public afDB: AngularFireDatabase ) {

    this.cargar_ultimo_key()
        .subscribe( ()=> {
          this.cargar_imagenes();
        })

  }

  private cargar_ultimo_key() {
    // Obtener el último registro
    return this.afDB.list('/post', ref => ref.orderByKey().limitToLast(1))
             .valueChanges()
             .map( (post: any) => {
               console.log(post);
               this.lastKey = post[0].key;

               this.imagenes.push( post[0]);
             })
  }


  cargar_imagenes() {

    return new Promise( (resolve, reject) => {

      this.afDB.list('/post',
      ref=> ref.limitToLast(3)
               .orderByKey()
               .endAt( this.lastKey )
    ).valueChanges()
    .subscribe( (posts:any) => {

      posts.pop();

      if( posts.length == 0) {
        console.log('Ya no hay mas registros');
        resolve(false);
        return;
      }

      this.lastKey = posts[0].key;

      for( let i = posts.length-1; i>=0; i-- ) {
        let post = posts[i];
        this.imagenes.push(post);
      }

      resolve(true);

    });

    });

  }


  cargar_imagen_firebase( archivo: ArchivoSubir ) {
    let promesa = new Promise(( resolve, reject ) => {

      this.mostrarToast('Cargando...');
      // hacemos referencia a storage de cargar_imagen_firebase
      let storeRef = firebase.storage().ref();
      // Poner nombre del archivo con la fecha
      let nombreArchivo: string = new Date().valueOf().toString();
      // subir archivo y notificar cuando termine
      let uploadTask: firebase.storage.UploadTask =
      //creamos carpeta y agregamos nombre del ArchivoSubir
      storeRef.child(`img/${ nombreArchivo }`)
      .putString( archivo.img, 'base64', { contentType: 'image/jpeg' } );

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ()=>{}, // Porcentage de Mbs subidos
        ( error) => {
        // Manejo de error
        console.log("ERROR EN LA CARGA");
        console.log(JSON.stringify( error ));
        this.mostrarToast('ERROR EN LA CARGA: ' + JSON.stringify( error ) );
        reject();
      },
      () => {
        // Se cargó con éxito
        console.log('Archivo subido');
        this.mostrarToast('Imagen cargada correctamente');

        let url = uploadTask.snapshot.downloadURL;

        this.crear_post( archivo.titulo, url, nombreArchivo);

        resolve();
      }

     )

    });

    return promesa;
  }

  private crear_post( titulo: string, url: string, nombreArchivo:string) {

    let post: ArchivoSubir = {
      titulo: titulo,
      img: url,
      key: nombreArchivo
    };

    console.log( JSON.stringify(post));

    // this.afDB.list('/post').push(post);
    this.afDB.object(`/post/${ nombreArchivo }`).update(post);

    this.imagenes.push( post );


  }

  mostrarToast( mensaje: string ) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


}

interface ArchivoSubir {
  titulo: string;
  img: string;
  key?: string;
}
