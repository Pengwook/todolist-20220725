const selectedTypeButton = document.querySelector(".selected-type-button");
const typeSelectBoxList = document.querySelector(".type-select-box-list");
const typeSelectBoxListLis = typeSelectBoxList.querySelectorAll("li");
const todoContentList = document.querySelector(".todo-content-list");
const sectionBoby = document.querySelector(".section-body");
const incompleteCountNumber = document.querySelector(".incomplete-count-number");

/*  게시글 불러오기

	1. todoList의 type이 무엇인가 중요함.
		- all
		- importance
		- complete
		- incomplete
		
	2. 요청주소: api/v1/todolist/list/{type}?page=페이지 번호&contentCount=글의 개수(?page부터 파라미터로)
	
	3. AJAX 요청을 활용
		- type: get
		- url: 요청주소
		- data: 객체 -> { key:value } -> { page: 1, contentCount: 20 }
		- dataType: 응답받을 데이터의 타입 -> json(기본적으론 text로 되어있음)
		- success: 함수 -> response 매개변수를 받아야함. (CMRespDto가 response에 들어옴)
		- error: 함수 -> 요청실패 400 ~ 
				- 400 에러의 경우
					- 매개변수 타입이 잘 못된 경우
					- 요청 리소스가 잘 못된 경우
					- 권한이 없어서 요청을 하지 못하는 경우
					- contentType
						- text/html
						- text/plain
						- application/json
					- enctype: multipart/from-data
				500 에러의 경우
					- 가장 먼저 해야하는 것 -> console창 에러의 가장 위쪽이면서 가장 오른쪽 확인
					- 오타
					- nullpointer
					- sql
					- indexOut
					- di 잘 못 했을 때
					- @Component(Controller, RestController, Service, Mapper, Repository, Configuration) IoC에 등록 안했을때
					- Interface 겹칠 때 Bean 객체가 IoC에 여러개 생성되어 있을 때
					
*/
let totalPage = 0;	// totalPage가 있어야 페이지 계산을 할수있어서 제일 위
let page = 1;
let listType = "all";

load();

function setTotalPage(totalCount){
	totalPage = totalCount % 20 == 0 ? totalCount / 20 : Math.floor(totalCount / 20) + 1;
}

function setIncompleteCount(incompleteCount) {
	incompleteCountNumber.textContent = incompleteCount;
}

function appendList(listContent) {
	todoContentList.innerHTML += listContent
}

function updateCheckStatus(type, todoContent, todoCode) {
	let result = updateStatus(type, todoCode);	
	
	if(
			(
				(
					type == "complete" 
					&& 
					(listType == "complete" || listType =="incomplete")
				)
	 			||
				(type == "importance" && listType == "importance")
	 		) 
	 		&& 
	 		result
	 	) {
		todoContentList.removeChild(todoContent);
	}
}

function addCompleteEvent(todoContent, todoCode) {
	const completeCheck = todoContent.querySelector(".complete-check");
	
	completeCheck.onchange = () => {
			let incompleteCount = parseInt(incompleteCountNumber.textContent);	// parseInt -> 숫자로 바꿔줌
			
			if(completeCheck.checked) {
				incompleteCountNumber.textContent = incompleteCount - 1;
			}else{
				incompleteCountNumber.textContent = incompleteCount + 1;
			}
			updateCheckStatus("complete", todoContent, todoCode);
		}
}

function addImportanceEvent(todoContent, todoCode) {
	const importanceCheck = todoContent.querySelector(".importance-check");
	
	importanceCheck.onchange = () => {
			updateCheckStatus("importance", todoContent, todoCode);
		}
}

function addDeleteEvent(todoContent, todoCode) {
	const trashButton = todoContent.querySelector(".trash-button");
	
	trashButton.onclick = () => {
			deleteTodo(todoContent, todoCode);
		}
}

function addContentInputEvent(todoContent, todoCode) {
		const todoContentText = todoContent.querySelector(".todo-content-text");
		const todoContentInput = todoContent.querySelector(".todo-content-input");
		let todoContentOldValue = null;
		
		let eventFlag = false;
		
		let updateTodo = () => {
			const todoContentNewVlaue = todoContentInput.value;
			if(getChangeStatusOfValue(todoContentOldValue, todoContentNewVlaue)) {
				if(updateTodoContent(todoCode, todoContentNewVlaue)) {
					todoContentText.textContent = todoContentNewVlaue;
				}
			}
			todoContentText.classList.toggle("visible");	
			todoContentInput.classList.toggle("visible");
		}
		
		todoContentText.onclick = () => {
			todoContentValue = todoContentInput.value;
			todoContentText.classList.toggle("visible");	
			todoContentInput.classList.toggle("visible");
			todoContentInput.focus();
			eventFlag = true;
		}
		
		todoContentInput.onblur = () => {	// 포커스가 벗어났을때
			if(eventFlag) {
				updateTodo();
			}	
		}
		
		todoContentInput.onkeyup = () => {
			if(window.event.keyCode == 13) {
				eventFlag = false;
				let responseFlg = updateTodoContent(todoCode, todo)
			}
		}
}

function getChangeStatusOfValue(originValue, newValue) {
	return originValue != newValue;
}



function substringTodoCode(todoContent) {
	const completeCheck = todoContent.querySelector(".complete-check");
	
	const todoCode = completeCheck.getAttribute("id");
	const tokenIndex = todoCode.lastIndexOf("-");
	
	return todoCode.substring(tokenIndex + 1);
}

function addEvent() {	
	const todoContents = document.querySelectorAll(".todo-content");
	
	for(let todoContent of todoContents){	
		const todoCode = substringTodoCode(todoContent);
		
		addCompleteEvent(todoContent, todoCode);
		addImportanceEvent(todoContent, todoCode);
		addDeleteEvent(todoContent, todoCode);
		addContentInputEvent(todoContent, todoCode);
	}
}

function createList(todolist) {
	
	for(let content of todolist) {
		const listContent = `
			<li class="todo-content">
                <input type="checkbox" id="complete-check-${content.todoCode}" class="complete-check" ${content.todoComplete ? 'checked' : ''}>
                <label for="complete-check-${content.todoCode}"></label>
                <div class="todo-content-text">${content.todo}</div>
                <input type="text" class="todo-content-input visible" value="${content.todo}">
                <input type="checkbox" id="importance-check-${content.todoCode}" class="importance-check" ${content.importance ? 'checked' : ''}>
                <label for="importance-check-${content.todoCode}"></label>
                <div class="trash-button"><i class="fa-solid fa-trash"></i></div>
            </li>
		`
		appendList(listContent);
	}
	
	addEvent();
}


sectionBoby.onscroll = () => {
	console.log(sectionBoby.scrollTop)
	let checkNum = todoContentList.clientHeight - sectionBoby.offsetHeight - sectionBoby.scrollTop;
	
	if(checkNum < 1 && checkNum > -1 && page < totalPage){
		console.log(page);
		console.log(totalPage);
		page++;
		load();
	}
}


selectedTypeButton.onclick = () => {
    typeSelectBoxList.classList.toggle("visible");
}


function resetPage() {
	page = 1;
}

function removeAllclassList(elements, className) {
	for(let element of elements){
		element.classList.remove(className);
	}
}

function setListType(selectedType) {
	listType = selectedType.toLowerCase();
}

function clearTodoContentList() {
	todoContentList.innerHTML = "";
}

for(let i = 0; i < typeSelectBoxListLis.length; i++){
	
	typeSelectBoxListLis[i].onclick = () => {
		resetPage()
		
		removeAllclassList(typeSelectBoxListLis, "type-selected");
		
		typeSelectBoxListLis[i].classList.add("type-selected");
		
		setListType(typeSelectBoxListLis[i].textContent);
		
		const selectedType = document.querySelector(".selected-type");
		
		selectedType.textContent = typeSelectBoxListLis[i].textContent;
		
		clearTodoContentList(); 
		
		load();
		
		typeSelectBoxList.classList.toggle("visible");
		
	}
	
}

//////////////////////////////////////////// <<<< REQUEST >>>>>>> ///////////////////////////////////////////////

function load() {
	$.ajax({
		type: "get",
		url: `/api/v1/todolist/list/${listType}`,
		data: {
			"page": page,
			contentCount: 20
		},
		dataType: "json",
		success: (response) => {
			const todolist = response.data;
			
			setTotalPage(todolist[0].totalCount);
			setIncompleteCount(todolist[0].incompleteCount)
			createList(todolist);	// Dto객체가 들어있는 리스트 20개를 createList로
		},
		error: errorMessage
		
	})
}

function updateTodoContent(todoCode, todo) {
	let successFlag = false;
	$.ajax({
		type: "put",
		url: `/api/v1/todolist/todo/${todoCode}`,
		contentType: "application/json",
		data: JSON.stringify({
			"todoCode": todoCode,
			"todo": todo
			}),
		async: false,
		dataType: "json",
		success: (response) => {
			successFlag = response.data;
		},
		error: errorMessage
	})
	return successFlag;
}

function updateStatus(type, todoCode) {
	result = false;
	
	$.ajax({
		type: "put",
		url: `/api/v1/todolist/${type}/todo/${todoCode}`,
		async: false, // 동기처리
		dataType: "json",
		success: (response) => {
			result = response.data
			
		},
		error: errorMessage
	})
	return result;
}



function deleteTodo(todoContent, todoCode) {
	$.ajax({
		type: "delete",
		url: `/api/v1/todolist/todo/${todoCode}`,
		async: false,
		dataType: "json",
		success: (response) => {
			if(response.data) {
				todoContentList.removeChild(todoContent);
			}
		},
		error: errorMessage
	})
}

function errorMessage(request, status, error) {
	alert("요청 실패");
	console.log(request.status);
	console.log(request.responseText);
	console.log(error);
}






