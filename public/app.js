var button;
var input;
var idNum = 0;

// when the document loads, it needs to put in all the tasks that were saved
document.addEventListener("DOMContentLoaded", function () {
    const size = localStorage.getItem("size");
    idNum = size;

    for (let i = 0; i < size; i++) { 
        const jsonObject = JSON.parse(localStorage.getItem(i));
        console.log(jsonObject);
        const id = jsonObject.idNumber;
        const text = jsonObject.text;
        const completed = jsonObject.completed;

        // create task and label
        const task = createTask(id);
        const label = createLabel(id, text);

        if (completed) { // put in completed div
            task.setAttribute('onclick', 'incomplete(this)');
            task.checked = true;
            const complete = document.getElementById('complete-div');
            complete.appendChild(task);
            complete.appendChild(label);
            complete.appendChild(createBr(id));
            
        } else { // put in incomplete div
            task.setAttribute('onclick', 'completed(this)');
            const incomplete = document.getElementById('incomplete-div');
            incomplete.appendChild(task);
            incomplete.appendChild(label);
            incomplete.appendChild(createBr(id));
        }
    }
});

// change add task button to text input when it is clicked
function addTaskClicked() {
    button = document.getElementById("add-task-button");
    // create input element
    input = document.createElement('input');
    input.placeholder = "New Task";
    input.id = "new-task-input";
    input.type = "text";
    input.onkeydown = "addTask()";
    // change button to input 
    button.replaceWith(input);
    // make it so that the enter button adds the task
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
}

// add new task to incomplete using text input when the enter key is pressed
function addTask() {
    // create the checkbox and label for the new task
    const text = input.value;
    const task =  createTask(idNum);
    task.setAttribute('onclick', 'completed(this)');
    label = createLabel(task.id, text);
    // add to incomplete
    const incomplete = document.getElementById('incomplete-div');
    incomplete.appendChild(task);
    incomplete.appendChild(label);
    incomplete.appendChild(createBr(idNum));
    
    // change input back to button
    input.replaceWith(button);
    idNum++;
    saveTask(task.id, label.innerHTML, false);
}

// creates a task checkbox
function createTask(id) {
    const task = document.createElement('input');
    task.type = "checkbox";
    task.id = id;
    task.value = id;
    return task;
}

// creates a label for the task
function createLabel(id, text) {
    const label = document.createElement('label');
    label.htmlFor = id;
    label.id = id + "label";
    label.innerHTML = text;
    return label;
}

// creates a unique line break 
function createBr(id) {
    const br = document.createElement('br');
    br.id = id + "br";
    return br;
}

// adds task to the completed div when checked
function completed(task) {
    // remove from incomplete
    const incomplete = document.getElementById('incomplete-div');
    const labelid = task.id + "label";
    const brid = task.id + "br";
    label = document.getElementById(labelid);
    br = document.getElementById(brid);
    incomplete.removeChild(task);
    incomplete.removeChild(label);
    incomplete.removeChild(br);
    // change the onclick attribute to incomplete()
    task.setAttribute('onclick', 'incomplete(this)');
    // add to complete
    const complete = document.getElementById('complete-div');
    complete.appendChild(task);
    complete.appendChild(label);
    complete.appendChild(br);

    saveTask(task.id, label.innerHTML, true);
}

// adds task to the incomplete div when unchecked
function incomplete(task) {
    // remove from complete
    const complete = document.getElementById('complete-div');
    const labelid = task.id + "label";
    const brid = task.id + "br";
    label = document.getElementById(labelid);
    br = document.getElementById(brid);
    complete.removeChild(task);
    complete.removeChild(label);
    complete.removeChild(br);
    // change the onclick to complete()
    task.setAttribute('onclick', 'completed(this)');
    // add to incomplete
    const incomplete = document.getElementById('incomplete-div');
    incomplete.appendChild(task);
    incomplete.appendChild(label);
    incomplete.appendChild(br);

    saveTask(task.id, label.innerHTML, false);
}

// saves task into local storage
function saveTask(id, text, completed) {
    const jsonObject = {
        "idNumber" : id,
        "text" : text,
        "completed" : completed
    };

    localStorage.setItem(id, JSON.stringify(jsonObject));
    console.log(localStorage.getItem(id));

    localStorage.setItem("size", idNum);
    console.log(localStorage.getItem("size"));
}
