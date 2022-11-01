window.onload = getAllToDos();

function saveToDo(){
    // Checking local storage
    let localToDos = localStorage.getItem("toDosCount")
    if(localToDos == null){ localStorage.setItem("toDosCount", 0); }

    // Finding <ul> to append <li> 
    let li = generateLi()

    localStorage.toDosCount++;
    li.id = `toDo-${localStorage.toDosCount}`;
    let pendingUl = document.querySelector("#pending-ul");
    pendingUl.appendChild(li);

    todoObj = {
        "id": `toDo-${localStorage.toDosCount}`,
        "text": document.querySelector("#toDoInput").value,
        "due": document.querySelector("#datePickerInput").value,
        "completed": false
    }

    storeToDo(todoObj)
}

function storeToDo(obj){
    localStorage.setItem(`${obj.id}`, JSON.stringify(obj))
    // console.log("Stored locally: ", obj.text, obj.due)
}

function getAllToDos(){
    for (let i = 0; i < localStorage.length; i++) {
        let storedValue = localStorage.key(i);
        if(localStorage.key(i).includes("toDo-")){
            // console.log(`Item at ${i}: ${storedValue}`);
            let obj = JSON.parse(localStorage.getItem(storedValue))
            generateLi2(obj.text, obj.due)
        }
    }
}

function generateLi(){
    // Creating el and nodes
    // Grabbing values from inputs
    let toDo = document.querySelector("#toDoInput").value;
    let dueDate = document.querySelector("#datePickerInput").value;

    const li = document.createElement("li");
    // Spacing elements inside
    li.style.display = "flex";
    li.style.justifyContent = "space-around";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `toDo-${Number(localStorage.toDosCount)+1}-checkbox`; // check

    checkbox.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
          markAsCompleted()
        } else {
          markAsPending()
        }
      })
    
      const boldDue = document.createElement("strong");
    boldDue.appendChild(document.createTextNode("Due: "));
    
    let span1 = document.createElement("span");
    span1.appendChild(document.createTextNode(toDo));
    
    let span2 = document.createElement("span");
    span2.appendChild(boldDue);
    span2.appendChild(document.createTextNode(dueDate));
    
    li.appendChild(checkbox);
    li.appendChild(span1);
    li.appendChild(span2);

    return li;
}
function generateLi2(toDo, dueDate){
    // Creating el and nodes
    // Grabbing values from inputs
    // let toDo = document.querySelector("#toDoInput").value;
    // let dueDate = document.querySelector("#datePickerInput").value;

    const li = document.createElement("li");
    // Spacing elements inside
    li.style.display = "flex";
    li.style.justifyContent = "space-around";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `toDo-${Number(localStorage.toDosCount)+1}-checkbox`;

    checkbox.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
          markAsCompleted()
        } else {
          markAsPending()
        }
      })
    
      const boldDue = document.createElement("strong");
    boldDue.appendChild(document.createTextNode("Due: "));
    
    let span1 = document.createElement("span");
    span1.appendChild(document.createTextNode(toDo));
    
    let span2 = document.createElement("span");
    span2.appendChild(boldDue);
    span2.appendChild(document.createTextNode(dueDate));
    
    li.appendChild(checkbox);
    li.appendChild(span1);
    li.appendChild(span2);

    document.getElementById("pending-ul").appendChild(li);
}

function markAsCompleted(){
    // console.log(event.currentTarget.id)
    let el = document.getElementById(event.currentTarget.id)
    let li = el.parentNode
    li.style.textDecoration = "line-through";
    
    const id = event.currentTarget.id.slice(0, -9);
    if(localStorage.toDosCount == 1){
        localStorage.setItem("0", JSON.stringify({}))
        localStorage.toDosCount++;
    }
    // console.table("toDo-"+ (Number(id.slice(-1))-1))
    let obj = JSON.parse(localStorage.getItem(id));
    
    obj.completed = true;
    // console.log(id, JSON.stringify(obj))
    localStorage.setItem(id, JSON.stringify(obj));

    document.getElementById("completed-tbl").innerHTML = ""
    updateCompleted()
}

function generateRow(id){
    let json = JSON.parse(localStorage.getItem(id))
    let tr = document.createElement("tr");

    tr.appendChild(document.createElement("td")).textContent = json.text;
    tr.appendChild(document.createElement("td")).textContent = json.due;

    let tbl = document.getElementById("completed-tbl");
    tbl.appendChild(tr);
}

function markAsPending(){
    let el = document.getElementById(event.currentTarget.id)
    let li = el.parentNode
    li.style.textDecoration = "";

    const id = event.currentTarget.id.slice(0, -9);
    let obj = JSON.parse(localStorage.getItem(id));
    obj.completed = false;
    // console.log(id, JSON.stringify(obj))
    localStorage.setItem(id, JSON.stringify(obj));
}

function updateCompleted(){
    let i = 0;
    while(localStorage.key(i) != null){
        let storedValue = localStorage.key(i);  // key in localStorage
        // console.log(storedValue)
        if(JSON.parse(localStorage.getItem(storedValue)).completed == true){
            // console.log(`Item at ${i}: ${storedValue} is completed`);
            generateRow(storedValue)
        }
    i++;
    }
}

function reset(){
    let bool = window.confirm("Are you sure?");
    if( bool ){ 
        localStorage.clear(); 
        document.querySelector("#pending-ul").innerHTML = ""
        document.querySelector("#completed-tbl").innerHTML = ""
    }
}