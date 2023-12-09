import { useEffect, useState } from 'react';
import useGet from '../fetch/useGet';
import AllPosts from '../posts/AllPosts';
import Profile from '../profile/Profile';
import { useParams } from 'react-router-dom';

function ProfilePage() {
  const [commentData, setCommentData] = useState([]);

  const sessionUrl = 'http://localhost:8080/session';
  const params = useParams();
  const id = params.userId;

  // get comments
  useEffect(() => {
    fetch('http://localhost:8080/post-comment')
      .then((resp) => resp.json())
      .then((data) => {
        data.sort((a, b) => Date.parse(a.createdat) - Date.parse(b.createdat)); // ascending order
        // console.log("post page sorted comment data: ", data)
        setCommentData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const { error, isLoaded, data } = useGet(`/post?id=${localStorage.getItem('user_id')}`);

  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  let postData = [];
  if (data != null) {
    postData = data.filter((x) => x.author === +id);
  }

  return (
    <div>
      <Profile userId={id}></Profile>
      <AllPosts userId={id} posts={postData} comments={commentData}></AllPosts>
    </div>
  );
}

export default ProfilePage;
