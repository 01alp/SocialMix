import { useContext } from 'react';
import { UsersContext } from '../store/users-context';
import { useNavigate } from 'react-router-dom';
import FollowNotif from './FollowNotif';
import JoinNotif from './JoinNotif';
import InviteNotif from './InviteNotif';
import EventNotif from './EventNotif';

const NotificationItems = (props) => {
  const navigate = useNavigate();
  const usersCtx = useContext(UsersContext);
  const sourceUser = usersCtx.users.find((user) => user.id === props.sourceId);

  console.log('props.grouptitle (item)', props);
  return (
    <div>
      {props.type === 'follow-req' && <FollowNotif srcUser={sourceUser} targetId={props.targetId} />}
      {props.type === 'join-req' && <JoinNotif srcUser={sourceUser} targetId={props.targetId} groupId={props.groupId} />}
      {props.type === 'invitation' && (
        <InviteNotif srcUser={sourceUser} targetId={props.targetId} groupId={props.groupId} createdAt={props.createdAt} />
      )}

      {props.type && props.type.includes('event-notif') && <EventNotif groupId={props.groupId} type={props.type} />}
    </div>
  );
};

export default NotificationItems;
