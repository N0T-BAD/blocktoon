import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react';
import axios from 'axios';

import style from '@/components/pages/episodeviewer/FooterViewer.module.css'

import BackBtn from '@/components/ui/BackBtn';
import CloseBtn from '@/components/ui/CloseBtn';
import Episode from '../webtoonepisode/Episode';
import { EpisodeViewDataType } from '@/types/webtoonDataType';
import RatingModal from '@/components/modals/RatingModal';
import Swal from 'sweetalert2';

export default function FooterViewer(props: { episodeData: EpisodeViewDataType, isViewer: boolean, setIsViewer: React.Dispatch<React.SetStateAction<boolean>> }) {

  const { data: session } = useSession();
  const router = useRouter();
  const data = props.episodeData.data;
  const { webtoonId } = router.query;
  const { episodeId } = router.query;
  const { episodeNumber } = router.query;

  const [myBlock, setMyBlock] = useState<number>(0);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [isRatingData, setIsRatingData] = useState(false);
  const [value, setValue] = useState<number>(0);

  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [episodeIdModal, setEpisodeIdModal] = useState<number>(0);
  const [episodeNumberModal, setEpisodeIdNumberModal] = useState<number>(0);
  const [episodePriceModal, setEpisodePriceModal] = useState<number>(0);

  const nextId = Number(episodeId) + 1;
  const nextNumber = Number(episodeNumber) + 1;

  const handleShowPurchaseModal = (episodeId: number, episodeNumber: number, episodePrice: number) => {
    setEpisodeIdModal(episodeId)
    setEpisodeIdNumberModal(episodeNumber)
    setEpisodePriceModal(episodePrice)
    setShowPurchaseModal(true);
  }

  const handleLogin = () => {
    Swal.fire({
      icon: 'warning',
      text: '로그인이 필요한 서비스입니다.',
      showConfirmButton: false,
      timer: 2000
    }).then(result => {
      router.push('/login');
    })
  }

  const handleShowRating = () => {
    if (session) {
      setShowRatingModal(!showRatingModal);
    } else {
      Swal.fire({
        icon: 'warning',
        text: '로그인이 필요한 서비스입니다.',
        showConfirmButton: false,
        timer: 2000
      }).then(result => {
        router.push('/login');
      })
    }
  }

  const handleIsRating = () => {
    if (value === 0) {
      Swal.fire({
        icon: 'warning',
        text: '1~10을 입력해주세요',
        showConfirmButton: false,
        timer: 2000
      })
    } else if (session) {
      axios.post(`https://blockpage.site/member-service/v1/ratings`, {
        episodeId: episodeId,
        webtoonId: webtoonId,
        ratings: value,
      }, {
        headers: {
          memberId: session?.email,
        }
      })
        .then((res) => {
          setIsRating(!isRating);
          setIsRatingData(true);
          setShowRatingModal(!showRatingModal);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  useEffect(() => {
    if (session) {
      axios.get(`https://blockpage.site/block-service/v1/blocks`, {
        headers: { memberId: session.email }
      })
        .then((res) => {
          setMyBlock(res.data.data.totalBlocks);
        })
        .catch((err) => {
          console.log(err);
        })

      axios.get(`https://blockpage.site/member-service/v1/ratings/${episodeId}`, {
        headers: {
          memberId: session.email
        }
      })
        .then((res) => {
          setValue(res.data.data.ratings);
          setIsRatingData(res.data.data.choice);
          console.log(res);
        })
        .catch((err) => {
          setIsRatingData(false);
          console.log(err);
        })
    }
  }, [session?.email])

  return (
    <>
      {
        showRatingModal &&
        <RatingModal
          handleShowRating={handleShowRating}
          handleIsRating={handleIsRating}
          setValue={setValue}
          value={value}
        />
      }
      <footer
        className={
          props.isViewer ? `${style.viewerFooterWrap} ${style.view}` : `${style.viewerFooterWrap}`
        }
      >
        <div className={style.top}>
          <div className={style.ratingBtn} onClick={value !== 0 ? undefined : handleShowRating}>
            <p>★</p>
            {
              value !== 0 ?
                <p>{value}</p>
                : ""
            }
            {
              isRatingData ?
                <p>참여완료</p>
                : <p>평점주기</p>
            }
          </div>
          <div className={style.close}>
            <CloseBtn
              width={20}
              height={20}
              onClick={() => props.setIsViewer(false)}
            />
          </div>
        </div>
        <div className={style.authorSection}>
          <div className={style.authorMent}>
            <p>작가의 말</p>
            <p>{data.author}</p>
          </div>
          <div className={style.authorComment}>
            <p>{data.authorWords}</p>
          </div>
        </div>
        {
          data.nextEpisodeThumbnail !== "" ?
            <div
              className={style.nextEpisode}
              onClick={
                data.nextEpisodeBlockPrice > 0 ?
                  (
                    !session?.email ?
                      () => handleLogin() :
                      myBlock >= 4 ?
                        () => handleShowPurchaseModal(nextId, nextNumber, data.nextEpisodeBlockPrice) :
                        () => router.push('/blockcharge')
                  )
                  :
                  () => router.push(`/webtoon/${webtoonId}/episode/${nextId}/episode/${nextNumber}`)
              }
            >
              <p className={style.nextTxt}>다음화</p>
              <Episode
                subject={data.nextEpisodeTitle}
                thumbnail={data.nextEpisodeThumbnail}
                rating={data.rating}
                uploadDate={data.nextUploadDate}
                price={data.nextEpisodeBlockPrice}
              />
            </div>
            :
            <div>
              <p>마지막화입니다.</p>
            </div>
        }
        <NavFooter
          author={data.author}
        />
      </footer >
    </>
  )
}

const NavFooter = (props: { author: string }) => {
  const { data: session } = useSession();

  const router = useRouter();
  const { webtoonId } = router.query;
  const { episodeId } = router.query;
  const { episodeNumber } = router.query;

  const [isViewer, setIsViewer] = useState<boolean>(false);

  const handleLogin = () => {
    Swal.fire({
      icon: 'warning',
      text: '로그인이 필요한 서비스입니다.',
      showConfirmButton: false,
      timer: 2000
    }).then(result => {
      router.push('/login');
    })
  }

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0].clientY > 100) {
        setIsViewer(true);
      }
    };
    window.addEventListener("touchmove", handleTouch);
    return () => {
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsViewer(false);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={isViewer ? `${style.navFoot} ${style.close}` : style.navFoot}>
      <div className={style.btn}>
        <BackBtn
          onClick={() => router.back()}
        />
      </div>
      <div className={style.btn} onClick={session ? () => router.push(
        {
          pathname: `/webtoon/${webtoonId}/episode/${episodeId}/episode/${episodeNumber}/comment`,
          query: { author: props.author },
        }
      ) : () => handleLogin()

      }>
        <Image
          src={'/assets/images/icons/comment.svg'}
          alt="commentBtnIcon"
          width={30}
          height={25}
          priority
        />
      </div>
      <div className={style.btn}>
      </div>
    </div >
  )
}
