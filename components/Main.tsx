import React, {useRef} from 'react'
import Events from "../app/events/page"

const style = {
    background: `flex bg-black h-screen relative justify-center flex-wrap items-center `,
    ctaContainer: `flex`,
    accentedButton: ` relative text-lg font-semibold px-10 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-10 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    h1: `relative text-white text-[46px] font-bold`,
    p: `text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    textwrap: `white`

}


const Main = () => {

    const eventsRef = useRef<HTMLDivElement| null >(null);

    // Scroll function to scroll to the Events section
    const handleScrollToEvents = () => {
    if (eventsRef.current) {
        eventsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
        <div className={style.background}>
            <div className={style.textwrap}>
                <h1 className={style.h1}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br /> Curabitur gravida lacus mauris,</h1>
                <p className={style.p}>This is some dummy text for the hero section.</p>
            <div className={style.ctaContainer}>
              <button className={style.accentedButton} onClick={handleScrollToEvents}>Explore</button>
              <button className={style.button}>Create</button>
            </div>
            </div>
        </div>
        <div ref={eventsRef}>
        <Events />
        </div>
        </div>
        
    )
}

export default Main
