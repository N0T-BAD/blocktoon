import React, { useState } from 'react'
import style from '@/components/pages/authorregister/AuthorRegisterTopSection.module.css'
import AuthorRegister from '@/components/pages/authorregister/AuthorRegister'
import AuthorNicknameAgreement from '@/components/pages/authorregister/AuthorNicknameAgreement'
import { AuthorNicknameCheckDataType } from '@/types/authorSignupDataType'

export default function AuthorRegisterTopSection() {


  const [inputData, setInputData] = useState<AuthorNicknameCheckDataType>({
    nickname: '',
  });

  return (
    <>
      <section className={style.AuthorRegisterTopSection}>
        <AuthorRegister inputData={inputData} setInputData={setInputData} />
      </section>
      <section className={style.AuthorRegisterMiddleSection}>
        <AuthorNicknameAgreement inputData={inputData} setInputData={setInputData} />
      </section>
    </>
  )
}
