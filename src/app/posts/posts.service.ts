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
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}` //back ticks: template expression (dynamically add values into string)
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData)=> {
        return { 
          posts: postData.posts.map(post =>{
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            }
          }), maxPosts: postData.maxPosts
       };
    }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts], 
          postCount: transformedPostData.maxPosts
        }); //emit data
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
        this.router.navigate(["/"]); //guarantees reload of postlist component
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
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId)

  }


}
