import Image from 'next/image'
import React, { useState } from 'react'

import style from '@/components/pages/comment/GetComment.module.css'
import { commentDataType } from '@/types/commentDataType';
import { commentDatas } from '@/data/dummy/commentData';
import Separator from '@/components/ui/Separator';
import CommentUserInfo from './CommentUserInfo';
import ReplyComment from './ReplyComment';
import Comment from './Comment';

export default function GetComment(props: { episodeId: number, }) {

  const [commentData] = useState<commentDataType[]>(commentDatas);
  const [openReply, setOpenReply] = useState(false);
  const [isAuthor] = useState(false);

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
        commentData.map((data, idx) => (
          <div key={idx}>
            <Comment
              data={data}
              isAuthor={isAuthor}
              handlePush={handlePush}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleDislike={handleDislike}
              handleView={handleView}
              handleDeclaration={handleDeclaration}
            />
            {
              openReply &&
                data.childId ?
                <ReplyComment /> : ""
            }
          </div>
        ))
      }
    </>
  )
}