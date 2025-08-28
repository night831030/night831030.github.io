let todos = [];
document.addEventListener("DOMContentLoaded", () => {
    loadingTodos();
    showResult();
    checkall();
    clearFinish();
    deleteAll();
    // fetchTodosFromServer();
    addButton();
    turnOffLight();
    document.getElementById("todoInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            enterText();
        }
    });
});

//loading the localStorage
function loadingTodos() {
    let save = JSON.parse(localStorage.getItem("todos"));
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
function addButton() {
    const addbutton = document.getElementById("addTodo");
    addbutton.addEventListener("click", enterText);
}

//user key text 
function enterText() {
    const enter = document.getElementById("todoInput");
    const input = enter.value.trim();
    
    if (input != "") {
        todos.push({text: input, completed: false});
        showResult();
        saveTodo();
        enter.value = "";
    }
}

//render the page
function render(item) {
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    if (!item) {
        item = todos
    }

    if (item.length === 0) {
        const not = document.createElement("p");
        not.innerText = "do some thing...";
        not.style.color = "#aaa";
        list.appendChild(not);
    }

    item.forEach((usertodo, index) => {
        const newItem = document.createElement("li");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.margin = "10px";
        checkbox.checked = usertodo.completed;
        
        const newspan = document.createElement("span");
        newspan.textContent = usertodo.text;
        
        const deletebutton = document.createElement("button");
        deletebutton.innerText = "delete";
        deletebutton.style.margin = "10px";
        
        checkbox.addEventListener("change", function(){
            item[index].completed = checkbox.checked;
            showResult();
            saveTodo();
        });

        newspan.addEventListener("dblclick", () => {
            const newnode = document.createElement("input");
            newnode.type = "text";
            newnode.value = newspan.textContent;

            if (newItem.classList.contains("editing")) {
                return;
            }
            newItem.classList.add("editing");

            newItem.replaceChild(newnode, newspan);
            newnode.focus();

            const finishedit = () => {
                const newtext = newnode.value.trim();

                if (newtext === '') {
                    newItem.replaceChild(newspan, newnode);
                    newItem.classList.remove("editing");
                    return;
                }

                newItem.replaceChild(newspan, newnode);
                newspan.textContent = newtext;
                newItem.classList.remove("editing");
                item[index].text = newtext;
                saveTodo();
            };
            
            newnode.addEventListener("blur", finishedit);
            newnode.addEventListener("keydown", (k) => {
                if (k.key === "Enter") {
                    finishedit();
                }
            })
        })
        
        deletebutton.addEventListener("click", function(){
            const realIndex = todos.findIndex(t => t.text === usertodo.text && t.completed === usertodo.completed);
            if (realIndex > -1) {
                todos.splice(realIndex, 1);
                showResult();
                saveTodo();
            }
        });
        
        if (usertodo.completed) newItem.classList.add("completed")
            
            newItem.appendChild(checkbox);
            newItem.appendChild(newspan);
            newItem.appendChild(deletebutton);
            list.appendChild(newItem);
    });
}
    
//check all
function checkall() {
    const check = document.getElementById("checkAll")
        
    if (todos.length > 0 && todos.every(c => c.completed)) {
        check.checked = true;
    }else{
        check.checked = false;
    }
        
    check.addEventListener("change", () => {
        todos.forEach(c => {
            c.completed = check.checked;
        });
        showResult();
        saveTodo();
    });
}

//clear the finish list
function clearFinish() {
    document.getElementById("clear").addEventListener("click", () => {
        todos = todos.filter(todo => !todo.completed);
        showResult();
        saveTodo();
    });
}

//delete the list
function deleteAll() {
    document.getElementById("deleteList").addEventListener("click", () => {
        todos = [];
        showResult();
        saveTodo();
    });
}

//change page theme
function turnOffLight() {
    const mode = document.getElementById("mode")
    document.getElementById("Theme").addEventListener("click", () => {
        mode.classList.toggle("darkmode");
    });
}

//filter and search
let selected;
let keyword;

function showResult() {
    let result = todos

    if (selected === "filter-completed") {
        result = result.filter(todo => todo.completed);
    } else if (selected === "filter-uncompleted"){
        result = result.filter(todo => !todo.completed);
    }

    if (keyword) {
        result = result.filter(todo => todo.text.toLowerCase().includes(keyword));
    }

    render(result);
}

document.getElementById("filter").addEventListener("change", (s) => {
    selected = s.target.value;

    showResult();
})

document.getElementById("searchInput").addEventListener("input", (search) => {
    keyword = search.target.value.toLowerCase();

    showResult();
})

//fetch sevrver
function fetchTodosFromServer() {
  fetch("http://localhost:3000/api/todos")
    .then(re => re.json())
    .then(data => {
      todos = data.map(item => ({
        text: item.text,
        completed: item.completed
      }));
      render();
      console.log("Fetched data from server:", data);
    })
    .catch(error => {
      console.error("Error fetching todos:", error);
    });
}

//fetch dog api
function callDogApi() {
    fetch('https://dog.ceo/api/breeds/image/random')
        .then(re => re.json())
        .then(data => {
            console.log(data);
            document.querySelector('#picture').innerHTML = `<img src="${data.message}" class="picture" alt="dog" />`;
        })
        .catch(err => console.error(err));
}

function callCatApi() {
    fetch('https://cataas.com/cat?json=true')
        .then(re => re.json())
        .then(data => {
            console.log(data);
            document.querySelector('#picture').innerHTML = `<img src="${data.url}" class="picture" alt="cat" />`;
        })
        .catch(err => console.error(err));
}
