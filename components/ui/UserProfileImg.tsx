import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import style from '@/components/pages/mypage/UserNickName.module.css'
import { ChangeUserDataType, ChangeUserImageDataType, profileskinDataType } from '@/types/changeUserDataType';
import { useSession } from 'next-auth/react';

export default function UserProfileImg() {

  const { data: session } = useSession();

  const [userprofileImg, setUserProfileImg] = useState<ChangeUserImageDataType>(
    {
      profileimage: '',
      profileskin: '',
    }
  );

  const [basicimg, setBasicImg] = useState<profileskinDataType>();

  // useEffect(() => {
  //   axios.get('http://localhost:3000/api/v1/members?type=profileimage')
  //     .then((res) => {
  //       setUserProfileImg(res.data);
  //     })
  //   axios.get('http://localhost:3000/api/v1/members?type=profileskin')
  //     .then((res) => {
  //       setUserProfileImg(res.data);
  //     })
  // }, [])

  return (
    <div className={style.userImage}>
      {
        session ?
          <Image
            src={userprofileImg.profileimage}
            alt="userProfileImagePreview"
            width={70}
            height={70}
          />
          : <Image
            src={"/assets/images/mypage/userImg.png"}
            alt="userProfileImagePreview"
            width={70}
            height={70}
          />
      }
    </div>
  )
}
