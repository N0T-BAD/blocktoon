import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import style from '@/components/pages/comment/GetComment.module.css'
import { commentDataType } from '@/types/commentDataType';
import { commentDatas } from '@/data/dummy/commentData';
import Separator from '@/components/ui/Separator';
import CommentUserInfo from './CommentUserInfo';

export default function GetComment(props: { episodeId: number }) {

  const [commentData] = useState<commentDataType[]>(commentDatas);
  const [isAuthor] = useState(false);
  const [openReply, setOpenReply] = useState(false);

  const handlePush = () => {

  }

  const handleDelete = () => {

  }

  const handleLike = () => {

  }

  const handleDislike = () => {

  }

  const handleView = () => {
    setOpenReply(!openReply);
  }

  const handleDeclaration = () => {
    //신고
  }

  return (
    <>
      {
        commentData &&
        commentData.map((data) => (
          <div key={data.id}>
            <div className={style.topSection}>
              <CommentUserInfo
                parentsNickname={data.parentsNickname}
                date={data.date}
              />
              <div className={style.topIcon}>
                {
                  isAuthor ?
                    <Image
                      src={"/assets/images/icons/pushpin.svg"}
                      alt='고정핀'
                      width={12}
                      height={12}
                      onClick={handlePush}
                      priority
                    /> : ""
                }
                <Image
                  src={"/assets/images/icons/trash.svg"}
                  alt='쓰레기통'
                  width={15}
                  height={15}
                  onClick={handleDelete}
                  priority
                />
              </div>
            </div>
            <p className={style.commentTxt}>{data.content}</p>
            <div className={style.bottomSection}>
              {
                data.replyCount > 0
                  ? <p onClick={handleView}>답글 {data.replyCount}</p>
                  : <p>답글 달기</p>
              }
              <div className={style.bottomIcon}>
                <div onClick={handleDeclaration}>
                  <Image
                    src={"/assets/images/icons/siren.svg"}
                    alt='신고'
                    width={14}
                    height={14}
                    priority
                  />
                </div>
                <div className={style.emotion}>
                  <Image
                    src={"/assets/images/icons/thumbsup.svg"}
                    alt='좋아요'
                    width={12}
                    height={12}
                    onClick={handleLike}
                    priority
                  />
                  <p>{data.likesCount}</p>
                </div>
                <div className={style.emotion}>
                  <Image
                    src={"/assets/images/icons/thumbsdown.svg"}
                    alt='싫어요'
                    width={12}
                    height={12}
                    onClick={handleDislike}
                    priority
                  />
                  <p>{data.dislikesCount}</p>
                </div>
              </div>
            </div>
            <Separator
              color='var(--bp-line-gray)'
              gutter={1}
            />
          </div>
        ))
      }
      {
        openReply ?
          <div className={style.replySection}>
            <div>
              <div className={style.profile}>
                <Image className={style.userImage1} src={"/assets/images/mypage/userImg.png"} alt={"userImg"} width={40} height={40} priority />
                <div>
                  <p>김태근</p>
                  <p className={style.date}>23-05-12 22:01</p>
                </div>
              </div>
            </div>
          </div>
          : ""
      }
    </>
  )
}