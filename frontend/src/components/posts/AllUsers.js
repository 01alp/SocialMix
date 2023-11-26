import React from 'react';

const AllUsers = () => {
  return (
    <div
      className="usersList"
      style={{
        padding: 5,
        boxShadow: '3px 3px 5px 5px var(--bs-body-color)',
      }}
    >
      <h5>Users List:</h5>
      <div className="d-flex align-items-xl-center userListContainer" id="user1" style={{ margin: 5 }}>
        {/* Start: avatarDiv */}
        <div className="avatarDiv">
          <img
            className="rounded-circle userAvatar"
            id="userAvatarImg"
            style={{ width: 32, marginRight: 10 }}
            src="assets/img/avatars/avatar3.jpeg"
          />
        </div>
        {/* End: avatarDiv */}
        <div>
          <a href="profile.html">
            <span>User 3</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
