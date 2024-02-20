import React, { useState } from "react";
import { Media } from "../../../../types/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import SideMenu from "../../SideMenu/SideMenu";

const SwiperWithMedia = ({ mediaProp, index }: { mediaProp: Media[], index: number }) => {
    const [media, setMedia] = useState<Media[]>(mediaProp)
    const [isDoubleClick, setIsDoubleClick] = useState<boolean>(false)
    return (
        <>
        <Swiper key={1}
        modules={[Navigation, Pagination, EffectFade]}
                effect="fade"
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}
                centeredSlides={true}
                loop={true}
                style={{ backgroundColor: "#2f0000"}}
                onDoubleClick={() => setIsDoubleClick(true)}
        >
            {media.map((media) => (
                <SwiperSlide style={{ textAlign: "center"}} key={media._id}><div style={{ background: "#240000", height: "100%"}}>
                    {media.fullUrl && <img style={{ objectFit: "contain" }} src={media.fullUrl} alt={media.fullUrl} /> }
                    </div></SwiperSlide>
            ))}
        </Swiper>
        
        <SideMenu indexMenu={index} isDoubleClick={isDoubleClick}></SideMenu>
        </>
    );
};

export default SwiperWithMedia;
