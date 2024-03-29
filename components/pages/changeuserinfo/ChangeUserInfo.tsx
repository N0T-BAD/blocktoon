import React, { useEffect, useState } from 'react'
import style from '@/components/pages/changeuserinfo/ChangeUserInfo.module.css'
import { ChangeUserDataType, UserImgData, changeProfileSkin, profileskinDataType } from '@/types/changeUserDataType'
import Image from 'next/image';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';
import { userprofile } from '@/state/mypage/userprofile';
import { usernickname } from '@/state/mypage/usernickname';
import { profileskin } from '@/state/mypage/profileskin';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';


export default function ChangeUserInfo() {
  const { data: session } = useSession()

  const [userprofileSkin, setUserProfileSkin] = useRecoilState<profileskinDataType>(profileskin)
  const [userNickname, setUserNickname] = useRecoilState<ChangeUserDataType>(usernickname);
  const [userImg, setUserImg] = useRecoilState<UserImgData>(userprofile);
  const router = useRouter();
  const [userProfileImage, setUserProfileImage] = useState<File>();
  const [userProfileImagePreview, setUserProfileImagePreview] = useState<string>();
  const [skin, setSkin] = useState(false);
  const [check, setCheck] = useState<number | null>(null);

  const [changeProfileSkin, setChangeProfileSkin] = useState<changeProfileSkin>({
    data: [{
      memberHasProfileSkinId: 0,
      profileSkinDetail: {
        profileSkinImage: "",
      }
    }]
  });

  const [changeProfileSkinbox, setChangeProfileSkinbox] = useState<changeProfileSkin>({
    data: [{
      memberHasProfileSkinId: 0,
      profileSkinDetail: {
        profileSkinImage: "",
      }
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://blockpage.site/member-service/v1/members?type=detail', {
          headers: {
            memberId: session?.email || '',
            // role: role,
          },
        });
        const { profileImage, nickname, profileSkin } = res.data.data;
        setUserImg({
          data: {
            profileImage,
          }
        });
        setUserNickname({
          data: {
            nickname,
          },
        });
        setUserProfileSkin({
          data: {
            profileSkin,
          }
        });

        const res2 = await axios.get("https://blockpage.site/purchase-service/v1/purchases?type=profileSkin", {
          headers: {
            memberId: session?.email || '',
            // role: role,
          },
        })
        setChangeProfileSkin(res2.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();

  }, [])

  const handleProfileSkinColor = (memberHasProfileSkinId: number, profileSkinImage: string) => {
    setSkin(true)
    setCheck(memberHasProfileSkinId);
    setChangeProfileSkinbox({
      data: [
        {
          memberHasProfileSkinId: memberHasProfileSkinId,
          profileSkinDetail: {
            profileSkinImage: profileSkinImage,
          },
        },
      ],
    });
  };

  const handleProfileSkinSubmit = () => {
    axios.put('https://blockpage.site/purchase-service/v1/purchases?type=profileSkin', {
      memberProfileSkinId: check,
    }, {
      headers: {
        memberId: session?.email || '',
        // role: role,
      },
    })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: '변경되었습니다.',
          showConfirmButton: false,
          timer: 1500
        })
      })
  }

  const handleuserProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setUserProfileImage(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickname({
      data: {
        nickname: e.target.value,
      }
    });
  };

  const handleBasicImageChange = () => {
    setUserProfileImagePreview("https://storage.googleapis.com/blockpage-bucket/c1ad0198-d375-4297-a7ce-e1e67a48c0a6%20.png");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userNickname.data.nickname) {
      alert("닉네임을 입력해주세요.")
    } else {
      const formData = new FormData();
      if (userProfileImage) {
        formData.append('newProfileImage', userProfileImage);
      } else if (userProfileImagePreview === "https://storage.googleapis.com/blockpage-bucket/c1ad0198-d375-4297-a7ce-e1e67a48c0a6%20.png") {
        formData.append('profileImage', String("https://storage.googleapis.com/blockpage-bucket/c1ad0198-d375-4297-a7ce-e1e67a48c0a6%20.png"));
      } else {
        formData.append('profileImage', userImg.data.profileImage);
      }
      formData.append('nickname', userNickname.data.nickname);

      axios.put('https://blockpage.site/member-service/v1/members?type=member',
        formData,
        {
          headers: {
            memberId: session?.email || '',
            // role: role,
          },
        })
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: '변경되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
  }

  const handleAdult = () => {
    Swal.fire({
      icon: 'error',
      title: '준비중인 서비스입니다.',
      showConfirmButton: false,
      timer: 1500
    })
  }

  return (
    <div className={style.userInfoWrap}>
      <form onSubmit={handleSubmit}>
        <section className={style.ChangeUserInfoTopSection}>
          <div className={style.usernicknameImgBox}>
            <div className={style.usernicknameImg}>
              <p className={style.profileSkintxt}>회원 정보</p>
              <div className={style.changeuserinfobox}>
                <>
                  <div className={style.profileskin}>
                    {!userProfileImagePreview ?
                      <Image src={userImg.data.profileImage} className={style.userProfileImagePreview} alt="userImg" width={70} height={70} />
                      :
                      <>
                        {userProfileImagePreview &&
                          <Image src={userProfileImagePreview} className={style.userProfileImagePreview} alt="userProfileImagePreview" width={70} height={70} />
                        }
                      </>
                    }

                    {skin === false ? (
                      userprofileSkin.data.profileSkin &&
                      <Image className={style.profileskinbox} src={userprofileSkin.data.profileSkin} alt={userprofileSkin.data.profileSkin} width={70} height={70} />
                    ) : (
                      <>
                        {
                          changeProfileSkinbox.data && changeProfileSkinbox.data.map((item) => (
                            <Image
                              key={item.memberHasProfileSkinId}
                              className={style.profileskinbox}
                              src={item.profileSkinDetail.profileSkinImage}
                              alt={item.profileSkinDetail.profileSkinImage}
                              width={70}
                              height={70}
                            />
                          ))
                        }
                      </>
                    )}
                  </div>

                  <div className={style.infobox}>
                    <div className={style.btn_input_box2}>
                      <label className={style.uploadBtn}>
                        <input type="file" accept="image/*" onChange={handleuserProfileImage} />
                        <p>프로필 변경</p>
                      </label>
                      <p className={style.basicimg} onClick={handleBasicImageChange}>기본 프로필</p>
                    </div>
                  </div>
                </>
              </div>
              <div className={style.usernicknamewrite}>
                <div className={style.btn_input_box}>
                  <p className={style.nicknametext}>닉네임</p>
                  <div className={style.infouserbox}>
                    {userNickname.data.nickname && userNickname.data.nickname.length > 0 ?
                      <input className={style.usernickname2} type='text' defaultValue={userNickname.data.nickname} onChange={handleChange} />
                      :
                      <input className={style.usernickname2} type='text' onChange={handleChange} />
                    }
                  </div>
                </div>
              </div>
              <button type="submit" className={style.changebtn}>변경</button>
            </div>
          </div>
        </section>
      </form>

      <section className={style.ChangeUserInfoMiddleSection}>
        <div className={style.usernicknameImgBox}>
          <div className={style.usernicknameImg}>
            <p className={style.profileSkintxt}>프로필 스킨</p>
            <div className={style.profileSkinWrap}>
              <div className={style.profileSkinBox}>
                <div className={check === null ? style.ProfileSkinButtonBox : style.ProfileSkinButtonBox2}>
                  {changeProfileSkin.data.map((skinData) => (
                    <>
                      <button
                        key={skinData.memberHasProfileSkinId}
                        onClick={() => handleProfileSkinColor(skinData.memberHasProfileSkinId, skinData.profileSkinDetail.profileSkinImage)}
                      >
                        {
                          changeProfileSkinbox.data && changeProfileSkinbox.data.map((item) => (item.memberHasProfileSkinId === skinData.memberHasProfileSkinId ?
                            <>
                              <Image src={"/assets/images/icons/check.png"} alt={"check"} width={15} height={15} className={style.check} />
                              <Image
                                src={skinData.profileSkinDetail.profileSkinImage}
                                alt={skinData.profileSkinDetail.profileSkinImage}
                                width={50}
                                height={50}
                                className={style.skinImg}
                              />
                            </>
                            :
                            <Image
                              key={skinData.memberHasProfileSkinId}
                              src={skinData.profileSkinDetail.profileSkinImage}
                              alt={skinData.profileSkinDetail.profileSkinImage}
                              width={50}
                              height={50}
                              className={style.skinImg}
                            />
                          ))}
                      </button>
                    </>
                  ))}
                </div>
              </div>
            </div>
            <button type="button" className={style.changebtn} onClick={handleProfileSkinSubmit}>변경</button>
          </div>
        </div>
      </section>
      <section className={style.ChangeUserInfoMiddleSection}>
        <div className={style.usernicknameImgBox}>
          <div className={style.usernicknameImg}>
            <p className={style.profileSkintxt}>성인 인증</p>
            <div className={style.certificationBox}>
              <p className={style.certificationtxt}>성인 인증을 하시면 다양한 작품을 감상할 수 있습니다.</p>
              <button className={style.changebtn} onClick={handleAdult}>인증</button>
            </div>
          </div>
        </div>
      </section>
      {/* <section className={style.ChangeUserInfoBottomSection}>
        <div className={style.ChangeButtonBox}>
          <button className={style.ChangeButton} onClick={() => router.push("/mypage")}>완료</button>
        </div>
      </section> */}
    </div>
  )
}