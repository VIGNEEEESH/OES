import nft1 from "assets/img/nfts/NftBanner1.png";
import Logo from "assets/img/Logo/Mega minds.png";
const Banner1 = () => {
  return (
    <div
      className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[64px] md:py-[56px]"
      style={{ backgroundImage: `url(${nft1})` }}
    >
      <div className="flex w-full items-center justify-between">
        <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px] lg:w-[46%] xl:w-[85%] 2xl:w-[75%] 3xl:w-[52%]">
          Mega Minds Edutech
        </h4>
        &nbsp;&nbsp;
        <img
          src={Logo}
          alt="mega minds classes logo"
          style={{
            width: "160px",
            height: "auto",
            borderRadius: "50%", // Apply rounded corners
          }}
        />
        {/* <p className="mb-[40px] max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
          Enter in this creative world. Discover now the latest NFTs or start
          creating your own!
        </p>

        <div className="mt-[36px] flex items-center justify-between gap-4 sm:justify-start 2xl:gap-10">
          <button className="text-black linear rounded-xl bg-white px-4 py-2 text-center text-base font-medium transition duration-200 hover:!bg-white/80 active:!bg-white/70">
            Discover now
          </button>
          <button
            href=" "
            className="text-base font-medium text-lightPrimary hover:text-lightPrimary 2xl:ml-2"
          >
            Watch Video
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Banner1;
