import React, { use, useEffect, useState } from 'react'
import style from '@/components/pages/blockcharge/BlockCharge.module.css'
import { chargeBlockData } from '@/data/chargeBlockData'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'next-auth/react'

type ChargeBlockData = {
  itemName: string;
  blockQuantity: number;
  totalAmount: number;
}

export default function BlockCharge() {

  const [block, setBlock] = useState<ChargeBlockData[]>([])
  const { data: session } = useSession()
  // const role = sessionStorage.getItem('role');

  useEffect(() => {
    setBlock(chargeBlockData)
  }, [])

  const handleblock = async (itemName: string, blockQuantity: number, totalAmount: number) => {
    try {
      const response = await axios.post('https://blockpage.site/block-service/v1/payments?type=kakao-ready', {
        itemName: itemName,
        blockQuantity: blockQuantity,
        totalAmount: totalAmount,
      }, {
        headers: {
          'Content-Type': 'application/json',
          memberId: session?.email,
        },
      });

      window.location.href = response.data.data.nextRedirectPcUrl;
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {block.map((block: ChargeBlockData) =>
        <div className={style.ChargeBlock} key={block.itemName}>
          <div className={style.ChargeBlock__title}>
            <p>{block.itemName}</p>
          </div>
          <div className={style.ChargeBlock_Button}>
            <button onClick={() => handleblock(block.itemName, block.blockQuantity, block.totalAmount)}>충전</button>
          </div>
        </div>
      )}
    </>
  )
}
