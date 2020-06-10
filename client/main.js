//we need to have an array of elements to save the tasks
//var todoItems= [1,2];
var url="http://localhost:8080/todo/list";
//javascript object declaration(kind of object needed)
var singleTodoItem={
taskTitle: "", //for saving the title
taskDescription: "", //saving the description
taskDeadline: "", //the deadline of the task added
username: "",
iscompleted: ""
};
//making an array of objects

var todoItems=[
//to store the json data coming from the database
];
//getting json data from database
var uni=[];
var nameurl="http://localhost:8080/todo/name";
var pro=fetch(nameurl);
pro.then(response=>{
   if (response.status == 200) {
    var promiseOfData = response.json();
    promiseOfData.then(jsonData => {
        uni = jsonData;
         console.log(uni);
        // console.log(uni.uniuser);
var str="Hello "+uni.uniuser+"...";
document.getElementById("headd").innerHTML=str;
         render();
    });
   }
});
var promise=fetch(url);
promise.then(response=>{
   if (response.status == 200) {
    var promiseOfData = response.json();
    promiseOfData.then(jsonData => {
        todoItems = jsonData;
         console.log(todoItems);
         render();
    });
   }
});




//referring HTML elements
var todoListElement=document.getElementById("todoList");
var taskTitleInputElement= document.getElementById("taskTitleInput");
var taskDescriptionInputElement=document.getElementById("taskDescriptionInput")
var taskDeadlineInputElement=document.getElementById("taskDeadlineInput");

var x=[];




//onclicking the add task button the following function would be called
function addTask(){
var taskTitle=taskTitleInputElement.value;
var taskDescription=taskDescriptionInputElement.value;
var taskDeadline=taskDeadlineInputElement.value;

var newTask={
   username: uni.uniuser,
   title: taskTitle,
   description: taskDescription,
   deadline: taskDeadline,
   completed: false
};
var url1="http://localhost:8080/todo/create?username="+newTask.username+"&title="+newTask.title+"&description="+newTask.description+"&deadline="+newTask.deadline+"&completed="+newTask.completed;
var promise= fetch(url1);
   promise.then(response=>{
      if (response.status == 200) {
       var promiseOfData = response.json();
       promiseOfData.then(jsonData => {
           todoItems= jsonData;
          //  console.log(todoItems);
            render();
       });
      }
   });


//now we need to manipulate the DOM again
taskTitleInputElement.value="";
taskDescriptionInputElement.value="";
taskDeadlineInputElement.value="";
}

function deleteTask(index){
   var urldel="http://localhost:8080/todo/delete?id="+todoItems[index]._id;
   var promise=fetch(urldel);
   promise.then(response=>{
      if (response.status == 200) {
       var promiseOfData = response.json();
       promiseOfData.then(jsonData => {
           todoItems= jsonData;
            render();
       });
      }
   });
   render();
}

//this function is called during the execution of the editing of the task
function addEditedTask(){
    //fetching the elements
    var taskTitleInputElement1= document.getElementById("editTaskTitle");
 var taskDescriptionInputElement1=document.getElementById("editTaskDescription")
 var taskDeadlineInputElement1=document.getElementById("editTaskDeadline");
 //getting the values present at the respective ids
 var taskTitle=taskTitleInputElement1.value;
 var taskDescription=taskDescriptionInputElement1.value;
 var taskDeadline=taskDeadlineInputElement1.value;
 //creating a new modified object to be added to the current list
 var newTask={
    taskTitle: taskTitle,
    taskDescription: taskDescription,
    taskDeadline: taskDeadline
 };
 
 //updating the innreHTML of the editform to make it empty as it is not required now
 document.getElementById("edit").innerHTML="";
 
 
 taskTitleInputElement1.value="";
 taskDescriptionInputElement1.value="";
 taskDeadlineInputElement1.value="";
 }

//function to edit an existing task
function editTask(index)
{
   var edtitle=todoItems[index].title;
   var eddescription=todoItems[index].description;
   var eddeadline=todoItems[index].deadline;
   deleteTask(index);
   var titleid=document.getElementById("taskTitleInput");
   var desid=document.getElementById("taskDescriptionInput");
   var dedid=document.getElementById("taskDeadlineInput")
   titleid.value=edtitle;
   desid.value=eddescription;
   dedid.value=eddeadline;
//deleting the task already present i.n the task list to attach the modified or edited task


}


function filter()
{
   var key=document.getElementById("key").value;
   
   var copy=[];
   for(var i=0;i<todoItems.length;i++)
   {
      if(todoItems[i].deadline===key)
      {
         copy.push(todoItems[i]);
      }
   }
   var newcopy=todoItems;
   todoItems=copy;
   render();
   todoItems=newcopy;
}
function completed(index)
{
   console.log(todoItems[index]._id);

   var urlc="http://localhost:8080/todo/complete?id="+todoItems[index]._id;
   var promise=fetch(urlc);
      promise.then(response=>{
         if (response.status == 200) {
          var promiseOfData = response.json();
          promiseOfData.then(jsonData => {
              todoItems = jsonData;
               console.log(todoItems);
               render();
          });
         }
      });
}

function logout(){
   var ur="http://localhost:8080/todo/logout";
   var promise=fetch(ur);
   location.href="login.html";



}




function render(){
var textHtml="";

//looping through the array of objects
for(var i=0;i<todoItems.length;i++)
{
   if(todoItems[i].iscompleted==='false'||todoItems[i].iscompleted===false)
   {
   textHtml+=`<div class="todo-list-item ">
               <div class="task-title">${todoItems[i].title}</div>
               <div class="task-description">${todoItems[i].description}</div>
               <div class="task-deadline">${todoItems[i].deadline}</div>
               <a href="#" class="delete-btn" onclick="deleteTask(${i})">Delete</a>
               <a href="#" class="edit-btn" onclick="editTask(${i})">Edit Task</a>
               <a href="#" class="complete-btn" onclick="completed(${i})">Mark as completed</a>
               </div>`
   }
   else
   {
      textHtml+=`<div class="todo-list-item ">
               <div class="task-title">${todoItems[i].title}</div>
               <div class="task-description">${todoItems[i].description}</div>
               <div class="task-deadline">${todoItems[i].deadline}</div>
               <a href="#" class="delete-btn" onclick="deleteTask(${i})">Delete</a>
               <a href="#" class="edit-btn" onclick="editTask(${i})">Edit Task</a>
               <a href="#" class="complete-btn" onclick="completed(${i})">Done</a>
               </div>`
   }
}
var todoListElement=document.getElementById("todoList")
todoListElement.innerHTML=textHtml;

}

