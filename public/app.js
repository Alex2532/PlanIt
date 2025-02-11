var button;
var input;
var idNum = 0;

// when the document loads, it needs to put in all the tasks that were saved
document.addEventListener("DOMContentLoaded", function () {
    const size = localStorage.getItem("size");
    idNum = size;
    if (idNum === null)
    {
        idNum = 0;
    }

    for (let i = 0; i < size; i++) { 
        const jsonObject = JSON.parse(localStorage.getItem(i));
        const id = jsonObject.idNumber;
        const text = jsonObject.text;
        const completed = jsonObject.completed;

        // create task and label
        const task = createTask(id, text);
        checkbox = task.firstChild;

        if (completed) { // put in completed div
            checkbox.setAttribute('onclick', 'incomplete(this)');
            checkbox.checked = true;
            const complete = document.getElementById('complete-div');
            complete.appendChild(task);
            complete.appendChild(createBr(id));
            
        } else { // put in incomplete div
            checkbox.setAttribute('onclick', 'completed(this)');
            const incomplete = document.getElementById('incomplete-div');
            incomplete.appendChild(task);
            incomplete.appendChild(createBr(id));
        }
    }

    feather.replace();
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

// add new task to incomplete using text input when the enter key is pressed on the input field
function addTask() {
    // create the checkbox and label for the new task
    const text = input.value;
    const task =  createTask(idNum, text);
    const checkbox = task.firstChild;
    checkbox.setAttribute('onclick', 'completed(this)');
    // add to incomplete
    const incomplete = document.getElementById('incomplete-div');
    incomplete.appendChild(task);
    incomplete.appendChild(createBr(idNum));
    
    // change input back to button
    input.replaceWith(button);
    idNum++;

    // save task
    const label = task.children[1];
    saveTask(task.id, label.innerHTML, false);
}

// creates a task checkbox
function createCheckbox(id) {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = id + "checkbox";
    checkbox.value = id + "checkbox";

    return checkbox;
}

// creates a task span
function createTask(id, text) {
    const task = document.createElement('span');
    task.id = id;
    task.classList.add('task-span', 'border', 'rounded');

    // checkbox, label, remove, and edit appending to the span
    task.appendChild(createCheckbox(id));
    task.appendChild(createLabel(id, text));
    task.appendChild(createRemove(id));
    task.appendChild(createEdit(id));

    return task;
}

// creates a label for the task
function createLabel(id, text) {
    const label = document.createElement('label');
    label.htmlFor = id + "checkbox";
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

// creates unique remove button
function createRemove(id) {
    const remove = document.createElement('i');
    remove.setAttribute('data-feather', 'trash');
    remove.id = id + "remove";
    remove.classList.add('icon');
    return remove;
}

// creates unique edit button
function createEdit(id) {
    const edit = document.createElement('i');
    edit.setAttribute('data-feather', 'edit-2');
    edit.id = id + "edit";
    edit.classList.add('icon');
    return edit;
}

// adds task to the completed div when checked
function completed(checkbox) {
    // remove from incomplete
    const incomplete = document.getElementById('incomplete-div');
    const task = checkbox.parentNode;
    const brid = task.id + "br";
    br = document.getElementById(brid);
    incomplete.removeChild(task);
    incomplete.removeChild(br);
    // change the onclick attribute to incomplete()
    checkbox.setAttribute('onclick', 'incomplete(this)');
    // add to complete
    const complete = document.getElementById('complete-div');
    complete.appendChild(task);
    complete.appendChild(br);

    label = task.children[1];
    saveTask(task.id, label.innerHTML, true);
}

// adds task to the incomplete div when unchecked
function incomplete(checkbox) {
    // remove from complete
    const complete = document.getElementById('complete-div');
    task = checkbox.parentNode;
    const brid = task.id + "br";
    br = document.getElementById(brid);
    complete.removeChild(task);
    complete.removeChild(br);
    // change the onclick to complete()
    checkbox.setAttribute('onclick', 'completed(this)');
    // add to incomplete
    const incomplete = document.getElementById('incomplete-div');
    incomplete.appendChild(task);
    incomplete.appendChild(br);

    label = task.children[1];
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
    localStorage.setItem("size", idNum);

    feather.replace();
}
