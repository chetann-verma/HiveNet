import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../../components/Input/Input";
import { request } from "../../../../utils/api";
import {
  useAuthentication,
  type User,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { Comment } from "../Comment/Comment";
import { Madal } from "../Modal/Modal";
import { TimeAgo } from "../TimeAgo/TimeAgo";
import classes from "./Post.module.scss";

export interface Post {
  id: number;
  content: string;
  author: User;
  picture?: string;
  likes?: User[];
  comments?: Comment[];
  creationDate: string;
  updatedDate?: string;
}

interface PostProps {
  post: Post;
  setPosts: Dispatch<SetStateAction<Post[]>>;
}

export function Post({ post, setPosts }: PostProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState<User[]>([]);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);

  const [postLiked, setPostLiked] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchComments = async () => {
      await request<Comment[]>({
        endpoint: `/api/v1/feed/posts/${post.id}/comments`,
        onSuccess: (data) => setComments(data),
        onFailure: (error) => {
          console.error(error);
        },
      });
    };
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    const fetchLikes = async () => {
      await request<User[]>({
        endpoint: `/api/v1/feed/posts/${post.id}/like`,
        onSuccess: (data) => {
          setLikes(data);
          setPostLiked(data.some((like) => like.id === user?.id));
        },
        onFailure: (error) => {
          console.error(error);
        },
      });
    };
    fetchLikes();
  }, [post.id, user?.id]);

  const like = async () => {
    setPostLiked((prev) => !prev);
    await request<Post>({
      endpoint: `/api/v1/feed/posts/${post.id}/like`,
      method: "PUT",
      onSuccess: () => {
        setLikes((prev) =>
          postLiked ? prev.filter((like) => like.id !== user?.id) : [user!, ...prev]
        );
      },
      onFailure: (error) => {
        console.error(error);
        setPostLiked((prev) => !prev);
      },
    });
  };

  const postComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) {
      return;
    }
    await request<Post>({
      endpoint: `/api/v1/feed/posts/${post.id}/comments`,
      method: "POST",
      body: JSON.stringify({ content }),
      onSuccess: (data) => {
        setComments((prev) => [data, ...prev]);
        setContent("");
      },
      onFailure: (error) => {
        console.error(error);
      },
    });
  };

  const deleteComment = async (id: number) => {
    await request<void>({
      endpoint: `/api/v1/feed/comments/${id}`,
      method: "DELETE",
      onSuccess: () => {
        setComments((prev) => prev.filter((c) => c.id !== id));
      },
      onFailure: (error) => {
        console.error(error);
      },
    });
  };

  const editComment = async (id: number, content: string) => {
    await request<Comment>({
      endpoint: `/api/v1/feed/comments/${id}`,
      method: "PUT",
      body: JSON.stringify({ content }),
      onSuccess: (data) => {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === id) {
              return data;
            }
            return c;
          })
        );
      },
      onFailure: (error) => {
        console.error(error);
      },
    });
  };

  const deletePost = async (id: number) => {
    await request<void>({
      endpoint: `/api/v1/feed/posts/${id}`,
      method: "DELETE",
      onSuccess: () => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      },
      onFailure: (error) => {
        console.error(error);
      },
    });
  };

  const editPost = async (content: string, picture: string) => {
    await request<Post>({
      endpoint: `/api/v1/feed/posts/${post.id}`,
      method: "PUT",
      body: JSON.stringify({ content, picture }),
      onSuccess: (data) => {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === post.id) {
              return data;
            }
            return p;
          })
        );
        setShowMenu(false);
      },
      onFailure: (error) => {
        throw new Error(error);
      },
    });
  };

  return (
    <>
      {editing ? (
        <Madal
          title="Editing your post"
          content={post.content}
          picture={post.picture}
          onSubmit={editPost}
          showModal={editing}
          setShowModal={setEditing}
        />
      ) : null}
      <div className={classes.root}>
        <div className={classes.top}>
          <div className={classes.author}>
            <button
              onClick={() => {
                navigate(`/profile/${post.author.id}`);
              }}
            >
              <img
                className={classes.avatar}
                src={post.author.profilePicture || "/me.jpeg"}
                alt=""
              />
            </button>
            <div>
              <div className={classes.name}>
                {post.author.firstName + " " + post.author.lastName}
              </div>
              <div className={classes.title}>
                {post.author.position + " at " + post.author.company}
              </div>
              <TimeAgo date={post.creationDate} edited={!!post.updatedDate} />
            </div>
          </div>
          <div>
            {post.author.id == user?.id && (
              <button
                className={`${classes.toggle} ${showMenu ? classes.active : ""}`}
                onClick={() => setShowMenu(!showMenu)}
              >
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#f6f3f3ff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title> <g id="dots"> <circle cx="16" cy="16" r="3"></circle> <circle cx="16" cy="8" r="3"></circle> <circle  cx="16" cy="24" r="3"></circle> <path  d="M16,13v6a3,3,0,0,0,0-6Z"></path> <path d="M16,5v6a3,3,0,0,0,0-6Z"></path> <path d="M16,21v6a3,3,0,0,0,0-6Z"></path> </g> </g></svg>
              </button>
            )}
            {showMenu && (
              <div className={classes.menu}>
                <button onClick={() => setEditing(true)}>
                <svg viewBox="0 0 1024 1024"  version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M823.3 938.8H229.4c-71.6 0-129.8-58.2-129.8-129.8V215.1c0-71.6 58.2-129.8 129.8-129.8h297c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.7 42.7h-297c-24.5 0-44.4 19.9-44.4 44.4V809c0 24.5 19.9 44.4 44.4 44.4h593.9c24.5 0 44.4-19.9 44.4-44.4V512c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v297c0 71.6-58.2 129.8-129.8 129.8z" fill="#3688FF"></path><path d="M483 756.5c-1.8 0-3.5-0.1-5.3-0.3l-134.5-16.8c-19.4-2.4-34.6-17.7-37-37l-16.8-134.5c-1.6-13.1 2.9-26.2 12.2-35.5l374.6-374.6c51.1-51.1 134.2-51.1 185.3 0l26.3 26.3c24.8 24.7 38.4 57.6 38.4 92.7 0 35-13.6 67.9-38.4 92.7L513.2 744c-8.1 8.1-19 12.5-30.2 12.5z m-96.3-97.7l80.8 10.1 359.8-359.8c8.6-8.6 13.4-20.1 13.4-32.3 0-12.2-4.8-23.7-13.4-32.3L801 218.2c-17.9-17.8-46.8-17.8-64.6 0L376.6 578l10.1 80.8z" fill="#5F6379"></path></g></svg>
               <span>Edit</span></button>
                <button onClick={() => deletePost(post.id)}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M779.5 1002.7h-535c-64.3 0-116.5-52.3-116.5-116.5V170.7h768v715.5c0 64.2-52.3 116.5-116.5 116.5zM213.3 256v630.1c0 17.2 14 31.2 31.2 31.2h534.9c17.2 0 31.2-14 31.2-31.2V256H213.3z" fill="#3688FF"></path><path d="M917.3 256H106.7C83.1 256 64 236.9 64 213.3s19.1-42.7 42.7-42.7h810.7c23.6 0 42.7 19.1 42.7 42.7S940.9 256 917.3 256zM618.7 128H405.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h213.3c23.6 0 42.7 19.1 42.7 42.7S642.2 128 618.7 128zM405.3 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7S448 403 448 426.6v256c0 23.6-19.1 42.7-42.7 42.7zM618.7 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v256c-0.1 23.6-19.2 42.7-42.7 42.7z" fill="#5F6379"></path></g></svg>
                <span>Delete</span></button>
              </div>
            )}
          </div>
        </div>
        <div className={classes.content}>{post.content}</div>
        {post.picture && <img src={post.picture} alt="" className={classes.picture} />}
        <div className={classes.stats}>
          {likes.length > 0 ? (
            <div className={classes.stat}>
              <span>{postLiked ? "You " : likes[0].firstName + " " + likes[0].lastName + " "}</span>
              {likes.length - 1 > 0 ? (
                <span>
                  and {likes.length - 1} {likes.length - 1 === 1 ? "other" : "others"}
                </span>
              ) : null}{" "}
              liked this
            </div>
          ) : (
            <div></div>
          )}

          {comments.length > 0 ? (
            <button className={classes.stat} onClick={() => setShowComments((prev) => !prev)}>
              <span>{comments.length} comments</span>
            </button>
          ) : (
            <div></div>
          )}
        </div>
        <div className={classes.actions}>
          <button
            disabled={postLiked == undefined}
            onClick={like}
            className={postLiked ? classes.active : ""}
          >
            <svg fill="#181b22" viewBox="0 0 32 32"  version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="matrix(1,0,0,1,-384,-96)"> <g transform="matrix(1.2,0,0,0.9375,-77.4,7.625)"> <path d="M392,108.133C392,106.955 391.254,106 390.333,106C389.797,106 389.203,106 388.667,106C387.746,106 387,106.955 387,108.133C387,111.196 387,116.804 387,119.867C387,121.045 387.746,122 388.667,122C389.203,122 389.797,122 390.333,122C391.254,122 392,121.045 392,119.867C392,116.804 392,111.196 392,108.133Z" ></path> </g> <g transform="matrix(1,0,0,1,201.034,-162)"> <path d="M196,270.464C196,270.113 196.092,269.768 196.268,269.464C196.909,268.353 198.545,265.52 199.423,264C199.78,263.381 200.44,263 201.155,263C201.279,263 201.41,263 201.542,263C202.144,263 202.714,263.271 203.094,263.738C203.473,264.204 203.623,264.817 203.501,265.406C203.263,266.55 202.99,267.867 202.797,268.797C202.736,269.091 202.811,269.398 203.001,269.631C203.191,269.865 203.476,270 203.776,270C205.355,270 208.117,270 210,270C210.53,270 211.039,270.211 211.414,270.586C211.789,270.961 212,271.47 212,272C212,273.998 212,276.96 212,278.298C212,278.753 211.845,279.193 211.562,279.548C210.843,280.446 209.413,282.234 208.6,283.249C208.221,283.724 207.646,284 207.039,284C205.085,284 200.613,284 198,284C196.895,284 196,283.105 196,282C196,278.713 196,272.346 196,270.464Z"></path> </g> <path d="M404.811,107C404.811,107 405.514,103.609 405.514,103.609C405.698,102.726 405.473,101.806 404.904,101.106C404.334,100.406 403.479,100 402.577,100L402.189,100C401.117,100 400.127,100.572 399.591,101.5C398.713,103.02 397.078,105.853 396.436,106.964C396.173,107.42 396.034,107.937 396.034,108.464L396.034,120C396.034,121.657 397.377,123 399.034,123L408.073,123C408.984,123 409.846,122.586 410.416,121.874C411.228,120.859 412.658,119.071 413.377,118.173C413.802,117.641 414.034,116.98 414.034,116.298L414.034,110C414.034,109.204 413.718,108.441 413.156,107.879C412.593,107.316 411.83,107 411.034,107L404.811,107ZM394,109C394,107.343 392.657,106 391,106L389,106C387.343,106 386,107.343 386,109C386,111.871 386,117.129 386,120C386,121.657 387.343,123 389,123L391,123C392.657,123 394,121.657 394,120L394,109ZM398.034,120L398.034,108.464C398.034,108.289 398.08,108.116 398.168,107.964L401.323,102.5C401.502,102.191 401.832,102 402.189,102C402.189,102 402.577,102 402.577,102C402.878,102 403.162,102.135 403.352,102.369C403.542,102.602 403.617,102.909 403.556,103.203L402.852,106.594C402.73,107.183 402.88,107.796 403.259,108.262C403.639,108.729 404.209,109 404.811,109L411.034,109C411.299,109 411.554,109.105 411.741,109.293C411.929,109.48 412.034,109.735 412.034,110L412.034,116.298C412.034,116.526 411.957,116.746 411.815,116.923L408.854,120.625C408.664,120.862 408.377,121 408.073,121C408.073,121 399.034,121 399.034,121C398.482,121 398.034,120.552 398.034,120ZM392,109L392,120C392,120.552 391.552,121 391,121C391,121 389,121 389,121C388.448,121 388,120.552 388,120L388,109C388,108.448 388.448,108 389,108C389,108 391,108 391,108C391.552,108 392,108.448 392,109Z" ></path> </g> </g></svg>
            <span>{postLiked == undefined ? "Loading" : postLiked ? "Liked" : "Like"}</span>
          </button>
          <button
            onClick={() => {
              setShowComments((prev) => !prev);
            }}
            className={showComments ? classes.active : ""}
          >
            <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path fillRule="evenodd" clipRule="evenodd" fill="#181b22" d="M50,12H4c-1.105,0-2,0.895-2,2v30c0,1.105,0.895,2,2,2h8 c1.105,0,2,0.895,2,2c0,0,0,11,0,12c0,1.391,1.859,3.141,4,1c2-2,14-14,14-14s0.709-1,2.656-1C35.313,46,50,46,50,46 c1.105,0,2-0.895,2-2V14C52,12.895,51.105,12,50,12z"></path> <path fillRule="evenodd" clipRule="evenodd" fill="#181b22" d="M60,2H16c-1.105,0-2,0.895-2,2v6h36c2.211,0,4,1.789,4,4v20h6 c1.105,0,2-0.895,2-2V4C62,2.895,61.105,2,60,2z"></path> </g> <g> <path fill="#394240" d="M60,0H16c-2.211,0-4,1.789-4,4v6H4c-2.211,0-4,1.789-4,4v30c0,2.211,1.789,4,4,4h7c0.553,0,1,0.447,1,1v11 c0,1.617,0.973,3.078,2.469,3.695C14.965,63.902,15.484,64,16,64c1.039,0,2.062-0.406,2.828-1.172l14.156-14.156 c0,0,0.516-0.672,1.672-0.672S50,48,50,48c2.211,0,4-1.789,4-4v-8h6c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z M52,44 c0,1.105-0.895,2-2,2c0,0-14.687,0-15.344,0C32.709,46,32,47,32,47S20,59,18,61c-2.141,2.141-4,0.391-4-1c0-1,0-12,0-12 c0-1.105-0.895-2-2-2H4c-1.105,0-2-0.895-2-2V14c0-1.105,0.895-2,2-2h46c1.105,0,2,0.895,2,2V44z M62,32c0,1.105-0.895,2-2,2h-6 V14c0-2.211-1.789-4-4-4H14V4c0-1.105,0.895-2,2-2h44c1.105,0,2,0.895,2,2V32z"></path> <path fill="#394240" d="M13,24h13c0.553,0,1-0.447,1-1s-0.447-1-1-1H13c-0.553,0-1,0.447-1,1S12.447,24,13,24z"></path> <path fill="#394240" d="M41,28H13c-0.553,0-1,0.447-1,1s0.447,1,1,1h28c0.553,0,1-0.447,1-1S41.553,28,41,28z"></path> <path fill="#394240" d="M34,34H13c-0.553,0-1,0.447-1,1s0.447,1,1,1h21c0.553,0,1-0.447,1-1S34.553,34,34,34z"></path> </g> <path opacity="0.15" fillRule="evenodd" clipRule="evenodd" fill="#231F20" d="M62,32c0,1.105-0.895,2-2,2h-6V14 c0-2.211-1.789-4-4-4H14V4c0-1.105,0.895-2,2-2h44c1.105,0,2,0.895,2,2V32z"></path> </g> </g></svg>
            <span>Comment</span>
          </button>
        </div>

        {showComments ? (
          <div className={classes.comments}>
            <form onSubmit={postComment}>
              <Input
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="Add a comment..."
                name="content"
                style={{ marginBlock: 0 }}
              />
            </form>

            {comments.map((comment) => (
              <Comment
                editComment={editComment}
                deleteComment={deleteComment}
                key={comment.id}
                comment={comment}
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}