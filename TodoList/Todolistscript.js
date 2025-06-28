let todos = [];
document.addEventListener("DOMContentLoaded", () => {
    loadingTodos();
    addbutton();
    turnoffLinght();
    document.getElementById("todoInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            entertext();
        }
    });
});

//loading the localStorage
function loadingTodos() {
    save = JSON.parse(localStorage.getItem("todos"));
    if (Array.isArray(save)) {
        todos = save;
        render();
    }
}

//save to the localStorage
function saveTodo() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

//click the addbutton action
function addbutton() {
    const addbutton = document.getElementById("addTodo");
    addbutton.addEventListener("click", entertext);
}

//user key text 
function entertext() {
    const enter = document.getElementById("todoInput");
    const input = enter.value.trim();
    
    if (input != "") {
        todos.push({text: input, completed: false});
        render();
        saveTodo();
        enter.value = "";
    }
}

//render the page
function render() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    
    if (todos.length === 0) {
        const not = document.createElement("p");
        not.innerText = "do some thing...";
        not.style.color = "#aaa";
        list.appendChild(not);
    }
    todos.forEach((usertodo, index) => {
        const newItem = document.createElement("li");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.margin = "10px";
        checkbox.checked = usertodo.completed;
        
        const textnode = document.createTextNode(usertodo.text);
        
        const deletebutton = document.createElement("button");
        deletebutton.innerText = "delete";
        deletebutton.style.margin = "10px";
        
        checkbox.addEventListener("change", function(){
            todos[index].completed = checkbox.checked;
            render();
            saveTodo();
        });
        
        deletebutton.addEventListener("click", function(){
            todos.splice(index, 1);
            render();
            saveTodo();
        });
        
        if (usertodo.completed) newItem.classList.add("completed")
            
            newItem.appendChild(checkbox);
            newItem.appendChild(textnode);
            newItem.appendChild(deletebutton);
            list.appendChild(newItem);
    });
        
    checkall();
    clearFinish();
    deleteAll();
}
    
    //check all
function checkall() {
    const check = document.getElementById("checkAll")
        
    if (todos.length > 0 && todos.every(c => c.completed)) {
        check.checked = true;
    }else{
        check.checked = false;
    }
        
    check.addEventListener("change", ()=> {
        todos.forEach(c => {
            c.completed = check.checked;
        });
        render();
        saveTodo();
    });
}

//clear the finish list
function clearFinish() {
    document.getElementById("clear").addEventListener("click", () => {
        todos = todos.filter(todo => !todo.completed);
        render();
        saveTodo();
    });
}

//delete the list
function deleteAll() {
    document.getElementById("deleteList").addEventListener("click", () => {
        todos = [];
        render();
        saveTodo();
    });
}

//change page theme
function turnoffLinght() {
    const mode = document.getElementById("mode")
    document.getElementById("Theme").addEventListener("click", () => {
        if (mode.classList.contains("darkmode")){
            mode.classList.remove("darkmode");
        }else{
            mode.classList.add("darkmode");
        }
    });
}