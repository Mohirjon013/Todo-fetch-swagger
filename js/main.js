let elTodoList = document.querySelector(".todo-list")
let elInput = document.querySelector(".todo-input")
let elForm = document.querySelector(".todo-form")


let elClearAll = document.querySelector(".clear-all")
let elAllCompleted = document.querySelector(".all-completed")
let elCompleteDelete = document.querySelector(".completed-delete")

let elSelectTask = document.querySelector(".select-task")
let elSearchInput = document.querySelector(".search-input")

let elWrapperModal = document.querySelector(".wrapper-modal")
let elInnerModal = document.querySelector(".inner-modal")
let elModalContent = document.querySelector(".modal-content")



async function getTasks(){
    let tasks = await fetch("http://147.182.216.101:3005/todo?status=all")
    tasks = await tasks.json()
    renderTask(tasks)
}
getTasks()


// render task start
function renderTask(arr){
    elTodoList.innerHTML = null
    arr.forEach((item, index) => {
        let elItem = document.createElement("li")
        elItem.className = "flex items-center gap-5 justify-between p-[13px] border border-[#D9D9D9]"
        
        elItem.innerHTML += `
            <div class="flex items-start gap-2 flex-1 ">
                <span class="block font-black text-[14px] mt-[3px] flex-shrink-0">${index + 1}.</span>
                <p class="text-[16px] block">${item.text}</p>
                               
            </div>
                            
            <div class="contain-btn max-w-[190px] flex items-center gap-[10px]">
                <button onclick="handleDeleteBtn(${item.id})" type="button" class="delete-btn hover:scale-125 duration-300 cursor-pointer">
                    <img class="pointer-events-none" src="./images/delete-icon.svg" alt="delete-icon" width="20" height="20">
                </button>
                <button onclick="handleUpdateBtn(${item.id})" class="update-btn hover:scale-125 duration-300 cursor-pointer">
                    <img class="pointer-events-none" src="./images/update-icon.svg" alt="update-icon" width="20" height="20">
                </button>
                <button onclick="handleCompleteBtn(${item.id})" class="hover:scale-125 duration-300 cursor-pointer ${item.completed ? "hidden" : "block"}">
                    <img src="./images/complete-icon.svg" alt="complete-icon" width="20" height="20">
                </button>
                <button onclick="handleCompleteBtn(${item.id})" class="w-[20px] h-[20px] bg-[#05FF00] rounded-full hover:scale-125 duration-300 cursor-pointer ${item.completed ? "block" : "hidden"}"></button>
            </div>
        `
        
        elTodoList.append(elItem)
    })
}
// render task end


// add task start
async function addTasks(e){
    e.preventDefault()
    
    if (!elInput.value.trim()) return

    const data = {
        text: elInput.value.trim()
    }
    let newTask = await fetch("http://147.182.216.101:3005/todo", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
    
    getTasks()
    
    elInput.value = ''
}
elForm.onsubmit = addTasks
// add task end


// delete task start
async function handleDeleteBtn(id){
    let deleteTask = await fetch("http://147.182.216.101:3005/todo/" + id, {
        method:"DELETE"
    })
    
    getTasks()
}
// delete task end


// update start
async function handleUpdateBtn(id){
    elWrapperModal.classList.remove("scale-0")
    
    let taskData = await fetch("http://147.182.216.101:3005/todo?status=all")
    taskData = await taskData.json()
    
    let singleData = taskData.find(item => item.id === id)
    elModalContent.innerHTML = `
        <form class="update-form sm:max-w-[600px] max-w-[350px] sm:px-[30px] px-[20px]">
                    <label>
                        <input class="update-input w-full sm:py-[11px] py-[5px] sm:px-[15px] px-[10px] rounded-lg border-[2px] border-[#32A3FE] outline-none placeholder:text-[#32A3FE]" type="text" value="${singleData.text}" name="user_updated" placeholder="Update your note..." autocomplete="off">
                    </label>
    
                    <div class="flex items-center justify-between sm:mt-[40px] mt-[40px]">
                        <button onclick="handleCancelModal()" class=" sm:w-[100px] w-[80px] sm:py-[10px] py-[7px] rounded-lg hover:bg-[#32A3FE] hover:text-white duration-500 border-[2px] border-[#32A3FE] text-[#32A3FE] cursor-pointer" type="button">Cancel</button>
                        <button class="sm:w-[100px] w-[80px] sm:py-[10px] py-[7px] rounded-lg hover:bg-transparent hover:text-[#32A3FE] duration-500 bg-[#32A3FE] border-[2px] border-[#32A3FE] text-white cursor-pointer" type="submit">Apply</button>
                    </div>
        </form>  
    `
    let elFormUpdate = document.querySelector(".update-form")
    
    elFormUpdate.addEventListener("submit", async function(e){
        e.preventDefault()
        
        const updateInput = document.querySelector(".update-input")
        const newData = {
            "text": updateInput.value,
            "completed": singleData.completed
        }
        
        await fetch(`http://147.182.216.101:3005/todo/${id}`, {
            method:"PATCH", 
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newData)
        })
        
        
        
        elWrapperModal.classList.add("scale-0")
        getTasks()
        
    })
}

elWrapperModal.addEventListener("click", function(e){
    if(e.target.id == "wrapper"){
        elWrapperModal.classList.add("scale-0")
    }
})
function handleCancelModal(){
    elWrapperModal.classList.add("scale-0")
}
// update end


// complete task start
async function handleCompleteBtn(id){
    await fetch(`http://147.182.216.101:3005/todo/${id}/toggle`, {
        method:"PATCH"
    })
    getTasks()
}
// complete task end


// delete allTask start
elClearAll.addEventListener("click", function(e){
    async function deleteAllTask() {
        await fetch("http://147.182.216.101:3005/todo/deleteAllTask", {
            method:"DELETE"
        })
        getTasks()
        
    }
    deleteAllTask()
})
// delete allTask end


// all completed start 
elAllCompleted.addEventListener("click", function(){
    async function allCompletedTask() {
        await fetch("http://147.182.216.101:3005/todo/completedAll", {
            method:"PATCH"
        })
        getTasks()
    }
    allCompletedTask()
})
// all completed end 


// complete delete start 
elCompleteDelete.addEventListener("click", (e) => {
    async function completeDelete() {
        await fetch("http://147.182.216.101:3005/todo/deleteCompleted", {
            method:"DELETE"
        })
        getTasks()
    }
    completeDelete()
})
// complete delete end 




// select task start
elSelectTask.addEventListener("change", function(e){
    const selectValue = e.target.value
    async function selectTask(){
        let selectedTasks = await fetch(`http://147.182.216.101:3005/todo?status=${selectValue}`)
        selectedTasks = await selectedTasks.json()
        renderTask(selectedTasks)
    }
    selectTask()
})
// select task start


// search input start
elSearchInput.addEventListener("keyup", (e) => {
    const searchValue = e.target.value
    
    if(searchValue){
        async function searchTask() {
            let searchedAllTask = await fetch(`http://147.182.216.101:3005/todo?search=${searchValue}&status=all`)
            searchedAllTask = await searchedAllTask.json()
            
            if(searchedAllTask.length > 0){
                renderTask(searchedAllTask)
                
            }  
        }
        searchTask()
    }
    else{
        getTasks()
    }
})
// search input end