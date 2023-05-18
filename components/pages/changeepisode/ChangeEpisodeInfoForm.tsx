import React, { ChangeEvent, useEffect, useState } from 'react'
import style from '@/components/pages/episodeinfo/EpisodeInfoForm.module.css'
import { useRouter } from 'next/router';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { UploadedFile, changeEpisodeInfoFormDataType, episodeInfoFormDataType } from '@/types/episodeInfoForm';
import Image from 'next/image';
import { changeEpisodeInfoState } from '@/state/episode/changeEpisodeInfoState';

export default function ChangeEpisodeInfoForm() {

  const router = useRouter();

  const [episodeInfoData, setEpisodeInfoData] = useState<episodeInfoFormDataType>({
    id: '',
    title: '',
    episodetitle: '',
    episodedescription: '',
    day: '',
    authortalk: '',
    episodeThumbnail: '',
    episodeImage: '',
  });

  const [episodeThumbnailImage, setEpisodeThumbnailImage] = useState<File>();
  const [episodeImage, setEpisodeImage] = useState<File[]>([]);
  const [episodeThumbnailImagePreview, setEpisodeThumbnailImagePreview] = useState<string>();
  const [episodeImagePreview, setEpisodeImagePreview] = useState<UploadedFile[]>([]);

  useEffect(() => {
    console.log(episodeInfoData)
  }, [episodeInfoData])

  useEffect(() => {
    axios(`/api/authorwebtooninfo/${router.query.id}`)
      .then(res => res.data)
      .then(data => setEpisodeInfoData(data))
  }, [episodeInfoData])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEpisodeInfoData({
      ...episodeInfoData,
      [name]: value
    });
  };

  const handleThumbnailImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setEpisodeThumbnailImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setEpisodeThumbnailImage(e.target.files[0]);
    }
  };

  const handleEpisodeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) { // 파일이 존재하고, 길이가 1 이상인지 확인
      const uploadedFiles: File[] = Array.from(files);
      setEpisodeImage(uploadedFiles);

      const filePreviews: UploadedFile[] = uploadedFiles.map(file => ({
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      setEpisodeImagePreview(filePreviews);
    }
  };

  const handleRemoveEpisodeImage = (index: number) => {
    const updatedFiles = [...episodeImage];
    updatedFiles.splice(index, 1);
    setEpisodeImage(updatedFiles);

    const updatedPreviews = [...episodeImagePreview];
    updatedPreviews.splice(index, 1);
    setEpisodeImagePreview(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (episodeInfoData.episodetitle === '' || episodeInfoData.episodedescription === '' || episodeInfoData.day === '' || episodeInfoData.authortalk === '') {
      alert('에피소드 정보를 입력해주세요.')
    } else if (!episodeImage) {
      alert('웹툰 이미지를 입력해주세요.')
    } else if (!episodeThumbnailImage) {
      alert('웹툰 썸네일 이미지를 입력해주세요.')
    } else {
      axios.post('/api/authorwebtooninfo', {
        episodetitle: episodeInfoData.episodetitle,
        episodedescription: episodeInfoData.episodedescription,
        day: episodeInfoData.day,
        authortalk: episodeInfoData.authortalk,
        episodeThumbnailImage: episodeThumbnailImage,
        episodeImage: episodeImage,
      })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            alert('웹툰 정보가 등록되었습니다.')
            router.push('/authorworkslist')
          }
        })
    }
  };

  return (
    <>
      {episodeInfoData &&
        <div className={style.WebtoonDeleteInfoWrap}>
          <form onSubmit={handleSubmit}>
            <div className={style.webtoonInfoBox}>
              <p>작품명 : </p>
              <p className={style.title}>{episodeInfoData.title}</p>
            </div>
            <div className={style.webtoonInfoBox}>
              <p>에피소드 회차 : </p>
              <p className={style.title}>{episodeInfoData.id}화</p>
            </div>
            <div className={style.episodeInfoBox}>
              <p>에피소드 명 : </p>
              <input type="text" name="episodetitle" defaultValue={episodeInfoData.episodetitle} onChange={handleInput} />
            </div>
            <div className={style.episodeInfoBox}>
              <p>에피소드 내용 : </p>
              <input type="text" name="episodedescription" defaultValue={episodeInfoData.episodedescription} onChange={handleInput} />
            </div>
            <div className={style.episodeInfoBox}>
              <p>업로드 일 : </p>
              <input type="text" name="day" defaultValue={episodeInfoData.day} onChange={handleInput} />
            </div>
            <div className={style.episodeInfoBox}>
              <p>작가의 말 : </p>
              <input type="text" name="authortalk" defaultValue={episodeInfoData.authortalk} onChange={handleInput} />
            </div>
            <div className={style.episodeInfoImgBox}>
              <div className={style.labelBox}>
                <p>회차 썸네일 이미지</p>
                <label>
                  <div className={style.uploadbtn}>upload</div>
                  <input type="file" name='file' id="file" accept="image/*" onChange={handleThumbnailImage} defaultValue={episodeInfoData.episodeThumbnail} />
                </label>
              </div>
              {episodeThumbnailImagePreview && episodeThumbnailImagePreview.length > 1 ?
                <div className={style.ThumbnailBox}>
                  <Image src={episodeThumbnailImagePreview} alt="episodeThumbnailImagePreview" width={200} height={200} />
                </div>
                : <></>
              }
            </div>
            <div className={style.episodeInfoImgBox}>
              <div className={style.labelBox}>
                <p>에피소드 이미지 </p>
                <label>
                  <div className={style.uploadbtn}>upload</div>
                  <input type="file" id="file" name='file' defaultValue={episodeInfoData.episodeImage} accept="image/*" onChange={handleEpisodeImage} multiple />
                </label>
              </div>
              <div className={style.filelist}>
                {episodeImagePreview.map((preview, index) => (
                  <div className={style.filename}>
                    <p>{preview.name}</p>
                    <button onClick={() => handleRemoveEpisodeImage(index)}>삭제</button>
                  </div>
                ))}
              </div>
              {episodeImagePreview.length > 0 ?
                <div className={style.ImgPreview}>
                  {episodeImagePreview.map((preview, index) => (
                    <div className={style.episodeImg} key={index}>
                      <Image src={preview.preview} alt={`에피소드 ${index + 1}`} width={200} height={200} />
                    </div>
                  ))}
                </div>
                : <></>
              }
            </div>
            <div className={style.submit}>
              <button type="submit">등록</button>
            </div>
          </form>
        </div>
      }
    </>
  )
}