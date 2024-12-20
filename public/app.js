var button;
var input;

// change add task button to text input when it is clicked
function addTaskClicked() {
    button = document.getElementById("add-task-button");
    // create input element
    input = document.createElement('input');
    input.placeholder = "New Task";
    input.id = "new-task-input";
    input.type = "text";
    input.onkeydown = "addTask(this)";
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
    const label = document.createElement('label');
    label.htmlFor = text;
    label.innerHTML = text;
    // add to incomplete
    const incomplete = document.getElementById('incomplete-div');
    incomplete.appendChild(document.createElement('br'));
    incomplete.appendChild(task);
    incomplete.appendChild(label);
    
    // change input back to button
    input.replaceWith(button);
}

