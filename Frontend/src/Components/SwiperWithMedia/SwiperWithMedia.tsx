import React, { useState } from "react";
import { Media } from "../../../../types/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

const SwiperWithMedia = ({ mediaProp }: { mediaProp: Media[] }) => {
    const [media, setMedia] = useState<Media[]>(mediaProp)
    return (
        <Swiper key={1}
        modules={[Navigation, Pagination, EffectFade]}
                effect="fade"
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                centeredSlides={true}
                loop={true}
        >
            {media.map((media) => (
                <SwiperSlide style={{ textAlign: "center"}} key={media._id}><div style={{ background: "white", height: "100%"}}>
                    {media.fullUrl && <img style={{ objectFit: "contain" }} src={media.fullUrl} alt={media.fullUrl} /> }
                    </div></SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SwiperWithMedia;
