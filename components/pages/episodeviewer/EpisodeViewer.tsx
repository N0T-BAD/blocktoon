import Image from 'next/image'
import React from 'react'

import { EpisodeListDataType } from '@/types/webtoonDataType'
import style from '@/components/pages/episodeviewer/EpisodeViewer.module.css'

export default function EpisodeViewer(props: { episodeData: EpisodeListDataType }) {
  return (
    <section className={style.viewer}>
      {
        props.episodeData.imgUrls.map((item) => (
          <div className={style.episodeImg} key={item.id}>
          <Image
            src={item.imgUrl}
            alt={`episode${item.id}`}
            width={390}
            height={400}
            priority
          />
          </div>
        ))
      }
    </section>
  )
}
