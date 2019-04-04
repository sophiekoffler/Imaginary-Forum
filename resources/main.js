   //Initializes form - registers event listeners and
   //restores user data in case of re-load

   function initialize() {
     restoreState();
   document.getElementById('fName').addEventListener('change',function() {sessionStorage.setItem('fName',this.value)});
   document.getElementById('lName').addEventListener('change',function (){sessionStorage.setItem('lName',this.value)});
   document.getElementById('email').addEventListener('change',function (){sessionStorage.email=this.value});
   document.getElementById('phone').addEventListener('change',function (){sessionStorage.phone=this.value});
   document.getElementById('bDay').addEventListener('change',function() {sessionStorage.bDay=this.value});
   document.getElementById('street').addEventListener('change',function() {sessionStorage.street=this.value});
   document.getElementById('city').addEventListener('change',function() {sessionStorage.city=this.value});
   document.getElementById('state').addEventListener('change',function() {sessionStorage.state=this.value});
   document.getElementById('zip').addEventListener('change',function() {sessionStorage.zip=this.value});
   document.getElementById('country').addEventListener('change',function(){sessionStorage.country=this.value});
   document.getElementById('uName').addEventListener('change',function(){sessionStorage.uName=this.value});
   document.getElementById('pass1').addEventListener('change',function(){sessionStorage.pass1=this.value});
   document.getElementById('pass2').addEventListener('change',function(){sessionstorage.pass2=this.value});

   document.getElementById('message').addEventListener('change',function() {sessionStorage.message=this.value});
   document.getElementById('lifeRating').addEventListener('change',
     displayScore);
   }

   //retrieves lat/long from ip address if browser supported
   function getLocation() {
     console.log("getLocation");
      if (navigator.geolocation) {
        console.log("yes navigator.geolocation");
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        document.getElementById("map").innerHTML="Geolocation API not supported by your browser.";
     }
   }

    // Called when position is available
    //uses mapquest geocoder api for reverse geocoding
    //populates address fields and loads local map
  function showPosition(position) {
    console.log("showPosition");
    L.mapquest.key = "vGJGPkAmSysxKq4otQK6O8yY1WddpgbW";
    L.mapquest.map('map',{
      center:[position.coords.latitude,position.coords.longitude],
      layers: L.mapquest.tileLayer('map'),
      zoom: 12
    });

    var geocoder = L.mapquest.geocoding();
  geocoder.reverse([position.coords.latitude,position.coords.longitude], geocodingCallback);

  //extract address information - display and store it
  function geocodingCallback(error, result) {
    addInfo = result["results"][0]["locations"][0];

    document.getElementById('street').value=addInfo.street;
    document.getElementById('city').value=addInfo.adminArea4;
    document.getElementById('state').value=addInfo.adminArea3;
    document.getElementById('zip').value = addInfo.adminArea1;
    document.getElementById('country').value= addInfo.postalCode;
    };
  }

  function dragOverHandler(event){
  event.stopPropagation();
    event.preventDefault();
    console.log('in dragover handler');
  }

  function dragEnterHandler(event){
  console.log('in dragEnterHandler');
    event.target.classList.add('dragOver');
  }

  function dragLeaveHandler(event){
    console.log('in dragleavehandler');
    event.target.classList.remove('dragOver');
  }

//keeps form data filled in incase of accidental page reload
  function restoreState(){
  console.log('in restore state');
  document.getElementById('fName').value=sessionStorage.getItem('fName');
  document.getElementById('lName').value=sessionStorage.getItem('lName');
  document.getElementById('email').value=sessionStorage.getItem('email');
  document.getElementById('phone').value=sessionStorage.getItem('phone');
  document.getElementById('bDay').value=sessionStorage.getItem('bDay');
  document.getElementById('street').value=sessionStorage.getItem('street');
  document.getElementById('city').value=sessionStorage.getItem('city');
  document.getElementById('state').value=sessionStorage.getItem('state');
  document.getElementById('zip').value=sessionStorage.getItem('zip');
  document.getElementById('country').value=sessionStorage.getItem('country');
  document.getElementById('uName').value=sessionStorage.getItem('uName');
  document.getElementById('pass1').value=sessionStorage.getItem('pass1');
  document.getElementById('pass2').value=sessionStorage.getItem('pass2');
  document.getElementById('lifeRating').value=sessionStorage.getItem('displayScore');
  document.getElementById('lifeScore').innerHTML=document.getElementById('lifeRating').value + "%";
  document.getElementById('message').innerHTML=sessionStorage.getItem('message');
  }

  //Validates passwords
  function checkPasswords() {
  var password1 = document.getElementById('pass1');
  var password2 = document.getElementById('pass2');
  if (password1.value != password2.value) {
    password2.setCustomValidity('Passwords do not match');
  } else {
    password2.setCustomValidity('');
  }
  }

  //displays current lifeScore value
  function displayScore(event){
		document.getElementById('lifeScore').innerHTML=event.target.value + "%";
    sessionStorage.displayScore = event.target.value + "%";
	}

  //Scripts for image dropping
function dropHandler(event){
    event.stopPropagation();
    event.preventDefault();
    console.log('in dropHandler');
    event.target.classList.remove('dragOver');

    var files = event.dataTransfer.files;

    for(var i = 0;i<files.length;i++)
    {
      var f=files[i];
      if(!f.type.match('image/*'))
      {   alert("Image please");
          return;}
      var li = document.createElement('li');
      li.textContent=f.name;
      document.getElementById('fileList').appendChild(li);
    }
    //save names of files so server can associate correct files with
    //user profile and delete files with no association
    sessionStorage.fileNames +=f.name + " ";
    uploadFiles(files);
    previewFiles(files);
  }

//Adds small image of files to be uploaded
  function previewFiles(files){
    for(var i = 0;i<files.length;i++)
    {
      var file = files[i];
      var reader=new FileReader();
      reader.onload=function(e){
        var span=document.createElement('span');
        span.innerHTML="<img class='thumb' width='100' src='" + e.target.result + "'/>";
        document.getElementById('pics').insertBefore(span, null);
      }
      reader.readAsDataURL(file);
    }
  }


		//Simulate upload of images dropping selected files -with progress meter
    //using AJAX

	 function uploadFiles(files) {

      var progress= document.getElementById('fileUpload');
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '');

      xhr.upload.onprogress = function(e) {
            progress.value = e.loaded;
            progress.max = e.total;
        };

        xhr.onload = function() {
            alert('Upload complete!');
        };

        var form = new FormData();
        for(var i = 0 ; i < files.length ; i++) {
          console.log("file"+i + " : "+ files[i].name);
           form.append('file', files[i]);
        }
        xhr.send(form);
      }

      //submit form info
    function submitInfo(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST','');
        xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        var form = new FormData();
        form.append("firstName", sessionStorage.getItem('fName'));
        form.append("lastName", sessionStorage.getItem('lName'));
        form.append("email", sessionStorage.getItem('email'));
        form.append("phone", sessionStorage.getItem('phone'));
        form.append("bDay", sessionStorage.getItem('bDay'));
        form.append("street", sessionStorage.getItem('street'));
        form.append("city", sessionStorage.getItem('city'));
        form.append("state", sessionStorage.getItem('state'));
        form.append("zip", sessionStorage.getItem('zip'));
        form.append("country", sessionStorage.getItem('country'));
        form.append("uName", sessionStorage.getItem('uName'));
        form.append("pass", sessionStorage.getItem('pass1'));
        form.append("lifeScore", sessionStorage.getItem('displayScore'));
        form.append("message", sessionStorage.getItem('message'));
        form.append("fileNames",sessionStorage.getItem('fileNames'));

        xhr.send(form);
        }
