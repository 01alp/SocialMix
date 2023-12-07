import { useContext, useState } from 'react';
import { WebSocketContext } from '../store/websocket-context';
import Avatar from '../modules/Avatar';
import { GroupsContext } from '../store/groups-context';
import { JoinedGroupContext } from '../store/joined-group-context';

const InviteNotif = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  const wsCtx = useContext(WebSocketContext);
  const grpCtx = useContext(GroupsContext);
  const jGrpCtx = useContext(JoinedGroupContext);
  const grp = grpCtx.groups.find((grp) => grp.id === props.groupId);
  console.log('join grp (noti): ', grp);
  const grpTitle = grp['title'];
  console.log('grp title (noti): ', grpTitle);

  const acceptInvitationHandler = () => {
    setIsVisible(false);
    console.log('request accepted: ');
    const notiReplyPayloadObj = {};
    notiReplyPayloadObj['label'] = 'noti';
    notiReplyPayloadObj['id'] = Date.now();
    notiReplyPayloadObj['type'] = 'invitation-reply';
    notiReplyPayloadObj['sourceid'] = props.targetId;
    notiReplyPayloadObj['targetid'] = props.srcUser.id;
    notiReplyPayloadObj['groupid'] = grp.id;
    notiReplyPayloadObj['accepted'] = true;
    console.log('gonna send reply (accept) to Invitation : ', notiReplyPayloadObj);
    if (wsCtx.websocket !== null) wsCtx.websocket.send(JSON.stringify(notiReplyPayloadObj));
    jGrpCtx.getFollowing();

    let notifarr = JSON.parse(localStorage.getItem('new_notif'));
    for (let i = 0; i < notifarr.length; i++) {
      if (notifarr[i].sourceid == props.srcUser.id && notifarr[i].groupid == props.groupId && notifarr[i].type == 'invitation') {
        notifarr.splice(i, 1);
        localStorage.setItem('new_notif', JSON.stringify(Object.values(notifarr)));
        break;
      }
    }
  };
  const declineInvitationHandler = () => {
    setIsVisible(false);

    console.log('request declined: ');
    const notiReplyPayloadObj = {};
    notiReplyPayloadObj['label'] = 'noti';
    notiReplyPayloadObj['id'] = Date.now();
    notiReplyPayloadObj['type'] = 'invitation-reply';
    notiReplyPayloadObj['sourceid'] = props.targetId;
    notiReplyPayloadObj['targetid'] = props.srcUser.id;
    notiReplyPayloadObj['groupid'] = grp.id;
    notiReplyPayloadObj['accepted'] = false;
    console.log('gonna send reply (decline) to Invitation : ', notiReplyPayloadObj);
    if (wsCtx.websocket !== null) wsCtx.websocket.send(JSON.stringify(notiReplyPayloadObj));
    let notifarr = JSON.parse(localStorage.getItem('new_notif'));
    for (let i = 0; i < notifarr.length; i++) {
      if (notifarr[i].sourceid == props.srcUser.id && notifarr[i].groupid == props.groupId && notifarr[i].type == 'invitation') {
        notifarr.splice(i, 1);
        localStorage.setItem('new_notif', JSON.stringify(Object.values(notifarr)));
        break;
      }
    }
  };

  return (
    <div>
      {isVisible && (
        <div className="dropdown-item d-flex align-items-center">
          <div className="me-3">
            <div className="bg-primary icon-circle">
              <Avatar width={52} />
            </div>
          </div>
          <div>
            <p>{`${props.srcUser.fname} ${props.srcUser.lname} wants you to join ${grpTitle}`}</p>
            <div>
              <button className="btn btn-primary btn-sm" type="button" style={{ marginRight: 10 }} onClick={acceptInvitationHandler}>
                Accept
              </button>
              <button className="btn btn-primary btn-sm" type="button" onClick={declineInvitationHandler}>
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteNotif;
