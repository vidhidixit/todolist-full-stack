function login(){
    var user= document.getElementById("user").value;
    var pass=document.getElementById("pass").value;
    console.log(user);
    console.log(pass);
    var url="http://localhost:8080";
    var loginurl=url+'/login?username='+user+'&password='+pass;
    var loginres="";
    var promise=fetch(loginurl)
        
    promise.then(response=>{
        if (response.status == 200) {
         var promiseOfData = response.json();
         promiseOfData.then(stringData => {
             loginres = stringData;
              console.log(loginres);
              if(loginres.access==="true")
              {
                  var htmlelement=document.getElementById("contain");
                /*  var htm= `<div class="abc">
                  <div><h2>Welcome to your TO-DO List</h2>
                  <div>Want to check your tasks?</div>
                  <a href="index.html">Click me ...</a>
                  </div>
                  `
                  htmlelement.innerHTML=htm;*/
                  location.href="index.html";
              }
              else{
                var htmlelement=document.getElementById("heading");
                htmlelement.innerHTML=`Invalid username or password`;
                
              }
            
         });
        }
            
         });

}
function register(){
    var username=document.getElementById("newuser").value;
    var password=document.getElementById("newpass").value;
    var urlreg="http://localhost:8080/register?username="+username+"&password="+password;
    var promise=fetch(urlreg);
    var data=[];
    promise.then(response=>{
        if (response.status == 200) {
         var promiseOfData = response.json();
         promiseOfData.then(stringData => {
             data = stringData;
              console.log(data);
              if(data.access==="true")
              location.href="login.html";
              else
              {
                document.getElementById("userhead").innerHTML="Username already exists";
              }

              
        });
    }
    } );

}




function newuser(){
    var form=document.getElementById("form");
    var registerform=`<div>
                <div><h3 id="userhead">Register</h3></div>
                <div>
                <label>Enter your name</label><br />
                <input type="text" placeholder="Name">
                </div>
                <div>
                <label>Enter username</label><br />
                <input type="text" placeholder="username" id="newuser">
                </div>
                <div>
                <label>Enter password</label><br />
                <input type="password" placeholder="Password" id="newpass">
                </div>
                <div><button onclick="register()">Register</div>
                </div>`
                form.innerHTML=registerform;
}