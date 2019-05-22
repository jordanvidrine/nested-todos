//working on rendering using javascript+jquery only
//issue: when removing last item in todos, it returns undefined 


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

function findTodo(e) {
  debugger;
  let targetId = e.target.parentElement.id;
  let todoToAddSubTo = todos.filter(e => e.id == targetId)[0];
  let todoIndex = todos.indexOf(todoToAddSubTo);
  return todos[todoIndex]
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
  console.log(e.target.value)
  let filteredTodos;
  if (e.target.value == "show-completed") {
    filteredTodos = todos.filter(e => e.completed == true);
  } else if (e.target.value == "show-all") {
    filteredTodos = todos;
  }
  else {
    filteredTodos = todos.filter(e => e.completed == false);
  }
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

// function render(todos) {
//   $('#todos').html(template(todos));
//   todoInput.value = '';
//   renderFooter()
// }

function render(todos) {
  if (!todos) {
    $("#todos").html('');
    return;
  }
  if (todos.length == 0) {
    $("#todos").html('');
    todoInput.value = '';
  }

  $("#todos").html(todosParser(todos));
  todoInput.value = '';
}

function todosParser(todos) {
  let html = '';

  if (todos.length > 1) {
    //recursively builds html to append to #todos UL
    for (let i = 0; i < todos.length; i++) {
      let todo = todos[i];
      html += todosParser(todo);
    }
    return html;
  }

  else {
    let completed = todos.completed ? "class='todo completed'" : "class='todo'"
    let completeTodoButton = `<button id="complete-todo">`;
    if (todos.completed) {
      completeTodoButton += `(*)</button>`
    } else {
      completeTodoButton += `()</button>`
    }
    return `<li id="${todos.id}" ${completed}>${completeTodoButton} ${todos.title} <button id="delete-todo-btn">remove</button><button id="add-sub-todos-btn">add sub-todos</button></li>`
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
