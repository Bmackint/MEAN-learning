import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{


 // postsService: PostsService;

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {
  //  this.postsService = postsService;
  }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener() //postSub to prevent mem leaks on destroy
      .subscribe((post: Post[]) => {
        this.posts = post;
      }); //return observable, then subscribe
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  onDelete(postId: string){
     this.postsService.deletePost(postId);
  }
}
