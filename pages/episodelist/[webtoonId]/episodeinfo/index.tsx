import { NextPageWithLayout } from "@/pages/_app"
import EpisodeInfoTopSection from "@/components/pages/episodeinfo/EpisodeInfoTopSection"
import EpisodeInfoBottomSection from "@/components/pages/episodeinfo/EpisodeInfoBottomSection"
import TotalLayout from "@/components/layouts/TotalLayout"
import { useEffect, useState } from "react";
import axios from "axios";
import { EpisodeViewListType } from "@/types/webtoonDataType";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const EpisodeInfo: NextPageWithLayout = () => {


    return (
        <>
            <EpisodeInfoTopSection />
            <EpisodeInfoBottomSection />
        </>
    )
}

EpisodeInfo.getLayout = function getLayout(EpisodeInfo: React.ReactElement) {
    return (
        <TotalLayout>
            {EpisodeInfo}
        </TotalLayout>
    )
}

export default EpisodeInfo
