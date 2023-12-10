import { useEffect, useState, useContext } from 'react';
import useGet from '../fetch/useGet';
import { FollowingContext } from '../store/following-context';
import { UsersContext } from '../store/users-context';
import { WebSocketContext } from '../store/websocket-context';
import FollowerModal from './FollowerModal';
import FollowingModal from './FollowingModal';
import Avatar from '../modules/Avatar';
import { Link } from 'react-router-dom';
import JoinedGroup from '../group/JoinedGroup';
import UserEvent from '../posts/UserEvent';

function Profile({ userId }) {
  const [followerOpen, setFollowerOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerData, setFollowerData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [isFollower, setIsFollower] = useState(false);

  let statusofcuruser;

  const [publicity, setPublicity] = useState(true); // 1 true is public, 0 false is private
  const selfPublicNum = +localStorage.getItem('public');
  const [pubCheck, setPubCheck] = useState(false);

  useEffect(() => {
    const targetUser = usersCtx.users.find((user) => user.id === +userId);
    console.log('checkingTargetUser', targetUser);
    if (targetUser != undefined) {
      if (targetUser.public != 0) {
        setPubCheck(true);
      }
    }
  }, [userId]);
  console.log('stored publicity (profile)', selfPublicNum);
  useEffect(() => {
    selfPublicNum ? setPublicity(true) : setPublicity(false);
  }, [selfPublicNum]);

  // friend
  const followingCtx = useContext(FollowingContext);
  const usersCtx = useContext(UsersContext);
  const wsCtx = useContext(WebSocketContext);

  const currUserId = localStorage.getItem('user_id');

  const [currentlyFollowing, setCurrentlyFollowing] = useState(false);
  const [requestedToFollow, setRequestedToFollow] = useState(false);
  const [isCloseFriend, setCloseFriend] = useState(false);

  useEffect(() => {
    const storedFollowing = JSON.parse(localStorage.getItem('following'));
    console.log('stored following (profile)', storedFollowing);
    // check if the current profile is one of the users in the following array
    followingCtx.following && setCurrentlyFollowing(followingCtx.following.some((followingUser) => followingUser.id === +userId));
  }, [followingCtx.following, userId]);

  useEffect(() => {
    followingData && setIsFollower(followingData.some((follower) => follower.id == currUserId));
  }, [followingData]);

  console.log('followingData', followingData);
  // store follower in db
  const storeFollow = (targetId) => {
    console.log('targetid (storeFollow)', targetId);

    const data = {
      // id: 0,
      sourceid: parseInt(currUserId),
      targetid: parseInt(targetId),
      status: 1,
    };

    const reqOptions = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    fetch('http://localhost:8080/user-follower', reqOptions)
      .then((resp) => resp.json())
      .then((data) => {
        console.log('user follower data', data);
        if (data.success) {
          console.log('followrequest');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (wsCtx.newNotiFollowReplyObj) {
      if (wsCtx.newNotiFollowReplyObj.accepted) {
        setCurrentlyFollowing(true);
        setRequestedToFollow(false);

        const followUser = usersCtx.users.find((user) => user.id === wsCtx.newNotiFollowReplyObj.sourceid);
        console.log('found user frd (profile accepted req)', followUser);
        followingCtx.follow(followUser);

        console.log('follow user id', wsCtx.newNotiFollowReplyObj.sourceid);
        console.log('cur user is following (profile)', followingCtx.following);
        const targetId = wsCtx.newNotiFollowReplyObj.targetid;
        console.log('targetid', targetId);
        console.log('current user', currUserId);

        // storeFollow(targetId);
      } else {
        setCurrentlyFollowing(false);
        setRequestedToFollow(false);
      }
    }
    wsCtx.setNewNotiFollowReplyObj(null);
  }, [wsCtx.newNotiFollowReplyObj]);

  const followHandler = (e) => {
    const followUser = usersCtx.users.find((user) => user.id === +e.target.id);
    console.log('found user frd (profile)', followUser);
    console.log('frd publicity', publicity);
    if (followUser) {
      if (followUser.public) {
        console.log(' user frd (public)');
        followingCtx.follow(followUser);
        setCurrentlyFollowing(true);
        storeFollow(e.target.id);
      } else if (!followUser.public) {
        //if frd private
        console.log(' user frd (private)');
        followingCtx.requestToFollow(followUser);
        setRequestedToFollow(true);
      }
    } else {
      console.log('user frd not found (profile)');
    }
  };

  const unfollowHandler = (e) => {
    console.log('unfollow userid', e.target.id);
    const unfollowUser = usersCtx.users.find((user) => user.id === +e.target.id);
    console.log('unfollow user', unfollowUser);
    unfollowUser && followingCtx.unfollow(unfollowUser);
    setCurrentlyFollowing(false);

    // delete from db
    deleteFollow(e.target.id);
  };

  //Toggle Private
  const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') === 'true');

  useEffect(() => {
    localStorage.setItem('isChecked', isChecked);
  }, [isChecked]);

  const setPublicityHandler = (e) => {
    const isPublic = !e.target.checked; // Determine the publicity based on the checkbox
    const publicityNum = isPublic ? 1 : 0; // Convert boolean to 1 (public) or 0 (private)

    setPublicity(isPublic); // Update the publicity state
    setPubCheck(isPublic); // Update the pubCheck state for re-rendering
    localStorage.setItem('public', publicityNum); // Update local storage

    // Prepare the data to send in the request body
    const data = {
      targetid: parseInt(userId),
      public: publicityNum,
    };

    // Post to store publicity to db
    fetch('http://localhost:8080/privacy', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      console.log('privacy changed');
    });

    // No need for separate if-else blocks
  };

  useEffect(() => {
    fetch(`http://localhost:8080/user-follow-status?tid=${userId}&sid=${currUserId}`)
      .then((response) => response.text())
      .then((data) => {
        console.log('cf: ', data);
        if (data == 'trueclosefriend' || data == 'true') {
          setRequestedToFollow(true);
        } else {
          setRequestedToFollow(false);
        }
        if (data == 'trueclosefriend' || data == 'falseclosefriend') {
          setCloseFriend(true);
        } else {
          setCloseFriend(false);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  }, [userId]);

  //Get followers
  useEffect(() => {
    fetch(`http://localhost:8080/user-follower?id=${userId}`)
      .then((resp) => resp.json())
      .then((data) => {
        setFollowerData(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  //Get following
  useEffect(() => {
    fetch(`http://localhost:8080/user-following?id=${userId}`)
      .then((resp) => resp.json())
      .then((data) => {
        setFollowingData(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  const { error, isLoaded, data } = useGet(`/user?id=${userId}`);
  if (data.data !== undefined) {
    if (data.data[0].public == 0) {
      localStorage.setItem('isChecked', true);
    } else {
      localStorage.setItem('isChecked', false);
    }
  }
  //  console.log("user data (profile)", data.data)
  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // delete follower from db
  const deleteFollow = (targetId) => {
    console.log('targetid (deleteFollow)', targetId);

    const data = {
      // id: 0,
      sourceid: parseInt(currUserId),
      targetid: parseInt(targetId),
      status: 1,
    };

    const reqOptions = {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    fetch('http://localhost:8080/user-follower', reqOptions)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          console.log('followrequest');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function closeFriendHandler(e) {
    // Toggle the isCloseFriend state
    setCloseFriend(!isCloseFriend);
    if (isCloseFriend) {
      setCloseFriend(false);
    } else {
      setCloseFriend(true);
    }
    //console.log('closefriend event: ', e);

    const data = {
      sourceid: parseInt(e.target.id),
      targetid: parseInt(currUserId),
    };
    console.log('closefriend event: ', data);
    // Check the content of the data and update localStorage accordingly
    if (data && Object.keys(data).length !== 0) {
      localStorage.setItem('isCloseFriend', 'true');
    } else {
      localStorage.setItem('isCloseFriend', 'false');
    }
    // Log for debugging
    console.log('closefriend event: ', data);

    const cfOptions = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    fetch('http://localhost:8080/close-friend', cfOptions)
      .then((resp) => resp.json())
      .then((data) => {
        console.log('closefriend event: ', data);
        if (data.success) {
          console.log('closefriendchanges');
        }
      })
      .catch((err) => {
        console.log('closefriend event: ', err);
      });
  }

  let followButton;
  let messageButton;
  let closeFriend;
  let closeFriendText;

  if (currUserId !== userId) {
    if (currentlyFollowing) {
      followButton = (
        <div>
          <button className="btn btn-primary btn-sm" type="button" style={{ marginRight: 5 }} id={userId} onClick={unfollowHandler}>
            -UnFollow
          </button>
        </div>
      );
      console.log('currentlyFollowing', currentlyFollowing);
    } else if (requestedToFollow) {
      followButton = (
        <div>
          <button className="btn btn-primary btn-sm" type="button" style={{ marginRight: 5 }} id={userId}>
            Requested
          </button>
        </div>
      );
    } else {
      followButton = (
        <div>
          <button className="btn btn-primary btn-sm" type="button" style={{ marginRight: 5 }} id={userId} onClick={followHandler}>
            +Follow
          </button>
        </div>
      );
    }
    messageButton = (
      <div>
        <Link className="btn btn-primary btn-sm" role="button" style={{ marginRight: 5 }} to="/chat">
          Message
        </Link>
      </div>
    );
    closeFriend = (
      <input
        className="form-check-input"
        type="checkbox"
        style={{ fontSize: 24, marginRight: 5 }}
        id={userId}
        checked={isCloseFriend}
        onChange={closeFriendHandler}
      />
    );
    closeFriendText = <span style={{ marginLeft: 5 }}>Ad to OnlyFans</span>;
  }

  function handleFollowerClick() {
    setFollowerOpen(true);
  }

  function handleFollowingClick() {
    setFollowingOpen(true);
  }

  return (
    <div className="container-fluid">
      <h3 className="text-dark mb-4">Profile</h3>
      <div className="row mb-3">
        <div className="col-lg-4">
          {/* Start: Avatarimage */}
          <div className="card mb-3">
            <div className="card-body text-center shadow">
              <div className="d-flex justify-content-center align-items-center">
                <Avatar src={data.data[0].avatar} showStatus={false} width={150} />
              </div>
              <div className="mb-3">
                <button className="btn btn-primary btn-sm" type="button">
                  Change Photo
                </button>
              </div>
            </div>
          </div>
          {/* End: Avatarimage */}
          {/* Start: Aboutme */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="text-primary fw-bold m-0">About:</h6>
            </div>
            <div className="card-body">
              {/* Start: Profile About Container */}
              <div>
                <div>
                  <span>{data.data[0].about}</span>
                </div>
              </div>
              {/* End: Profile About Container */}
            </div>
          </div>
          {/* End: Aboutme */}
          {/* Start: joinedGroupsDiv */}
          <div className="joinedGroups" style={{ padding: 5, marginTop: 20 }}>
            <h5>Your Groups:</h5>
            {/* Start: joinedGroupContainerDiv */}
            <div className=" joinedGroupContainer" style={{ margin: 5 }}>
              <JoinedGroup />
            </div>
          </div>
          {/* Start: upcomingEventsDiv */}
          <div className="upcomingEvents" style={{ padding: 5, marginTop: 20 }}>
            <h5>Upcoming Events:</h5>
            <UserEvent />
          </div>
          {/* End: upcomingEventsDiv */}
        </div>
        <div className="col-lg-8">
          <div className="row">
            <div className="col">
              {/* Start: User profile info */}
              <div className="card shadow mb-3">
                <div className="card-header d-flex justify-content-between flex-wrap py-3">
                  <div>
                    <p className="text-primary m-0 fw-bold">User Settings</p>
                  </div>
                  {/* Start: toggle private */}
                  <div className="mb-3">
                    <div className="form-check form-switch" style={{ fontSize: 24 }}>
                      {currUserId === userId && data && (
                        <>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="formCheck-1"
                            value={'Private'}
                            onClick={setPublicityHandler}
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                          <label className="form-check-label" htmlFor="formCheck-1">
                            Private
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  <div> {pubCheck ? <span>🔓Pub.</span> : <span>🔐Prv.</span>}</div>
                  {/* End: toggle private */}
                  <div className="d-flex justify-content-center">
                    <div>{followButton}</div>
                    <div>{messageButton}</div>
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    <div className="row">
                      <div className="col">
                        {/* Start: Profile row */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="username">
                            <strong>User info:</strong>
                          </label>
                          {/* Start: Username and image */}
                          <div className="d-flex align-items-lg-center">
                            <div className="profilename">
                              <span>
                                {data.data[0].fname} {data.data[0].lname}
                              </span>
                            </div>
                            <div />
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="email">
                            <strong>Email Address:</strong>
                          </label>
                          <div className="profileEmail">
                            <span>{data.data[0].email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        {/* Start: ProfileUserName */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="first_name">
                            <strong>User Name:</strong>
                          </label>
                          {/* Start: profileusernameDiv */}
                          <div className="profileUserName">
                            <span>{data.data[0].nname}</span>
                          </div>
                          {/* End: profileusernameDiv */}
                        </div>
                        {/* End: ProfileUserName */}
                      </div>
                      <div className="col">
                        {/* Start: Birthday container */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="last_name">
                            <strong>Date of Birth:</strong>
                          </label>
                          {/* Start: dateofBirth */}
                          <div className="profileDateofBirth">
                            <span>{data.data[0].dob.split('-').slice(0, 2).join('-')}</span>
                          </div>
                          {/* End: dateofBirth */}
                        </div>
                        {/* End: Birthday container */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End: User profile info */}
              {/* Start: followers following */}
              <div className="card shadow">
                <div className="card-header py-3">
                  <p className="text-primary m-0 fw-bold">Followers:</p>
                </div>
                <div className="card-body">
                  {/* Start: profile followers container */}
                  <div className="d-flex profileFollowers">
                    {/* Start: profile followers */}
                    <div className="profileFollowers" style={{ marginRight: 10 }}>
                      <button
                        className="btn btn-primary"
                        type="button"
                        data-bs-target="#modal-1"
                        data-bs-toggle="modal"
                        onClick={handleFollowerClick}
                      >
                        <span className="followerCount" style={{ fontWeight: 'bold', marginRight: 5 }}>
                          {followerData && followerData.length}
                          {!followerData && 0}
                        </span>
                        {''}
                        <span>Followers</span>
                      </button>
                    </div>
                    {/* End: profile followers */}
                    {/* Start: profiles following */}
                    <div className="profileFollowing">
                      <button
                        className="btn btn-primary"
                        type="button"
                        data-bs-target="#modal-2"
                        data-bs-toggle="modal"
                        onClick={handleFollowingClick}
                      >
                        <span className="followerCount" style={{ fontWeight: 'bold', marginRight: 5 }}>
                          {followingData && followingData.length}
                          {!followingData && 0}
                        </span>{' '}
                        <span>Following</span>
                      </button>
                    </div>
                    {/* End: profiles following */}
                  </div>
                  {/* End: profile followers container */}
                </div>
              </div>
              {/* End: followers following */}
              {/* Start: CloseFriends */}
              <div className="card shadow" style={{ marginTop: 15 }}>
                <div className="card-header py-3">
                  <p className="text-primary m-0 fw-bold">OnlyFans:</p>
                </div>
                <div className="card-body">
                  {/* Start: Onlyfans Container */}
                  <div className="d-flex onlyfansContainer">
                    {/* Start: OnlyFansDiv */}
                    <div className="onlyFansDiv" style={{ marginRight: 10 }}>
                      {isFollower && (
                        <div className="form-check d-lg-flex align-items-lg-center" style={{ margin: 5 }}>
                          {closeFriend}
                          {closeFriendText}
                        </div>
                      )}
                    </div>

                    {/* End: OnlyFansDiv */}
                  </div>
                  {/* End: Onlyfans Container */}
                </div>
              </div>
              {followerOpen && followerData && (
                <FollowerModal onClose={() => setFollowerOpen(false)} followers={followerData}></FollowerModal>
              )}
              {followingOpen && followingData && (
                <FollowingModal onClose={() => setFollowingOpen(false)} following={followingData}></FollowingModal>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
