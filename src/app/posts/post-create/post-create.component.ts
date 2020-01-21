import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';

  constructor(public postsService: PostsService) {

  }

  onAddPost(form: NgForm) {
    if (form.invalid){
      return;
      //returns without submit if validation requirements no met
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
  ngOnInit(): void {

  }

}
