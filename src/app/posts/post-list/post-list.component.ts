import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{


 // postsService: PostsService;
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {
  //  this.postsService = postsService;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener() //postSub to prevent mem leaks on destroy
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount
        this.posts = postData.posts;
      }); //return observable, then subscribe
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize; // dropdown
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  onDelete(postId: string){
     this.postsService.deletePost(postId).subscribe(() =>{
       this.postsService.getPosts(this.postsPerPage, this.currentPage);
     });
  }
}
