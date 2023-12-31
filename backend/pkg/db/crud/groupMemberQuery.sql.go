// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.18.0
// source: groupMemberQuery.sql

package crud

import (
	"context"
)

const checkIfMember = `-- name: CheckIfMember :one
SELECT COUNT(*) FROM group_member
WHERE group_id = ? AND user_id = ? AND status_ = ? LIMIT 1
`

type CheckIfMemberParams struct {
	GroupID int64
	UserID  int64
	Status  int64
}

func (q *Queries) CheckIfMember(ctx context.Context, arg CheckIfMemberParams) (int64, error) {
	row := q.db.QueryRowContext(ctx, checkIfMember, arg.GroupID, arg.UserID, arg.Status)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createGroupMember = `-- name: CreateGroupMember :one
INSERT INTO group_member (
  user_id, group_id, status_
) VALUES (
  ?, ?, ?
)
RETURNING id, user_id, group_id, status_, chat_noti
`

type CreateGroupMemberParams struct {
	UserID  int64
	GroupID int64
	Status  int64
}

func (q *Queries) CreateGroupMember(ctx context.Context, arg CreateGroupMemberParams) (GroupMember, error) {
	row := q.db.QueryRowContext(ctx, createGroupMember, arg.UserID, arg.GroupID, arg.Status)
	var i GroupMember
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.GroupID,
		&i.Status,
		&i.ChatNoti,
	)
	return i, err
}

const deleteGroupMember = `-- name: DeleteGroupMember :exec
DELETE FROM group_member
WHERE group_id = ? AND user_id = ?
`

type DeleteGroupMemberParams struct {
	GroupID int64
	UserID  int64
}

func (q *Queries) DeleteGroupMember(ctx context.Context, arg DeleteGroupMemberParams) error {
	_, err := q.db.ExecContext(ctx, deleteGroupMember, arg.GroupID, arg.UserID)
	return err
}

const getAllGroupsByUser = `-- name: GetAllGroupsByUser :many
;

SELECT group_.id, group_.title, group_.creator, group_.description_, group_.created_at FROM group_member JOIN group_ ON group_member.group_id = group_.id
WHERE group_member.user_id = ? AND group_member.status_ = 1
`

func (q *Queries) GetAllGroupsByUser(ctx context.Context, userID int64) ([]Group, error) {
	rows, err := q.db.QueryContext(ctx, getAllGroupsByUser, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Group
	for rows.Next() {
		var i Group
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Creator,
			&i.Description,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getGroupMembers = `-- name: GetGroupMembers :many
SELECT id, user_id, group_id, status_, chat_noti FROM group_member
WHERE group_id = ? AND status_ = ?
`

type GetGroupMembersParams struct {
	GroupID int64
	Status  int64
}

func (q *Queries) GetGroupMembers(ctx context.Context, arg GetGroupMembersParams) ([]GroupMember, error) {
	rows, err := q.db.QueryContext(ctx, getGroupMembers, arg.GroupID, arg.Status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GroupMember
	for rows.Next() {
		var i GroupMember
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.GroupID,
			&i.Status,
			&i.ChatNoti,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getGroupMembersByGroupId = `-- name: GetGroupMembersByGroupId :many
SELECT user.id, user.first_name, user.last_name, user.nick_name, user.email, user.password_, user.dob, user.image_, user.about, user.public FROM group_member JOIN user ON group_member.user_id = user.id
WHERE group_member.group_id = ? AND group_member.status_ = ?
`

type GetGroupMembersByGroupIdParams struct {
	GroupID int64
	Status  int64
}

func (q *Queries) GetGroupMembersByGroupId(ctx context.Context, arg GetGroupMembersByGroupIdParams) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, getGroupMembersByGroupId, arg.GroupID, arg.Status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.FirstName,
			&i.LastName,
			&i.NickName,
			&i.Email,
			&i.Password,
			&i.Dob,
			&i.Image,
			&i.About,
			&i.Public,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getGroupMembersByGroupIdWithoutStatus = `-- name: GetGroupMembersByGroupIdWithoutStatus :many
SELECT user.id, user.first_name, user.last_name, user.nick_name, user.email, user.password_, user.dob, user.image_, user.about, user.public FROM group_member JOIN user ON group_member.user_id = user.id
WHERE group_member.group_id = ?
`

func (q *Queries) GetGroupMembersByGroupIdWithoutStatus(ctx context.Context, groupID int64) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, getGroupMembersByGroupIdWithoutStatus, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.FirstName,
			&i.LastName,
			&i.NickName,
			&i.Email,
			&i.Password,
			&i.Dob,
			&i.Image,
			&i.About,
			&i.Public,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getGroupMembersByUserId = `-- name: GetGroupMembersByUserId :many
SELECT id, user_id, group_id, status_, chat_noti FROM group_member
WHERE user_id = ? AND status_ = ?
`

type GetGroupMembersByUserIdParams struct {
	UserID int64
	Status int64
}

func (q *Queries) GetGroupMembersByUserId(ctx context.Context, arg GetGroupMembersByUserIdParams) ([]GroupMember, error) {
	rows, err := q.db.QueryContext(ctx, getGroupMembersByUserId, arg.UserID, arg.Status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GroupMember
	for rows.Next() {
		var i GroupMember
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.GroupID,
			&i.Status,
			&i.ChatNoti,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateGroupMember = `-- name: UpdateGroupMember :one
UPDATE group_member
set status_ = ?
WHERE group_id = ? AND user_id = ?
RETURNING id, user_id, group_id, status_, chat_noti
`

type UpdateGroupMemberParams struct {
	Status  int64
	GroupID int64
	UserID  int64
}

func (q *Queries) UpdateGroupMember(ctx context.Context, arg UpdateGroupMemberParams) (GroupMember, error) {
	row := q.db.QueryRowContext(ctx, updateGroupMember, arg.Status, arg.GroupID, arg.UserID)
	var i GroupMember
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.GroupID,
		&i.Status,
		&i.ChatNoti,
	)
	return i, err
}

const updateGroupMemberChatNoti = `-- name: UpdateGroupMemberChatNoti :one
UPDATE group_member
set chat_noti = ?
WHERE group_id = ? AND user_id = ?
RETURNING id, user_id, group_id, status_, chat_noti
`

type UpdateGroupMemberChatNotiParams struct {
	ChatNoti int64
	GroupID  int64
	UserID   int64
}

func (q *Queries) UpdateGroupMemberChatNoti(ctx context.Context, arg UpdateGroupMemberChatNotiParams) (GroupMember, error) {
	row := q.db.QueryRowContext(ctx, updateGroupMemberChatNoti, arg.ChatNoti, arg.GroupID, arg.UserID)
	var i GroupMember
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.GroupID,
		&i.Status,
		&i.ChatNoti,
	)
	return i, err
}

const updateGroupMemberChatNotiSeen = `-- name: UpdateGroupMemberChatNotiSeen :one
UPDATE group_member
set chat_noti = 1
WHERE group_id = ? and user_id = ?
RETURNING id, user_id, group_id, status_, chat_noti
`

type UpdateGroupMemberChatNotiSeenParams struct {
	GroupID int64
	UserID  int64
}

func (q *Queries) UpdateGroupMemberChatNotiSeen(ctx context.Context, arg UpdateGroupMemberChatNotiSeenParams) (GroupMember, error) {
	row := q.db.QueryRowContext(ctx, updateGroupMemberChatNotiSeen, arg.GroupID, arg.UserID)
	var i GroupMember
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.GroupID,
		&i.Status,
		&i.ChatNoti,
	)
	return i, err
}

const updateGroupMemberChatNotiUnseen = `-- name: UpdateGroupMemberChatNotiUnseen :many
UPDATE group_member
set chat_noti = 0
WHERE group_id = ?
RETURNING id, user_id, group_id, status_, chat_noti
`

func (q *Queries) UpdateGroupMemberChatNotiUnseen(ctx context.Context, groupID int64) ([]GroupMember, error) {
	rows, err := q.db.QueryContext(ctx, updateGroupMemberChatNotiUnseen, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GroupMember
	for rows.Next() {
		var i GroupMember
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.GroupID,
			&i.Status,
			&i.ChatNoti,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
