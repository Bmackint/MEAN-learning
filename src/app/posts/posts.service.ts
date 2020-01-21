import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';


@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){

  }

  getPosts() {
    this.http.get<{message: string, posts: any}>(
      'http://localhost:3000/api/posts'
      )
      .pipe(map((postData)=> {
        return postData.posts.map(post =>{
          return {
            id: post._id,
            title: post.title,
            content: post.content
          }
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  //  return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); // listens
  }
  addPost(title: string, content: string) {
    const post :Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) =>{
        const postId = responseData.postId
        post.id = postId
        this.posts.push(post);
      //  console.log(this.posts)
        this.postsUpdated.next([...this.posts])//pushes new value of posts, emitting
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log("this postId = " + postId);
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log("post deleted.");

      });
  }
}
