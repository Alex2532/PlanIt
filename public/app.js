var button;
var input;

function createBr(id) {
    const br = document.createElement('br');
    br.id = id + "br";
    return br;
}

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
    // create the checkbox for the new task
    const text = input.value;
    const task = document.createElement('input');
    task.type = "checkbox";
    task.id = text;
    task.name = text;
    task.value = text;
    task.setAttribute('onclick', 'completed(this)');
    const label = document.createElement('label');
    label.htmlFor = text;
    label.id = text + "label";
    label.innerHTML = text;
    // add to incomplete
    const incomplete = document.getElementById('incomplete-div');
    incomplete.appendChild(createBr(text));
    incomplete.appendChild(task);
    incomplete.appendChild(label);
    
    // change input back to button
    input.replaceWith(button);
    console.log(input);
}

// adds task to the completed div when checked
function completed(task) {
    // remove from incomplete
    const incomplete = document.getElementById('incomplete-div');
    const labelid = task.id + "label";
    label = document.getElementById(labelid);
    incomplete.removeChild(task);
    incomplete.removeChild(label);
    // change the onclick attribute to incomplete()
    task.setAttribute('onclick', 'incompleted(this)');
    // add to complete
    const complete = document.getElementById('complete-div');
    complete.appendChild(createBr(task.id));
    complete.appendChild(task);
    complete.appendChild(label);
}

// adds task to the incomplete div when unchecked
function incompleted(task) {
    // remove from complete
    const complete = document.getElementById('complete-div');
    const labelid = task.id + "label";
    label = document.getElementById(labelid);
    complete.removeChild(task);
    complete.removeChild(label);
    // change the onclick to complete()
    task.setAttribute('onclick', 'completed(this)');
    // add to incomplete
    const incomplete = document.getElementById('incomplete-div');
    incomplete.appendChild(createBr(task.id));
    incomplete.appendChild(task);
    incomplete.appendChild(label);
}

