import { useState } from "react";
import { Button, Dropdown, Input, type MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { IMAGES } from "../../../shared";
import "./Comments.scss";

export interface Comment {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    avatar: string;
    replies?: Comment[];
    isResolved?: boolean;
}

interface CommentsProps {
    comments: Comment[];
    onCommentsChange: (comments: Comment[]) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, onCommentsChange }) => {
    // Ensure comments is always an array
    const safeComments = comments || [];
    
    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>("");
    const [newCommentText, setNewCommentText] = useState<string>("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string>("");

    const handleReplyClick = (commentId: string) => {
        setReplyingToCommentId(commentId);
        setReplyText("");
    };

    const handleCancelReply = () => {
        setReplyingToCommentId(null);
        setReplyText("");
    };

    const handleSubmitReply = (commentId: string) => {
        if (!replyText.trim()) return;

        const newReply: Comment = {
            id: `${commentId}-${Date.now()}`,
            author: "Sarah Chen",
            text: replyText.trim(),
            timestamp: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            avatar: "S",
            isResolved: false,
        };

        const updatedComments = safeComments.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                };
            }
            return comment;
        });

        onCommentsChange(updatedComments);
        setReplyingToCommentId(null);
        setReplyText("");
    };

    const handleAddComment = () => {
        if (!newCommentText.trim()) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: "Sarah Chen",
            text: newCommentText.trim(),
            timestamp: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            avatar: "S",
            replies: [],
            isResolved: false,
        };

        onCommentsChange([...comments, newComment]);
        setNewCommentText("");
    };

    const handleEditComment = (commentId: string) => {
        const findComment = (comments: Comment[], id: string): Comment | null => {
            for (const comment of comments) {
                if (comment.id === id) return comment;
                if (comment.replies) {
                    const reply = comment.replies.find((r) => r.id === id);
                    if (reply) return reply;
                }
            }
            return null;
        };

        const comment = findComment(comments, commentId);
        if (comment) {
            setEditingCommentId(commentId);
            setEditingText(comment.text);
        }
    };

    const handleSaveEdit = (commentId: string) => {
        if (!editingText.trim()) return;

        const updatedComments = safeComments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, text: editingText.trim() };
            }
            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                        reply.id === commentId ? { ...reply, text: editingText.trim() } : reply
                    ),
                };
            }
            return comment;
        });

        onCommentsChange(updatedComments);
        setEditingCommentId(null);
        setEditingText("");
    };

    const handleCancelCommentEdit = () => {
        setEditingCommentId(null);
        setEditingText("");
    };

    const handleDeleteComment = (commentId: string) => {
        const filteredComments = comments.filter((comment) => comment.id !== commentId);

        if (filteredComments.length === comments.length) {
            const updatedComments = safeComments.map((comment) => {
                if (comment.replies) {
                    return {
                        ...comment,
                        replies: comment.replies.filter((reply) => reply.id !== commentId),
                    };
                }
                return comment;
            });
            onCommentsChange(updatedComments);
        } else {
            onCommentsChange(filteredComments);
        }
    };

    const handleResolveComment = (commentId: string) => {
        const updatedComments = safeComments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, isResolved: !comment.isResolved };
            }
            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                        reply.id === commentId ? { ...reply, isResolved: !reply.isResolved } : reply
                    ),
                };
            }
            return comment;
        });

        onCommentsChange(updatedComments);
    };

    const getCommentMenu = (commentId: string, isReply: boolean = false): MenuProps => {
        const items: MenuProps["items"] = [
            {
                key: "edit",
                label: "Edit",
                onClick: () => handleEditComment(commentId),
            },
        ];

        if (!isReply) {
            items.push(
                {
                    key: "resolved",
                    label: "Resolved",
                    onClick: () => handleResolveComment(commentId),
                },
                {
                    key: "delete",
                    label: "Delete",
                    danger: true,
                    onClick: () => handleDeleteComment(commentId),
                }
            );
        }

        return { items, className: "comment-dropdown-menu" };
    };

    return (
        <div className="comment-wrap">
            <div className="comments-list">
                {safeComments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className={`comment-card primary ${comment.isResolved ? "resolved" : ""}`}>
                            <div className="comment-avatar">{comment.avatar}</div>
                            <div className="comment-content">
                                <div className="comment-author">
                                    {comment.author}
                                    <Dropdown
                                        menu={getCommentMenu(comment.id, false)}
                                        trigger={["click"]}
                                        placement="bottomRight"
                                    >
                                        <Button type="text" size="small" className="comment-actions-btn">
                                            <MoreOutlined />
                                        </Button>
                                    </Dropdown>
                                </div>
                                {editingCommentId === comment.id ? (
                                    <div className="comment-edit-section">
                                        <Input.TextArea
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="comment-edit-textarea"
                                            autoFocus
                                        />
                                        <div className="comment-edit-actions">
                                            <Button
                                                shape="round"
                                                onClick={handleCancelCommentEdit}
                                                className="cancel-edit-btn"
                                            >
                                                CANCEL
                                            </Button>
                                            <Button
                                                type="primary"
                                                shape="round"
                                                onClick={() => handleSaveEdit(comment.id)}
                                                className="save-edit-btn"
                                                disabled={!editingText.trim()}
                                            >
                                                SAVE
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="comment-text">{comment.text}</div>
                                        <div className="comment-meta">{comment.timestamp}</div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="comment-reply-action">
                            <Button
                                type="text"
                                size="small"
                                className="reply-btn"
                                onClick={() => handleReplyClick(comment.id)}
                            >
                                <img src={IMAGES.replyIcon} alt="Reply" />
                                Reply
                            </Button>
                        </div>

                        {replyingToCommentId === comment.id && (
                            <div className="reply-input-section">
                                <Input.TextArea
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="reply-textarea"
                                />
                                <div className="reply-actions">
                                    <Button
                                        shape="round"
                                        onClick={handleCancelReply}
                                        className="cancel-reply-btn"
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        type="primary"
                                        shape="round"
                                        onClick={() => handleSubmitReply(comment.id)}
                                        className="submit-reply-btn primary-btn"
                                        disabled={!replyText.trim()}
                                    >
                                        REPLY
                                    </Button>
                                </div>
                            </div>
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                            <div className="comment-replies">
                                {comment.replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className={`comment-card reply ${reply.isResolved ? "resolved" : ""}`}
                                    >
                                        <div className="comment-avatar small">{reply.avatar}</div>
                                        <div className="comment-content">
                                            <div className="comment-author">
                                                {reply.author}
                                                <Dropdown
                                                    menu={getCommentMenu(reply.id, true)}
                                                    trigger={["click"]}
                                                    placement="bottomRight"
                                                >
                                                    <Button type="text" size="small" className="comment-actions-btn">
                                                        <MoreOutlined />
                                                    </Button>
                                                </Dropdown>
                                            </div>
                                            {editingCommentId === reply.id ? (
                                                <div className="comment-edit-section">
                                                    <Input.TextArea
                                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="comment-edit-textarea"
                                                        autoFocus
                                                    />
                                                    <div className="comment-edit-actions">
                                                        <Button
                                                            shape="round"
                                                            onClick={handleCancelCommentEdit}
                                                            className="cancel-edit-btn"
                                                        >
                                                            CANCEL
                                                        </Button>
                                                        <Button
                                                            type="primary"
                                                            shape="round"
                                                            onClick={() => handleSaveEdit(reply.id)}
                                                            className="save-edit-btn primary-btn"
                                                            disabled={!editingText.trim()}
                                                        >
                                                            SAVE
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="comment-text">{reply.text}</div>
                                                    <div className="comment-meta">{reply.timestamp}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="comment-input-wrapper">
                <div className="input-box">
                    <Input.TextArea
                        autoSize={{ minRows: 3, maxRows: 4 }}
                        placeholder="Add a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onPressEnter={(e) => {
                            if (e.shiftKey) return;
                            e.preventDefault();
                            handleAddComment();
                        }}
                    />
                    <Button
                        type="text"
                        shape="circle"
                        className="comment-send-btn"
                        onClick={handleAddComment}
                        disabled={!newCommentText.trim()}
                    >
                        <img src={IMAGES.sendIcon} alt="" />
                    </Button>
                </div>
                <p className="infoText">Press Enter to send, Shift+Enter for new line</p>
            </div>
        </div>
    );
};

export default Comments;

