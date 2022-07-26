package com.hyeonwook.todolist.service.todo;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hyeonwook.todolist.domain.todo.Todo;
import com.hyeonwook.todolist.domain.todo.TodoRepository;
import com.hyeonwook.todolist.web.dto.todo.CreateTodoReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{
	
	private final TodoRepository todoRepository;
	
	@Override
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception {
		Todo todoEntity = createTodoReqDto.toEntity();
		return todoRepository.save(todoEntity) > 0;
	}
	
	@Override
	public List<?> getToList(int page) throws Exception {
		
		return null;
	}
}
