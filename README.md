#Gag

App móvil realizada con el framework Ionic

Saca fotos con la cámara del dispositivo, y las almacena en una base de datos de firebase mediante la creación de un post añadiendo un título.

Estas fotos son mostradas en la página principal de la APP mostrando nombre del autor y Titulo

Para iniciar esta aplicación tiene que ir primero a (https://firebase.google.com) y obtener una cuenta de firebase. Crear un proyecto nuevo llamado gag


En database de firestore elija Real Time Data Base

Ponga en las reglas de la database y del storage esta regla:

{
  "rules": {
    ".read": "auth == null",
    ".write": "auth == null"
  }
}


Vaya a proyect overview y elija agregar firebase a tu web app copie y pegue el contenido de sus credenciales en la carpeta: src/app/app.module linea 22 a 27

De la linea 9 a la 14

```
apiKey: "",
authDomain: "",
databaseURL: "",
projectId: "",
storageBucket: "",
messagingSenderId: ""

```

Abra la carpeta platforms/android con Android Studio, compile y pruebe en un dispositivo real.
