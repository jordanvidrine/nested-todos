//current issues:
//cant nest more than one tabbed todo

//cant toggle subTodos

var todoInput = document.getElementById("todo-input");
$("#add-todo-btn").on('click',addTodo)
$("#todos").on('click','#delete-todo-btn', deleteTodo)
$("#todos").on('click', '#complete-todo', toggleTodo)
$('.filter').on('change', filterTodos)
//$('.footer').on('click','.clear-completed',clearCompleted)
$('#todos').on('click',"#add-sub-todos-btn", addSubTodo)


var todos = store('stored-todos');



function addTodo(){
  todos.push({
    id: uid(),
    title: todoInput.value,
    completed: false,
    subTodos: [],
  })
  store('stored-todos', todos);
  render(todos);
  $("#todo-input").focus()
}

// todo.subTodos.push({
//   id: uid(),
//   title: todoInput.value,
//   completed: false,
//   subTodos: [],
// })

function addSubTodo(e){
  let id= e.target.parentElement.id;
  todos = addSubTodoInPlace(todos, id, todoInput.value);
  store('stored-todos', todos);
  render(todos);
  $("#todo-input").focus()
}

function addSubTodoInPlace(todo,id,text) {
  //checks if an array was passed
  if (Array.isArray(todo)) {
    return todo.map(element => {
      //checks if the element of the Todos has subTodos
      if (element.subTodos.length) {
        //if so, also check if this element is the one to add a subTodo to then return it
        if (element.id === id) {
          element.subTodos.push({
            id: uid(),
            title: text,
            completed: false,
            subTodos: [],
          });
          return element;
        //if not, then cycle through the subTodos
        } else {
          element.subTodos = addSubTodoInPlace(element.subTodos,id,text);
          return element;
        }
      //if the element does not have subTodos, then check the element itself to see if this is the element to add a subTodo to
      } else {
        if (element.id === id) {
          element.subTodos.push({
            id: uid(),
            title: text,
            completed: false,
            subTodos: [],
          });
          return element;
        } else {
          return element;
        }
      }
    })
  } else {
    if (todo.id === id) {
      todo.subTodos.push({
        id: uid(),
        title: text,
        completed: false,
        subTodos: [],
      });
      return todo;
    } else {
      return todo;
    }
  }
}

function deleteTodo(e) {
  let id = e.target.parentElement.id;
  console.log(id);
  todos = deleteInPlace(todos,id);
  store('stored-todos', todos);
  render(todos);
}

function deleteInPlace(todos, id) {
  if(Array.isArray(todos)) {
    return todos.filter(todo => {
      if (todo.subTodos.length) {
        todo.subTodos = deleteInPlace(todo.subTodos,id);
        return todo.id != id;
      } else {
        return todo.id != id;
      }
    })
  } else {
    return todos.id != id;
  }
}

function toggleTodo(e) {
  let id = e.target.parentElement.id;
  todos = toggleInPlace(todos,id);
  store('stored-todos', todos);
  render(todos);
}

function toggleInPlace(todos, id) {
  if (Array.isArray(todos)) {
    return todos.map(todo => {
      if (todo.subTodos.length) {
        toggleInPlace(todo.subTodos,id);
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      } else {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      }
    });
  } else {
    if (todos.id === id) {
      todos.completed = !todos.completed;
    }
    return todos;
  }
}

function clearCompleted() {
  todos = todos.filter(e => !e.completed);
  store('stored-todos', todos);
  render(todos)
}

function filterTodos(e){
  let filteredTodos;
  //create a new local array of todos based on radio button clicked
  if (e.target.value == "show-completed") {
    filteredTodos = todos.filter(e => e.completed == true);
  } else if (e.target.value == "show-all") {
    filteredTodos = todos;
  }
  else {
    filteredTodos = todos.filter(e => e.completed == false);
  }
  //render the filtered todos, but do not store it
  render(filteredTodos);
}

//taken from todoMVC
function store(namespace, data) {
  if (arguments.length > 1) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  } else {
    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }
}

function render(todos) {
  if (todos.length == 0) {
    $("#todos").html('');
    todoInput.value = '';
    return;
  }
  $("#todos").html(todoParser(todos));
  todoInput.value = '';
}

//current issue is that once this functions recurses down to an element, it stops checking to see if
//there are subTodos

function todoParser(arr) {
    return arr.reduce(function(accumulator,currentValue,idx) {
            //add the current element to the accumulator html as the first LI tag
            //accumulator += `<li>${currentValue.title}</li>`;
            accumulator += todoCreator(currentValue);
            //check if the current element has subTodos
            if (currentValue.subTodos.length) {
              //if it does, recurse through the subTodo array
              accumulator += todoParser(currentValue.subTodos);
              //once thats done, check if this is the last element of its array
              //if it is, add a closing UL tag to end the section
			        if (idx == arr.length - 1) {
              	accumulator += `</ul>`;
              	return accumulator;
              } else {
	                return accumulator;
			          }
            } //if current element does NOT have subTodos, just check if its the last element
              //and add a closing UL tag, if not, return the accumulator
              else {
  			        if (idx == arr.length - 1) {
                	accumulator += `</ul>`;
                	return accumulator;
                } else {
                	return accumulator;
				          }
              }
        }, '<ul>')

}

function todoCreator(todo) {
  let completed = todo.completed ? "class='todo completed'" : "class='todo'"
  let completeTodoButton = `<button id="complete-todo">`;
  if (todo.completed) {
    completeTodoButton += `(*)</button>`
    //only inserts button IF subTodos are all complete or non-existant
  } else if (todo.subTodos.filter(e=>e.completed).length === todo.subTodos.length) {
    completeTodoButton += `()</button>`
  } else {
    completeTodoButton = '';
  }
  return (
  `<li id="${todo.id}" ${completed}>` +
    `${completeTodoButton} ${todo.title} ` +
    `<button id="delete-todo-btn">remove</button>` +
    `<button id="add-sub-todos-btn">add sub-todo</button>` +
  `</li>`
  )
}

function renderFooter(){

}

// function renderFooter(){
//   let todoCount = todos.length;
//   let completedTodoCount = todos.filter(e => e.completed).length;
//   let incompleteTodoCount = todoCount - completedTodoCount;
//   let template = footerTemplate({
//     activeTodoCount: incompleteTodoCount,
//     completedTodos: completedTodoCount,
//   })
//   $(".footer").toggle(todoCount > 0).html(template)
//
// }

//taken fomr todoMVC
function uid() {
  /*jshint bitwise:false */
  var i, random;
  var uid = '';
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uid += '-';
    }
    uid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uid;
}

render(todos);
