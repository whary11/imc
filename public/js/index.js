new Vue({
  el:'#app',
  data:{
    login:false,
    rABS:true,
    datos: [],
    preload:false,
  },
  created:function(){
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
          // User is signed in
          this.login = true
          // ...
      }
    });
    moment.locale('es')
// firebase.auth().signInWithEmailAndPassword(email, password);
  },
  methods:{
    getExcel(e){
      this.preload = true
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
        this.preload = false
        getInfo.map((index, elem)=>{
          index.nacimiento = new Date(index.nacimiento)
          this.datos.push(index)
        })


        // this.datos = getInfo;
        console.log(this.datos);
      };
      if(this.rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    },
    trunc (x, posiciones = 0) {
      var s = x.toString()
      var l = s.length
      var decimalLength = s.indexOf('.') + 1
      var numStr = s.substr(0, decimalLength + posiciones)
      return Number(numStr)
    },
    convertirFceha(fecha){
      let f = new Date(fecha)

      var month = f.getMonth()+1;
      var day = f.getDate();
      var year = f.getFullYear();
      var fec = day + '-' + month + '-' + year;
      return f
    },
      calculaEdad(fecha_nac){
        // recibe fecha actual y fecha de nacimiento
      	var a = moment(moment().startOf('hour').fromNow());
      	var b = moment(fecha_nac);

      	var years = a.diff(b, 'year');
      	b.add(years, 'years');

      	var months = a.diff(b, 'months');
      	b.add(months, 'months');

      	var days = a.diff(b, 'days');

      	if(years==0){
      		if(months<=1){
      			if(days<=1){
      				console.log(months + ' mes ' + days + ' dia');
      		    }else{
      				console.log( months + ' mes ' + days + ' dias');
      		    }
      	   }else{
      			if(days<=1){
      			   console.log( months + ' meses ' + days + ' dia');
      			}else{
      			   console.log( months + ' meses ' + days + ' dias');
      			}
      	   }

      	}else{
      		if(years==1){
      			console.log( years + ' año');
      	    }else{
      			console.log( years + ' años');
      	    }
      	}
}
  }
})
