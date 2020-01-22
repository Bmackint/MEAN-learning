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

  // used for editing single post
  getPost(id: string) {
   // return{...this.posts.find(p => p.id === id)}
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
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

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((responseData) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        console.log("--------------"); //update post.content issue debugging here
        console.log(post);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
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
