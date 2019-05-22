//current issues:
//nested ULs appear BEFORE the LI they belong too ie.
// one -1
// one -2
//one
// two-1
// two-2
//two

//also, nesting onto a subTodo returns an error from findTodo

var todoInput = document.getElementById("todo-input");
$("#add-todo-btn").on('click',addTodo)
$("#todos").on('click','#delete-todo-btn', deleteTodo)
$("#todos").on('click', '#complete-todo', toggleTodo)
$('.filter').on('change', filterTodos)
//$('.footer').on('click','.clear-completed',clearCompleted)
$('#todos').on('click',"#add-sub-todos-btn", addSubTodo)


var todos = store('stored-todos');

//  TEMPLATES
// var templateSource = $('#todo-template').html();
// var template = Handlebars.compile(templateSource);
// var footerTemplateSource = $('#footer-template').html();
// var footerTemplate = Handlebars.compile(footerTemplateSource);
//

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

// function findTodo(e) {
//   let targetId = e.target.parentElement.id;
//   let todoToAddSubTo = todos.filter(e => e.id == targetId)[0];
//   let todoIndex = todos.indexOf(todoToAddSubTo);
//   return todos[todoIndex]
//}

function findTodo(e){

}

function addSubTodo(e){
  let todo = findTodo(e);
  todo.subTodos.push({
    id: uid(),
    title: todoInput.value,
    completed: false,
    subTodos: [],
  })
  store('stored-todos', todos);
  render(todos);
  $("#todo-input").focus()
}

function deleteTodo(e) {
  let id = e.target.parentElement.id
  todos = todos.filter(e => e.id != id)
  store('stored-todos', todos);
  render(todos);
}

function toggleTodo(e) {
  let id = e.target.parentElement.id;
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
      return todo;
    }
    return todo;
  })
  store('stored-todos', todos);
  render(todos);
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

  $("#todos").html(todosParser(todos));
  todoInput.value = '';
}

function todosParser(todos) {
  let html = '';

  if (todos.length >= 1) {
    //recursively builds html to append to #todos UL
    for (let a = 0; a < todos.length; a++) {
      let todo = todos[a];
      //builds up the inner arrays if subTodo exists
      if (todo.subTodos.length > 0) {
        for (let b = 0; b < todo.subTodos.length; b++) {
          let subTodo = todo.subTodos[b];
          //if this is the beginning of a subTodo array, add <ul> to the front
          if (b == 0) {
            html += '<ul>'
          }
          //if this is the end of a subTodo array, add </ul> to the back
          if (b == todo.subTodos.length - 1) {
            html += todosParser(subTodo) + '</ul>'
          }
          //this this isnt the beg or end, return an <li> from todoparser
          else {
            html += todosParser(subTodo)
          }
        }
      }
      html += todosParser(todo);
    }
    return html;
  }

  else {
    let completed = todos.completed ? "class='todo completed'" : "class='todo'"
    let completeTodoButton = `<button id="complete-todo">`;
    if (todos.completed) {
      completeTodoButton += `(*)</button>`
      //only inserts button IF subTodos are all complete or non-existant
    } else if (todos.subTodos.filter(e=>e.completed).length === todos.subTodos.length) {
      completeTodoButton += `()</button>`
    } else {
      completeTodoButton = '';
    }
    return (
    `<li id="${todos.id}" ${completed}>` +
      `${completeTodoButton} ${todos.title}` +
      `<button id="delete-todo-btn">remove</button>` +
      `<button id="add-sub-todos-btn">add sub-todos</button>` +
    `</li>`
    )
  }
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
