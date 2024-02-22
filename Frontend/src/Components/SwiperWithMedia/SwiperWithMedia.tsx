import { useState } from "react";
import { Media } from "../../../../types/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import SideMenu from "../../SideMenu/SideMenu";
import { useSelector } from "react-redux";
import { CurrentTheme } from "../../Store/themeSlice";
import "./../Slajder/Slajder.css"

const SwiperWithMedia = ({ mediaProp, index }: { mediaProp: Media[], index: number }) => {
    const [media] = useState<Media[]>(mediaProp)
    const [isDoubleClick, setIsDoubleClick] = useState<boolean>(false)
    const currentTheme = useSelector(CurrentTheme)

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
                onDoubleClick={() => setIsDoubleClick(true)}
        >
            {media.map((media) => (
                <SwiperSlide style={{ textAlign: "center"}} key={media._id}><div style={{ background: currentTheme.Primary, height: "100%"}}>
                    {media.fullUrl && <img style={{ objectFit: "contain" }} src={media.fullUrl} alt={media.fullUrl} /> }
                    </div></SwiperSlide>
            ))}
        </Swiper>
        
        <SideMenu indexMenu={index} isDoubleClick={isDoubleClick}></SideMenu>
        </>
    );
};

export default SwiperWithMedia;
