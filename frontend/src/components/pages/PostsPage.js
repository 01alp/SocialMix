import React, { useEffect, useState, useCallback } from 'react';
import Comment from '../posts/comments/Comment';
import CreatePost from '../posts/CreatePost.js';
import CreateComment from '../posts/comments/CreateComment.js';
import AllPosts from '../posts/AllPosts.js';
import UserEvent from '../posts/UserEvent';
import AllUsers from '../posts/AllUsers';
import JoinedGroup from '../group/JoinedGroup';

const PostsPage = () => {
  const sessionUrl = 'http://localhost:8080/session';
  const postCommentUrl = 'http://localhost:8080/post-comment';
  const [postData, setPostData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [refreshState, setRefreshState] = useState(false);

  // get posts
  let userId = localStorage.getItem('user_id');
  console.log(userId);
  useEffect(() => {
    fetch(`http://localhost:8080/post?id=${userId}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (Array.isArray(data)) {
          data.sort((a, b) => Date.parse(b.createdat) - Date.parse(a.createdat));
          setPostData(data);
        } else {
          console.log('Received data is not an array:', data);
        }
      })
      .catch((err) => console.log(err));
  }, [refreshState]);

  // get comments
  useEffect(() => {
    fetch(postCommentUrl)
      .then((resp) => resp.json())
      .then((data) => {
        data.sort((a, b) => Date.parse(a.createdat) - Date.parse(b.createdat)); // ascending order
        setCommentData(data);
      })
      .catch((err) => console.log(err));
  }, [refreshState]);

  // create post
  const createPostHandler = useCallback((createPostPayloadObj) => {
    console.log('postpage create post', createPostPayloadObj);
    const reqOptions = {
      method: 'POST',
      body: JSON.stringify(createPostPayloadObj),
    };
    fetch(`http://localhost:8080/post`, reqOptions)
      .then((resp) => resp.json())
      .then((data) => {
        console.log('post success', data.success);
        if (data.success) {
          // render all posts
          fetch(`http://localhost:8080/post?id=${userId}`)
            .then((resp) => {
              return resp.json();
            })
            .then((data) => {
              data.sort((a, b) => Date.parse(b.createdat) - Date.parse(a.createdat));
              console.log('sorted post data: ', data);
              setPostData(data);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createCommentSuccessHandler = useCallback((createCommentSuccessful) => {
    // fetch comment
    if (createCommentSuccessful) {
      fetch(postCommentUrl)
        .then((resp) => resp.json())
        .then((data) => {
          data.sort((a, b) => Date.parse(a.createdat) - Date.parse(b.createdat)); // ascending order
          console.log('post page sorted comment data: ', data);
          setCommentData(data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  function refresh() {
    refreshState ? setRefreshState(false) : setRefreshState(true);
  }
  return (
    <>
      <div className="container" id="mainContainer" style={{ marginTop: 20, marginBottom: 20 }}>
        <div className="row">
          {/* Start: leftColumn */}
          <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 col-xxl-3">
            <AllUsers />
            <JoinedGroup />
            <UserEvent />
          </div>
          {/* End: leftColumn */}
          {/* Start: rightColumn */}
          <div className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 col-xxl-9">
            {/* Start: makePostDiv */}
            <div
              className="makePost"
              style={{
                boxShadow: '3px 3px 5px 5px var(--bs-body-color)',
                padding: 5,
              }}
            >
              <CreatePost onCreatePost={createPostHandler} />
            </div>
            {/* End: makePostDiv */}
            {/* Start: refreshDiv */}
            <div className="refresh" style={{ marginTop: 15, marginBottom: 15, textAlign: 'right' }}>
              <button className="btn" type="button" style={{ borderRadius: 30 }} onClick={refresh}>
                <i
                  className="fas fa-redo"
                  data-bss-hover-animate="pulse"
                  style={{
                    fontSize: 32,
                    marginRight: 10,
                    textShadow: '3px 3px 5px var(--bs-emphasis-color)',
                  }}
                />
              </button>
            </div>
            {/* End: refreshDiv */}
            {/* Start: all postst wrapper */}
            <AllPosts posts={postData} comments={commentData} onCreateCommentSuccessful={createCommentSuccessHandler} />
            {/* End: all postst wrapper */}
          </div>
          {/* End: rightColumn */}
        </div>
      </div>
      {/* End: 1 Row 2 Columns */}
    </>
  );
};

export default PostsPage;
