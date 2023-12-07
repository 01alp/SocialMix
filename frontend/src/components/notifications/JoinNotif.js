import { useContext, useState } from 'react';
import { WebSocketContext } from '../store/websocket-context';
import Avatar from '../modules/Avatar';
import { GroupsContext } from '../store/groups-context';

const JoinNotif = (props) => {
  const wsCtx = useContext(WebSocketContext);
  const grpCtx = useContext(GroupsContext);
  const [isVisible, setIsVisible] = useState(true);

  const grp = grpCtx.groups.find((grp) => grp.id === props.groupId);
  console.log('join grp (noti): ', grp);
  const grpTitle = grp['title'];
  console.log('grp title (noti): ', grpTitle);

  const acceptJoinReqHandler = () => {
    setIsVisible(false);
    console.log('request accepted: ');
    const notiReplyPayloadObj = {};
    notiReplyPayloadObj['label'] = 'noti';
    notiReplyPayloadObj['id'] = Date.now();
    notiReplyPayloadObj['type'] = 'join-req-reply';
    notiReplyPayloadObj['sourceid'] = props.targetId;
    notiReplyPayloadObj['targetid'] = props.srcUser.id;
    notiReplyPayloadObj['groupid'] = grp.id;
    notiReplyPayloadObj['accepted'] = true;
    console.log('gonna send reply (accept) to join req : ', notiReplyPayloadObj);
    if (wsCtx.websocket !== null) wsCtx.websocket.send(JSON.stringify(notiReplyPayloadObj));
    let notifarr = JSON.parse(localStorage.getItem('new_notif'));
    for (let i = 0; i < notifarr.length; i++) {
      if (notifarr[i].sourceid == props.srcUser.id && notifarr[i].groupid == props.groupId && notifarr[i].type == 'join-req') {
        notifarr.splice(i, 1);
        localStorage.setItem('new_notif', JSON.stringify(Object.values(notifarr)));
        break;
      }
    }
  };
  const declineJoinReqHandler = () => {
    setIsVisible(false);
    console.log('request declined: ');
    const notiReplyPayloadObj = {};
    notiReplyPayloadObj['label'] = 'noti';
    notiReplyPayloadObj['id'] = Date.now();
    notiReplyPayloadObj['type'] = 'join-req-reply';
    notiReplyPayloadObj['sourceid'] = props.targetId;
    notiReplyPayloadObj['targetid'] = props.srcUser.id;
    notiReplyPayloadObj['groupid'] = grp.id;
    notiReplyPayloadObj['accepted'] = false;
    console.log('gonna send reply (decline) to join req : ', notiReplyPayloadObj);
    if (wsCtx.websocket !== null) wsCtx.websocket.send(JSON.stringify(notiReplyPayloadObj));
    let notifarr = JSON.parse(localStorage.getItem('new_notif'));
    for (let i = 0; i < notifarr.length; i++) {
      if (notifarr[i].sourceid == props.srcUser.id && notifarr[i].groupid == props.groupId && notifarr[i].type == 'join-req') {
        notifarr.splice(i, 1);
        localStorage.setItem('new_notif', JSON.stringify(Object.values(notifarr)));
        break;
      }
    }
  };

  console.log('props.groupid (join)', props.grouptitle);

  return (
    <div>
      {isVisible && (
        <div className="dropdown-item d-flex align-items-center">
          <div className="me-3">
            <div className="bg-primary icon-circle" id={props.srcUser.id}>
              <Avatar width={52} />
            </div>
          </div>
          <div>
            <p>{`${props.srcUser.fname} ${props.srcUser.lname} wants to join ${grpTitle}`}</p>
            <div>
              <button className="btn btn-primary btn-sm" type="button" style={{ marginRight: 10 }} onClick={acceptJoinReqHandler}>
                Accept
              </button>
              <button className="btn btn-primary btn-sm" type="button" onClick={declineJoinReqHandler}>
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinNotif;
