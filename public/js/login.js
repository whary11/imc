new Vue({
  el:'#app',
  data:{
    usuario:'',

  },
  beforeCreate(){
    var self = this
    firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
          window.location="index.html";
        }
    });
  },
  created(){
      // var database = firebase.database().ref('users/');
  },
  methods:{
    google(){
        var self = this
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        this.account(provider)

    },
    facebook(){
      var self = this;
      var provider = new firebase.auth.FacebookAuthProvider();
      this.account(provider)
    },
    account(proveedor){
      firebase.auth().languageCode = 'es';
      firebase.auth().signInWithPopup(proveedor).then(function(result) {
        var user = result.user;
        var nombre = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        var usuario = {
          nombre: nombre,
          correo:email,
          foto: photoURL,
          id: uid,
          esAnonimo: isAnonymous,
        }
        let db = firebase.database();
        // var pathname = window.location.pathname;
        let ref = db.ref('imc/' + usuario.id);
        ref.set(usuario);
        window.location="index.html";
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage == 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.') {
          M.toast({html: 'Debe utilizar otra cuenta para el inico de Sesión, parece que alguien ya ha usado tu correo. '+error.email})
        }
        // console.log(error);
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // // ...
      });
    }
  }
})
