package com.hyeonwook.todolist.domain.todo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Todo {
	private int todo_code;
	private String todo_content;
	private int todo_complete;
	private int importance_flag;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
}
