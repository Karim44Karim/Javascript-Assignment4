var userNameIn = document.getElementById("userName");
var emailIn = document.getElementById("email");
var passwordIn = document.getElementById("password");
var signUpBtn = document.getElementById("signUpBtn");
var emailLogIn = document.getElementById("email-login");
var passwordLogIn = document.getElementById("password-login");
var signInBtn = document.getElementById("signInBtn");
var signOutBtn = document.getElementById("signOutBtn");
var userIdMax;
var welcomeMessageElement = document.getElementById("welcomeMessageElement");
var signUpview = document.getElementById("signUpView");
var signInview = document.getElementById("signInView");
var home = document.getElementById("homeView");
var views = [home, signUpview, signInview];
var currentView;


var PRODUCT_KEY = "users";
var PATTERNS = {
    userName: /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/,
    email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    password:  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};


if(localStorage.getItem(PRODUCT_KEY) == null){
    var users = [];
}else{
    var users = JSON.parse(localStorage.getItem(PRODUCT_KEY));
    if(localStorage.getItem("currentUser") == null){
        var currentUser;
        showView(signInview);
    } else{
        var currentUser = JSON.parse(localStorage.getItem("currentUser"))
        welcomeMessageElement && (welcomeMessageElement.textContent = "Welcome " + currentUser.name);
        showView(home);
    }
}

function showView(view){
    currentView = view;
    for (var i=0; i<views.length; i++){
        if(views[i] == view){
            views[i].style.display = "block";
        }
        if(views[i]!=view){
            views[i].style.display = "none";
        }
    }
}


signUpBtn?.addEventListener('click', signUp);
signInBtn?.addEventListener('click', signIn);
signOutBtn?.addEventListener('click', signOut);

userNameIn?.addEventListener("input", function(){
    validateInput("userName",userNameIn);
    if(validateInput("userName",userNameIn)){
        checkNewName(userNameIn);
    } else{
        showNameAlertMessage("Username must be: At least two characters, statrs with a letter, and no special characters allowed except for \"_\"");
    }
})
emailIn?.addEventListener("input", function(){
    validateInput("email",emailIn);
    if(validateInput("email",emailIn)){
        checkNewEmail(emailIn);
    } else{
        showEmailAlertMessage("Please Enter a valid Email");
    }
})
passwordIn?.addEventListener("input", function(){
    validateInput("password", passwordIn);
    if(validateInput("password", passwordIn)){
    showPasswordAlertMessage(""); 
    }else{
    showPasswordAlertMessage("Password must be: minimum eight characters, at least one letter and one number!"); 
    }
})

emailLogIn?.addEventListener("input", function(){
    validateInput("email",emailLogIn);
    if(validateInput("email",emailLogIn)){
        checkRegisteredEmail(emailLogIn);
    } else{
        showEmailAlertMessage("Please Enter a valid Email");
    }
})
passwordLogIn?.addEventListener("input", function(){
    validateInput("password", passwordLogIn);
    if(validateInput("password", passwordLogIn)){
    showPasswordAlertMessage(""); 
    }else{
    showPasswordAlertMessage("Password must be: minimum eight characters, at least one letter and one number!"); 
    }
})


function clearInputs(){
    userNameIn && (userNameIn.value = "");
    emailIn && (emailIn.value = "");
    emailLogIn && (emailLogIn.value = "");
    passwordIn && (passwordIn.value = "");
    passwordLogIn && (passwordLogIn.value = "");
    userNameIn && (userNameIn.classList.remove("is-valid","is-invalid"));
    emailIn && (emailIn.classList.remove("is-valid","is-invalid"));
    emailLogIn && (emailLogIn.classList.remove("is-valid","is-invalid"));
    passwordIn && (passwordIn.classList.remove("is-valid","is-invalid"));
    passwordLogIn && (passwordLogIn.classList.remove("is-valid","is-invalid"));
}

function validateInput(key, inputElement){

    var pattern = PATTERNS[key];
    var inputValue = inputElement.value;
    var isMatched = pattern.test(inputValue);

    if (isMatched){
        inputElement.classList.add("is-valid");
        inputElement.classList.remove("is-invalid");
        return true;
    } else{
        inputElement.classList.remove("is-valid");
        inputElement.classList.add("is-invalid");
        return false;
    }
}

function signUp(){
    userIdMax+=1;

    var newUser = {
        name: userNameIn.value,
        email: emailIn.value,
        password: passwordIn.value,
        id: userIdMax,
    }

    var isUserNameValid = validateInput("userName", userNameIn);
    var isEmailValid = validateInput("email", emailIn);
    var isPasswordValid = validateInput("password", passwordIn);

    var isNewEmail = isEmailValid && checkNewEmail(emailIn);
    var isNewName = isUserNameValid && checkNewName(userNameIn);

    
    if(isUserNameValid && isEmailValid && isPasswordValid && isNewEmail && isNewName){
        users.push(newUser);
        localStorage.setItem(PRODUCT_KEY, JSON.stringify(users));
        alertify.notify('Sucess!', 'success', 5, function(){  console.log('dismissed'); });
        clearInputs();
        showView(signInview);
    } else {
        if (!isUserNameValid || !isEmailValid || !isPasswordValid) {
            showAlertMessage("danger", "Please ensure all fields are valid and meet their requirements.");
            alertify.notify('Please ensure all fields are valid and meet their requirements.', 'error', 5, function(){  console.log('dismissed'); });

        } else if (!isNewEmail) {
            showAlertMessage("danger", "Email already registered!");
            alertify.notify('Email already registered!', 'error', 5, function(){  console.log('dismissed'); });
        } else if (!isNewName) {
            showAlertMessage("danger", "Username already taken!");
            alertify.notify('Username already taken!', 'error', 5, function(){  console.log('dismissed'); });
        } else {
            showAlertMessage("danger", "Not all inputs meet their requirements!");
            alertify.notify('Not all inputs meet their requirements!', 'error', 5, function(){  console.log('dismissed'); });
        }
    }
}

function signIn(){
    if(checkRegisteredUser(emailLogIn) != -1){
        currentUser = checkRegisteredEmail(emailLogIn);
        currentUser.signedIn = true;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        clearInputs();
        showView(home);
        welcomeMessageElement && (welcomeMessageElement.textContent = "Welcome " + currentUser.name);
        alertify.notify('Logged in successfully', 'success', 5, function(){  console.log('dismissed'); });
        } else if(checkRegisteredEmail(emailLogIn).email){
            showAlertMessage("danger","Invalid password!");
            alertify.notify('Invalid passowrd', 'error', 5, function(){  console.log('dismissed'); });
        } else {
            showAlertMessage("danger","Invalid Email!");
            alertify.notify('Invalid Email', 'error', 5, function(){  console.log('dismissed'); });
        }
}
function signOut(){
    clearInputs();
    localStorage.removeItem("currentUser");
    showView(signInview);
}

function checkNewEmail(userEmail){
    for(var i=0; i<users.length; i++){
        if(userEmail.value == users[i].email){
            userEmail.classList.add("is-invalid");
            userEmail.classList.remove("is-valid");
            showEmailAlertMessage("Email already registered!");
            return false;
        }
    }
    userEmail.classList.add("is-valid");
    userEmail.classList.remove("is-invalid");
    showEmailAlertMessage("");

    return true;
}
function checkRegisteredEmail(userEmail){
    for(var i=0; i<users.length; i++){
        if(userEmail.value == users[i].email){
            userEmail.classList.add("is-valid");
            userEmail.classList.remove("is-invalid");
            showEmailAlertMessage("");
            return users[i];
        }
    }
    userEmail.classList.add("is-invalid");
    userEmail.classList.remove("is-valid");
    showEmailAlertMessage("Email not registered. Please signup first!");

    return -1;
}
function checkRegisteredPassword(testPassword){
    for(var i=0; i<users.length; i++){
        if(testPassword.value == users[i].password){
            return users[i];
        }
    }
    return -1;
}

function checkRegisteredUser(userEmail){
    for(var i=0; i<users.length; i++){
        if(userEmail.value == users[i].email){
            userEmail.classList.add("is-valid");
            userEmail.classList.remove("is-invalid");
            showEmailAlertMessage("");
            if(passwordLogIn.value == users[i].password){
                return true;
            }
        }
    }
    return -1;
}
function checkNewName(userName){
    for(var i=0; i<users.length; i++){
        if(userName.value == users[i].name){
            userName.classList.add("is-invalid");
            userName.classList.remove("is-valid");
            showNameAlertMessage("Username already taken!");
            return false;
        }
    }
    userName.classList.remove("is-invalid");
    userName.classList.add("is-valid");
    showNameAlertMessage("");
    return true;
}


function showAlertMessage(type, message){
    var alertMessage = document.querySelector("#"+currentView.id+" .alert-message");
    if(type=="success"){
        alertMessage.classList.remove("text-danger");
        alertMessage.classList.add("text-success");
    } else if(type=="danger"){
        alertMessage.classList.remove("text-sucess");
        alertMessage.classList.add("text-danger");
    }
    alertMessage.innerText = message;
}
function showNameAlertMessage(message){
    var nameAlertMessage = document.querySelector("#"+currentView.id+" .name-alert-message");
    nameAlertMessage.innerText = message;
}
function showEmailAlertMessage(message){
    var emailAlertMessage = document.querySelector("#"+currentView.id+" .email-alert-message");
    emailAlertMessage.innerText = message;
}
function showPasswordAlertMessage(message){
    var passwordAlertMessage = document.querySelector("#"+currentView.id+" .password-alert-message");
    passwordAlertMessage.innerText = message;
}




