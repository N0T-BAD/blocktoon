import React from 'react'
import Image from 'next/image'

import style from '@/components/pages/webtoonepisode/WebtoonInfo.module.css'

import LikeViewSection from '@/components/ui/webtoonInfo/LikeViewSection';
import { WebToonListDataType } from '@/types/webtoonDataType'

export default function WebtoonInfo(props: { data: WebToonListDataType }) {
  const data = props.data.data;
  return (
    <>
      {
        <div className={style.bannerwrap}>
          <div className={style.bannerImg}>
            <Image src={data.webtoonMainImage} alt={data.webtoonTitle} width={600} height={600} priority />
          </div>
          <LikeViewSection
            viewHeight={20}
            viewWidth={20}
            views={data.views}
            likeHeight={15}
            likeWidth={15}
            likes={data.interestCount}
          />
          <p className={style.titleTxt}>{data.webtoonTitle}</p>
          <div className={style.info}>
            <p>{data.publicationDays}</p>
            <p>{data.genre}</p>
          </div>
          <div className={style.line}></div>
          <div className={style.author}>
            <p className={style.creator}>{data.creator}</p>
            {
              data.illustrator !== "" ?
                <p className={style.illustrator}>{data.illustrator}</p>
                : ""
            }
          </div>
        </div>
      }
    </>
  )
}
