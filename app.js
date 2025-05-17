var button;
var input;
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
        console.log('Error', error.message);
    }
    else {
        console.log('Successfully signed up:', data);
        // added for security, because supabase marks new sign ups as "successful" even if the user is already in the system
        console.log(error);
        onSignUp();
    }
}

// elements needed in the next 2 functions
var emailPass;
var modBtns;
var modalContent;
var header;
var messageDiv;
var btnDiv;
var btn;

function onSignUp() {
    // change the modal content so that it displays the message and an "I understand" button
    // store originial content
    emailPass = document.getElementById("email-pswd");
    modBtns = document.getElementById("modal-buttons");
    // delete unwanted elements
    modalContent = document.getElementById("sign-in-content");
    modalContent.removeChild(emailPass);
    modalContent.removeChild(modBtns);
    // create and display message
    header = document.createElement('h3');
    header.id = 'sign-up-message-header';
    header.innerHTML = "Heads Up!"
    modalContent.appendChild(header);

    messageDiv = document.createElement('div');
    messageDiv.id = 'sign-up-message-div'
    messageDiv.innerHTML = "If this is your first time signing up, check your inbox for a confirmation email. If you've signed up before, just log in instead.";
    modalContent.appendChild(messageDiv);
    // create and display button
    btnDiv = document.createElement('div');
    btnDiv.id = 'understand-button-div';
    btn = document.createElement('button');
    btn.setAttribute('onclick', 'understand()');
    btn.className = "btn btn-sm buttons";
    btn.innerHTML = "I understand";
    btnDiv.appendChild(btn);
    modalContent.appendChild(btnDiv);
}

function understand() {
    modalContent.removeChild(header);
    modalContent.removeChild(messageDiv);
    modalContent.removeChild(btnDiv);
    modalContent.removeChild(btn);

    modalContent.appendChild(emailPass);
    modalContent.appendChild(modBtns);
}

async function signIn() {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("pswd-input").value;
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.log('Error', error.message);
    }
    else {
        console.log('Successfully signed in:', data);
        currentUser = data.user;
        signedIn = true;
        onSignIn();
    }
}

function onSignIn() { // what happens after a successful sign in 
    closeModal();

    // change button from sign up/sign in to logout
    const button = document.getElementById("account-button");
    button.innerHTML = "Log out";
    button.setAttribute("onclick", "logOut()");
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

    if (error) {
        console.log('Error', error.message);
    }
    else {
        console.log('Successfully logged out');
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
    createSavedTasks();

    checkSignIn();
});

async function checkSignIn() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user != null) {
        currentUser = user;
        signedIn = true;
        onSignIn();
    }
}

//-----------------------------------------------------------------------------------------------------//
// endregion

// region Add Task Button
//-----------------------------------------------------------------------------------------------------//
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
    if (signedIn) {
        insertTaskSupa(task.id, label.innerHTML, false);
    } else {
        saveTaskLocal(task.id, label.innerHTML, false);
    }
    
}
//-----------------------------------------------------------------------------------------------------//
// end region

// region Task Creation
//-----------------------------------------------------------------------------------------------------//
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
    remove.classList.add('icon');
    remove.setAttribute('onclick', 'removeTask(this)');
    return remove;
}

// creates unique edit button
function createEdit(id) {
    const edit = document.createElement('i');
    edit.setAttribute('data-feather', 'edit-2');
    edit.id = id + "edit";
    edit.classList.add('icon');
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
    complete.appendChild(task);
    complete.appendChild(br);

    label = task.children[1];
    saveTaskLocal(task.id, label.innerHTML, true);
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
    saveTaskLocal(task.id, label.innerHTML, false);
}

// removes task from list and localstorage
function removeTask(button) {
    const task = button.parentNode;
    let br = document.getElementById(task.id + 'br');
    task.parentNode.removeChild(br);
    task.parentNode.removeChild(task);
    localStorage.removeItem(task.id);
}

// allows the user to edit an already made task
function editTask(button) {
    const task = button.parentNode;
    label = task.children[1];
    label.setAttribute('contenteditable', 'true'); 
    label.htmlFor = "";

    // make it so that the enter button saves the task and is noneditable
    label.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            label.setAttribute('contenteditable', 'false');
            label.htmlFor = task.id + "checkbox";

            const completed = JSON.parse(localStorage.getItem(task.id)).completed;
            saveTaskLocal(task.id, label.innerHTML, completed);
        }
    });
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
async function insertTaskSupa(sort_order, text, completed) {

    const { data, error } = await supabaseClient
        .from('tasks')
        .insert([{ task: text, user_id: currentUser.id, is_complete: completed, sort_order: sort_order }])
        .select();

    if (error) {
        console.error('Insert error:', error.message);
    } else {
        console.log('Task added:', data);
        console.log('error: ', error);
    }
}

async function deleteTaskSupa(sort_order) {

    const { error } = await supabaseClient
        .from('tasks')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('sort_order', sort_order);

    if (error) {
        console.error('Deletion error:', error.message);
    } else {
        console.log('Task deleted');
    }
}

//-----------------------------------------------------------------------------------------------------//
// endregion