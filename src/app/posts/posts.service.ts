import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';


@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {

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
            content: post.content,
            imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); //text and blob/file values
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{message: string, post: Post}>(
        'http://localhost:3000/api/posts', 
        postData
        ) //postData: non json
      .subscribe((responseData) =>{
        const post: Post = {
          id: responseData.post.id, 
          title: title, 
          content: content,
          imagePath: responseData.post.imagePath
        };
        const postId = responseData.post.id
        post.id = postId
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])//pushes new value of posts, emitting
        this.router.navigate(["/"]);
        });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object"){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
        postData = {
          id: id, 
          title: title, 
          content: content, 
          imagePath: image
        }
    }
    //const post: Post = { id: id, title: title, content: content , imagePath: null};
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((responseData) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id, 
          title: title, 
          content: content, 
          imagePath: "responseData.ImageData"
        //  imagePath: response.imagePath

        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log("post deleted.");

      });
  }


}
