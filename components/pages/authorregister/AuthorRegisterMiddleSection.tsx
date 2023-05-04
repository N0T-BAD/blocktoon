import React from 'react'
import style from '@/components/pages/authorregister/AuthorRegisterMiddleSection.module.css'
import AuthorNicknameAgreement from './AuthorNicknameAgreement'
import AuthorSignupButton from './AuthorSignupButton'

export default function AuthorRegisterMiddleSection() {
  return (
    <section className={style.AuthorRegisterMiddleSection}>
      <AuthorNicknameAgreement />
    </section>
  )
}