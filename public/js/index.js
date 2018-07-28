new Vue({
  el:'#app',
  data:{
    login:false,
    rABS:true,
    datos: '',
  },
  created:function(){
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
          // User is signed in
          this.login = true
          // ...
      }
  });
// firebase.auth().signInWithEmailAndPassword(email, password);
  },
  methods:{
    getExcel(e){
      let files = e.target.files, f = files[0];
      let reader = new FileReader();
      reader.onload = (e)=>{
        let data = e.target.result;
        if(!this.rABS) data = new Uint8Array(data);
        let workbook = XLSX.read(data, {type: this.rABS ? 'binary' : 'array'});
        /* DO SOMETHING WITH workbook HERE */
        let first_sheet_name = workbook.SheetNames [0];
        // Pasando la información a la propiedad datos
        let worksheet = workbook.Sheets [first_sheet_name];
        let getInfo = XLSX.utils.sheet_to_json(worksheet, {raw: true});
        this.datos = getInfo;
      };
      if(this.rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    },
    trunc (x, posiciones = 0) {
      var s = x.toString()
      var l = s.length
      var decimalLength = s.indexOf('.') + 1
      var numStr = s.substr(0, decimalLength + posiciones)
      return Number(numStr)
    }
  }
})
