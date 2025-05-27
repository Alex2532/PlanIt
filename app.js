var idNum = 0;
var signedIn = false;
var currentUser;

// region Account Handling
//-----------------------------------------------------------------------------------------------------//

const supabaseClient = supabase.createClient(
    'https://xxinlznoofinrkqjlano.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aW5sem5vb2ZpbnJrcWpsYW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2Mzg2MjgsImV4cCI6MjA2MjIxNDYyOH0.c9sI7G0K3dt75j2TamPTzXqyicfSc_Tv-N1Oik46X8c'
);

// for signup and signin, save the current user to reduce api calls for actions

async function signUp() {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("pswd-input").value;
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        loginError(error.message);
    }
    else {
        onSignIn();
    }
}

async function signIn() {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("pswd-input").value;
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginError(error.message);
    }
    else {
        currentUser = data.user;
        signedIn = true;
        onSignIn();
    }
}

function onSignIn() { // what happens after a successful sign in 
    const error = document.getElementById("login-error");
    error.style.display = "none";
    closeModal();

    // change button from sign up/sign in to logout
    const button = document.getElementById("account-button");
    button.innerHTML = "Log out";
    button.setAttribute("onclick", "logOut()");

    tasksfromDB();
}

function loginError(msg) {
    const error = document.getElementById("login-error");
    error.innerHTML = msg;
    error.style.display = "block";
}

function displayModal() {
    const modal = document.getElementById("sign-in-modal");

    modal.style.display = "block";
}

window.onclick = function(event) {
    const modal = document.getElementById("sign-in-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function closeModal() {
    const modal = document.getElementById("sign-in-modal");

    modal.style.display = "none";
}

async function logOut() {
    var { error } = await supabaseClient.auth.signOut();

    if (!error) {
        currentUser = null;
        signedIn = false;
    }

    // change logout button back to sign in/sign up
    const button = document.getElementById("account-button");
    button.innerHTML = "Sign In/Sign Up";
    button.setAttribute("onclick", "displayModal()");
}

//-----------------------------------------------------------------------------------------------------//
// endregion

// region Document Load
//-----------------------------------------------------------------------------------------------------//

// when the document loads, it needs to put in all the tasks that were saved
document.addEventListener("DOMContentLoaded", function () {
    checkSignIn();
});

async function checkSignIn() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
        currentUser = session.user;
        signedIn = true;
        onSignIn();
    } else {
        createSavedTasks();
    }
}

//-----------------------------------------------------------------------------------------------------//
// endregion

// region Add Task Button
//-----------------------------------------------------------------------------------------------------//

// needed for the next couple functions
var inputSpan;
var button;
var input;

// change add task button to text input when it is clicked
function addTaskClicked() {
    button = document.getElementById("add-task-button");

    inputSpan = document.createElement('span');
    inputSpan.classList = 'input-wrapper';
    inputSpan.id = 'input-span';
    // create input element
    input = document.createElement('input');
    input.placeholder = "New Task";
    input.id = "new-task-input";
    input.type = "text";

    // change button to input 
    button.replaceWith(inputSpan);
    inputSpan.appendChild(input);
    input.focus();

    // add close button for cancelations
    const close = document.createElement('i');
    close.setAttribute('data-feather', 'x');
    close.id = 'close-new-task';
    close.classList = 'icon';
    close.setAttribute('onclick', 'closeNewTask()');
    inputSpan.insertAdjacentElement('afterend', close);

    // add search icon
    const plus = document.createElement('i');
    plus.setAttribute('data-feather', 'plus');
    plus.id = "add-icon";
    plus.classList = "icon";
    plus.setAttribute('onclick', 'addTask()');
    input.insertAdjacentElement('afterend', plus);

    // make it so that the enter button adds the task
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });

    feather.replace();
}

// add new task to incomplete using text input when the enter key is pressed on the input field
function addTask() {
    // create the checkbox and label for the new task
    const text = input.value;
    const task =  createTask(idNum, text);
    const checkbox = task.firstChild;
    checkbox.setAttribute('onclick', 'completed(this)');
    // add to incomplete
    const incompleteDiv = document.getElementById('incomplete-div');
    incompleteDiv.appendChild(task);
    incompleteDiv.appendChild(createBr(idNum));
    
    // change input back to button
    closeNewTask();
    idNum++;

    // save task
    const label = task.children[1];
    insertTask(idNum-1, label.innerHTML, false);
}

function closeNewTask() {
    document.getElementById('close-new-task').remove();
    inputSpan.replaceWith(button);
}
//-----------------------------------------------------------------------------------------------------//
// end region

// region Task Creation
//-----------------------------------------------------------------------------------------------------//
// creates a task span
function createTask(id, text) {
    const task = document.createElement('span');
    task.id = id;
    task.classList.add('task-span', 'border', 'border-secondary', 'rounded', 'pt-2');

    // checkbox, label, remove, and edit appending to the span
    task.appendChild(createCheckbox(id));
    task.appendChild(createLabel(id, text));
    task.appendChild(createRemove(id));
    task.appendChild(createEdit(id));

    return task;
}

// creates a task checkbox
function createCheckbox(id) {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = id + "checkbox";
    checkbox.value = id + "checkbox";

    return checkbox;
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
    remove.classList.add('icon', 'task-icon');
    remove.setAttribute('onclick', 'removeTask(this)');
    return remove;
}

// creates unique edit button
function createEdit(id) {
    const edit = document.createElement('i');
    edit.setAttribute('data-feather', 'edit-2');
    edit.id = id + "edit";
    edit.classList.add('icon', 'task-icon');
    edit.setAttribute('onclick', 'editTask(this)');
    return edit;
}
//-----------------------------------------------------------------------------------------------------//
// endregion

// region Task Actions
//-----------------------------------------------------------------------------------------------------//
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
    orderTasks(complete, task, br);

    label = task.children[1];
    updateTask(task.id, label.innerHTML, true);
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
    orderTasks(incomplete, task, br);

    label = task.children[1];
    updateTask(task.id, label.innerHTML, false);
}

// function to help with adding to incomplete and complete divs in the correct order
function orderTasks(div, task, br) {
    if (div.children.length == 0) {
        div.appendChild(task);
        div.appendChild(br);
    } else {
        for (child of div.children) {
            if (task.id < child.id) {
                child.insertAdjacentElement('beforebegin', task);
                task.insertAdjacentElement('afterend', br);
                return;
            }
        }
        div.appendChild(task);
        div.appendChild(br);
    }
}

// removes task from list and localstorage
function removeTask(button) {
    const task = button.parentNode;
    let br = document.getElementById(task.id + 'br');
    task.parentNode.removeChild(br);
    task.parentNode.removeChild(task);
    deleteTask(task.id);
}

// allows the user to edit an already made task
function editTask(button) {
    const task = button.parentNode;
    label = task.children[1];
    label.setAttribute('contenteditable', 'true'); 
    label.focus();
    label.htmlFor = "";

    // make it so that the enter button saves the task and is noneditable
    label.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            label.setAttribute('contenteditable', 'false');
            label.htmlFor = task.id + "checkbox";

            const completed = JSON.parse(localStorage.getItem(task.id)).completed;
            updateTask(task.id, label.innerHTML, completed);
        }
    });
}

//-----------------------------------------------------------------------------------------------------//
// endregion

// region Save Tasks
//-----------------------------------------------------------------------------------------------------//

function insertTask(sort_order, text, completed) {
    saveTaskLocal(sort_order, text, completed);
    if (signedIn)
    {
        insertTaskDB(sort_order, text, completed);   
    }
}

function deleteTask(sort_order) {
    localStorage.removeItem(sort_order);
    if (signedIn) {
        deleteTaskDB(sort_order);
    }
}

function updateTask(sort_order, text, completed) {
    saveTaskLocal(sort_order, text, completed);
    if (signedIn) {
        updateTaskDB(sort_order, text, completed);
    }
}

//-----------------------------------------------------------------------------------------------------//
// endregion


// region Local Storage
//-----------------------------------------------------------------------------------------------------//

// creates the saved tasks when the document loads
function createSavedTasks() {
    const size = localStorage.getItem("size");

    for (let i = 0; i < size; i++) { 
        const jsonObject = JSON.parse(localStorage.getItem(i));
        if (jsonObject == null) {
            continue;
        }

        localStorage.removeItem(i); // removes old jsonObject in case the new IDNumber is over the total number of tasks
        const id = idNum; // uses the new id to condense id numbers
        const text = jsonObject.text;
        const completed = jsonObject.completed;

        // create task and label
        const task = createTask(id, text);
        const checkbox = task.firstChild;

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

        idNum++; // increases the new ID for the next avaiable task
        saveTaskLocal(id, text, completed); // makes sure the task is saved under the new id
    }
}

// saves task into local storage
function saveTaskLocal(id, text, completed) {
    const jsonObject = {
        "idNumber" : id,
        "text" : text,
        "completed" : completed
    };

    localStorage.setItem(id, JSON.stringify(jsonObject));
    localStorage.setItem("size", idNum);

    feather.replace();
}

//-----------------------------------------------------------------------------------------------------//
// endregion

// region Supabase
//-----------------------------------------------------------------------------------------------------//
async function tasksfromDB() {
    // clear tasks
    const incomplete = document.getElementById("incomplete-div");
    incomplete.innerHTML = '';
    const complete = document.getElementById("complete-div");
    complete.innerHTML = '';

    // get the tasks from supabase
    const { data: tasks, error } = await supabaseClient
        .from('tasks')
        .select("*")
        .eq('user_id', currentUser.id)

    // add the tasks into the page
    for (var i = 0; i < tasks.length; i++)
    {
        const task = tasks[i];

        if (i != task.sort_order) { // fixes any holes in the order 
            task.sort_order = i;
            updateTaskDB(task.sort_order, task.task, task.is_complete)
        }

        const taskElement = createTask(task.sort_order, task.task);
        const checkbox = taskElement.firstChild;

        if (task.is_complete) {
            checkbox.setAttribute('onclick', 'incomplete(this)');
            checkbox.checked = true;
            complete.appendChild(taskElement);
            complete.appendChild(createBr(task.sort_order));
            
        } else { // put in incomplete div
            checkbox.setAttribute('onclick', 'completed(this)');
            incomplete.appendChild(taskElement);
            incomplete.appendChild(createBr(task.sort_order));
        }
    }

    idNum = tasks.length;

    feather.replace();
}

async function insertTaskDB(sort_order, text, completed) {

    const { data, error } = await supabaseClient
        .from('tasks')
        .insert([{ task: text, user_id: currentUser.id, is_complete: completed, sort_order: sort_order }])
        .select();
}

async function deleteTaskDB(sort_order) {

    const { error } = await supabaseClient
        .from('tasks')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('sort_order', sort_order);
}

async function updateTaskDB(sort_order, text, completed) {

    const { data, error } = await supabaseClient
        .from('tasks')
        .update({ task: text })
        .eq('user_id', currentUser.id)
        .eq('sort_order', sort_order)
        .select();

    const { completedData, completedError } = await supabaseClient
        .from('tasks')
        .update({ is_complete: completed })
        .eq('user_id', currentUser.id)
        .eq('sort_order', sort_order)
        .select();
}

//-----------------------------------------------------------------------------------------------------//
// endregion