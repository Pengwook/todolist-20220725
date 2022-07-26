package com.hyeonwook.todolist.service.todo;

import java.util.List;

import com.hyeonwook.todolist.web.dto.todo.CreateTodoReqDto;

public interface TodoService {
	//추가
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception;
	//수정
	
	//삭제
	//조회
	public List<?> getToList(int page) throws Exception;
}
