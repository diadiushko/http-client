import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {Todo, TodosService} from "./services/todos.service";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    todos: Todo[] = []
    loading = false
    todoTitle = ''
    error = ''

    constructor(private todosService: TodosService) {}

    ngOnInit() {
        this.fetchTodos();
    }

    addTodo() {
        if (!this.todoTitle.trim()) return;

        const newTodo: Todo = {
            title: this.todoTitle,
            completed: false,
            id: this.todos.length,
            date: new Date()
        }

        this.todosService.addTodo(newTodo)
            .subscribe(todo => {
                this.todos.push(todo);
            })
    }

    fetchTodos() {
        this.loading = true
        this.todosService.fetchTodos()
            .subscribe(todos => {
                this.todos = todos
                this.loading = false
            }, error => {
                console.error('Error:', error)
                this.error = error.message;
            }, () => {})
    }

    removeTodo(id: number) {
        this.todosService.removeTodo(id)
            .subscribe(() => {
                this.todos = this.todos.filter(todo => todo.id != id);
            })
    }

    completeTodo(id: number) {
        this.todosService.completeTodo(id).subscribe(todo => {
            const foundTodos = this.todos.find(t => t.id === todo.id)
            if (foundTodos) foundTodos.completed = true
        })
    }
}
