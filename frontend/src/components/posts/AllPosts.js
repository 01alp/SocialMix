import Post from './Post';
import useGet from '../fetch/useGet';
import { useCallback, useEffect } from 'react';

function AllPosts(props) {
  let eachPostCommentsArr = [];

  for (let i = 0; i < props.posts.length; i++) {
    let thisPostComments = [];
    for (let j = 0; j < props.comments.length; j++) {
      props.comments[j] && props.comments[j].postid === props.posts[i].id && thisPostComments.push(props.comments[j]);
    }
    eachPostCommentsArr.push(thisPostComments);
  }
  console.log('eachPostComments', eachPostCommentsArr);

  const createCommentSuccessHandler = useCallback(
    (createCommentSuccessful) => {
      props.onCreateCommentSuccessful(createCommentSuccessful);
    },
    [props.onCreateCommentSuccessful]
  );

  return (
    <div>
      {props.posts.map((post, p) => (
        <Post
          key={post.id}
          id={post.id}
          avatar={post.avatar}
          fname={post.fname}
          lname={post.lname}
          nname={post.nname}
          message={post.message}
          image={post.image}
          createdat={post.createdat}
          authorId={post.author}
          privacy={post.privacy}
          postNum={p}
          commentsForThisPost={eachPostCommentsArr[p]}
          onCreateCommentSuccessful={createCommentSuccessHandler}
        />
      ))}
    </div>
  );
}

export default AllPosts;
