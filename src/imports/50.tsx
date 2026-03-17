import svgPaths from "./svg-64pcybd5do";
import imgImage489 from "figma:asset/bfe4a23c2f7ade9ccf466d9d67ff1ed823aa6839.png";
import { imgGroup, imgGroup1 } from "./svg-ahcr5";

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[0_-19.5%_-8.5%_0] mask-position-[0px,_0px] mask-size-[30px_30px,_30px_30px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
      <div className="absolute inset-[-266.36%_-251.05%_-276.5%_-244.77%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 213.6 209.25">
          <g id="Group">
            <path d={svgPaths.p376d2180} fill="var(--fill-0, #646FC6)" id="Vector" />
            <path d={svgPaths.p376d2180} fill="var(--fill-0, #646FC6)" id="Vector_2" />
            <g filter="url(#filter0_f_8_563)" id="Group_2">
              <path d={svgPaths.p1a388c0} fill="var(--fill-0, #646FC6)" id="Vector_3" />
              <path d={svgPaths.p37030640} fill="var(--fill-0, #646FC6)" id="Vector_4" />
              <path d={svgPaths.pf763b40} fill="var(--fill-0, #646FC6)" id="Vector_5" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="209.25" id="filter0_f_8_563" width="213.6" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_8_563" stdDeviation="45" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Mask group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <MaskGroup />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function MaskGroup1() {
  return <div className="absolute contents inset-0" data-name="Mask group" />;
}

function Frame() {
  return (
    <div className="overflow-clip relative shrink-0 size-[30px]" data-name="Frame">
      <ClipPathGroup />
      <MaskGroup1 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-[100px] top-[43px]">
      <Frame />
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#646fc6] text-[28px] text-nowrap tracking-[-0.56px]">ShipX</p>
    </div>
  );
}

function ArrowTopRight() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow top right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow top right">
          <path d={svgPaths.p2fbe4a80} id="stroke" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2ed3d170} id="stroke_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute bg-[#646fc6] content-stretch flex items-center left-[124px] p-[14px] rounded-[22px] size-[44px] top-[5px]">
      <ArrowTopRight />
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.1)] border-solid h-[56px] left-[calc(50%+532.5px)] overflow-clip rounded-[60px] top-[32px] translate-x-[-50%] w-[175px]">
      <p className="absolute font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] left-[62px] text-[18px] text-black text-center text-nowrap top-[16px] tracking-[-0.36px] translate-x-[-50%]">Get Started</p>
      <Frame20 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 overflow-clip px-[24px] py-[13px] rounded-[40px] top-0">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-black text-center text-nowrap tracking-[-0.32px]">Home</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[89px] overflow-clip px-[24px] py-[13px] rounded-[40px] top-0">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-black text-center text-nowrap tracking-[-0.32px]">About</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.05)] content-stretch flex items-center justify-center left-[179px] overflow-clip px-[24px] py-[13px] rounded-[40px] top-0">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-black text-center text-nowrap tracking-[-0.32px]">Solutions</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[288px] overflow-clip px-[24px] py-[13px] rounded-[40px] top-0">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-black text-center text-nowrap tracking-[-0.32px]">Blog</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute h-[45px] left-1/2 overflow-clip rounded-[60px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[366px]">
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute h-[120px] left-0 overflow-clip top-0 w-[1440px]">
      <Frame18 />
      <Frame19 />
      <Frame12 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="h-[38px] relative rounded-[50px] shrink-0">
      <div className="content-stretch flex h-full items-center justify-center overflow-clip px-[16px] py-[9px] relative rounded-[inherit]">
        <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-black text-center text-nowrap tracking-[-0.32px]">Powering fast moves</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[50px]" />
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-center leading-[normal] left-1/2 text-center top-0 translate-x-[-50%] w-[665px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold min-w-full relative shrink-0 text-[#131735] text-[72px] tracking-[-1.44px] w-[min-content]">Smart Solutions for Shipping</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium relative shrink-0 text-[18px] text-[rgba(19,23,53,0.6)] tracking-[-0.36px] w-[397px]">ShipX offers smart shipping tools that simplify logistics for modern businesses</p>
    </div>
  );
}

function Frame115() {
  return (
    <div className="h-[232px] relative shrink-0 w-full">
      <div className="absolute h-[63px] left-[160px] top-[100px] w-[349px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 349 63">
          <path d={svgPaths.p2eefde00} fill="var(--fill-0, #646FC6)" fillOpacity="0.2" id="Vector 6" />
        </svg>
      </div>
      <Frame23 />
    </div>
  );
}

function Frame116() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      <Frame22 />
      <Frame115 />
    </div>
  );
}

function ArrowRight() {
  return (
    <div className="relative size-[16px]" data-name="arrow right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow right">
          <path d="M2 8H14" id="stroke" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p14ccfb80} id="stroke_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex items-center p-[14px] relative rounded-[22px] shrink-0 size-[44px]">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <ArrowRight />
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#646fc6] content-stretch flex gap-[24px] items-center overflow-clip pl-[24px] pr-[6px] py-[6px] relative rounded-[60px] shrink-0">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[18px] text-center text-nowrap text-white tracking-[-0.36px]">Contact us</p>
      <Frame21 />
    </div>
  );
}

function ArrowRight1() {
  return (
    <div className="relative size-[16px]" data-name="arrow right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow right">
          <path d="M2 8H14" id="stroke" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p14ccfb80} id="stroke_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#f3f3f3] content-stretch flex items-center p-[14px] relative rounded-[22px] shrink-0 size-[44px]">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <ArrowRight1 />
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[rgba(255,255,255,0.4)] relative rounded-[60px] shrink-0">
      <div className="content-stretch flex gap-[24px] items-center overflow-clip pl-[24px] pr-[6px] py-[6px] relative rounded-[inherit]">
        <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#131735] text-[18px] text-center text-nowrap tracking-[-0.36px]">Get Started</p>
        <Frame26 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[60px]" />
    </div>
  );
}

function Frame119() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame25 />
      <Frame24 />
    </div>
  );
}

function Frame117() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[388px] top-[160px] w-[665px]">
      <Frame116 />
      <Frame119 />
    </div>
  );
}

function Frame114() {
  return (
    <div className="absolute h-[322px] left-[1251px] top-[198px] w-[98px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 322">
        <g id="Frame 2121454166">
          <line id="Line 508" stroke="url(#paint0_linear_8_508)" strokeOpacity="0.4" x1="89.5" x2="89.5" y1="2.18557e-08" y2="322" />
          <line id="Line 509" stroke="url(#paint1_linear_8_508)" strokeOpacity="0.4" x1="9.5" x2="9.50001" y1="2.18557e-08" y2="322" />
          <path d={svgPaths.p31fa7680} fill="var(--fill-0, #646FC6)" id="Star 8" />
          <path d={svgPaths.p25488b00} fill="var(--fill-0, #646FC6)" id="Star 9" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_508" x1="88.5" x2="88.5" y1="6.55671e-08" y2="322">
            <stop stopOpacity="0" />
            <stop offset="0.494951" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_8_508" x1="8.5" x2="8.50001" y1="6.55671e-08" y2="322">
            <stop stopOpacity="0" />
            <stop offset="0.494951" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame113() {
  return (
    <div className="absolute h-[322px] left-[100px] top-[198px] w-[98px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 322">
        <g id="Frame 2121454166">
          <line id="Line 508" stroke="url(#paint0_linear_8_508)" strokeOpacity="0.4" x1="89.5" x2="89.5" y1="2.18557e-08" y2="322" />
          <line id="Line 509" stroke="url(#paint1_linear_8_508)" strokeOpacity="0.4" x1="9.5" x2="9.50001" y1="2.18557e-08" y2="322" />
          <path d={svgPaths.p31fa7680} fill="var(--fill-0, #646FC6)" id="Star 8" />
          <path d={svgPaths.p25488b00} fill="var(--fill-0, #646FC6)" id="Star 9" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_508" x1="88.5" x2="88.5" y1="6.55671e-08" y2="322">
            <stop stopOpacity="0" />
            <stop offset="0.494951" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_8_508" x1="8.5" x2="8.50001" y1="6.55671e-08" y2="322">
            <stop stopOpacity="0" />
            <stop offset="0.494951" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame27() {
  return <div className="bg-[#646fc6] h-[33.487px] rounded-[4.186px] shrink-0 w-[12.557px]" />;
}

function Frame28() {
  return (
    <div className="absolute content-stretch flex gap-[12.557px] items-center left-[25.11px] top-[25.11px] w-[170.572px]">
      <Frame27 />
      <p className="font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[20.929px] text-black text-nowrap tracking-[-0.4186px]">Analytical View</p>
    </div>
  );
}

function VuesaxBoldArrowDown() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.7433 16.7433">
        <g id="arrow-down">
          <path d={svgPaths.p3dafa3f0} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function BoldArrowDown() {
  return (
    <div className="relative shrink-0 size-[16.743px]" data-name="bold/arrow-down">
      <VuesaxBoldArrowDown />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4.186px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[16.743px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.3349px]">Monthly</p>
      <BoldArrowDown />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[50.23px] left-[699.03px] rounded-[25.115px] top-[25.11px]">
      <div className="content-stretch flex flex-col h-full items-center justify-center overflow-clip px-[16.743px] py-[13.604px] relative rounded-[inherit]">
        <Frame3 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.046px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[25.115px]" />
    </div>
  );
}

function VuesaxLinearSetting() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/setting-4">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.7433 16.7433">
        <g id="setting-4">
          <path d="M15.348 4.53464H11.1622" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.04645" />
          <path d="M4.18582 4.53464H1.39527" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.04645" />
          <path d={svgPaths.p1665c480} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.04645" />
          <path d="M15.348 12.2086H12.5575" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.04645" />
          <path d="M5.58109 12.2086H1.39527" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.04645" />
          <path d={svgPaths.p31bbc700} id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.04645" />
          <g id="Vector_7" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxLinearSetting1() {
  return (
    <div className="absolute left-1/2 size-[16.743px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="vuesax/linear/setting-4">
      <VuesaxLinearSetting />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute border-[1.046px] border-[rgba(0,0,0,0.1)] border-solid left-[352.65px] overflow-clip rounded-[25.115px] size-[50.23px] top-[25.11px]">
      <VuesaxLinearSetting1 />
    </div>
  );
}

function VuesaxLinearTrendUp() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/trend-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.7433 16.7433">
        <g id="trend-up">
          <path d={svgPaths.p36599f00} id="Vector" stroke="var(--stroke-0, #2BB048)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.04645" />
          <path d={svgPaths.p2ce8e800} id="Vector_2" stroke="var(--stroke-0, #2BB048)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.04645" />
          <path d={svgPaths.p672b800} id="Vector_3" stroke="var(--stroke-0, #2BB048)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.04645" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxLinearTrendUp1() {
  return (
    <div className="relative shrink-0 size-[16.743px]" data-name="vuesax/linear/trend-up">
      <VuesaxLinearTrendUp />
    </div>
  );
}

function Frame108() {
  return (
    <div className="absolute content-stretch flex gap-[6.279px] items-center left-1/2 top-[220.8px] translate-x-[-50%]">
      <VuesaxLinearTrendUp1 />
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#2bb048] text-[14.65px] text-nowrap tracking-[-0.293px]">
        <span>{`5.2% `}</span>
        <span className="text-[rgba(0,0,0,0.6)]">Increase</span>
      </p>
    </div>
  );
}

function Frame109() {
  return (
    <div className="absolute bg-white h-[278.357px] left-1/2 overflow-clip rounded-[25.115px] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.06)] top-[56px] translate-x-[-50%] w-[428px]">
      <Frame28 />
      <p className="absolute font-['Urbanist:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%-68.54px)] text-[33.486px] text-black text-nowrap top-[172.66px] tracking-[-0.6697px]">$544,658</p>
      <Frame1 />
      <Frame9 />
      <div className="absolute left-[54.94px] size-[318.122px] top-[80.57px]">
        <div className="absolute bottom-1/2 left-0 right-0 top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 318.122 159.061">
            <path d={svgPaths.p22459e00} fill="url(#paint0_linear_8_506)" id="Ellipse 2984" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_506" x1="159.061" x2="13.0807" y1="-8.70111e-06" y2="163.247">
                <stop stopColor="#646FC6" />
                <stop offset="1" stopColor="#646FC6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[54.94px] size-[318.122px] top-[80.57px]">
        <div className="absolute bottom-1/2 left-[72.66%] right-0 top-[9.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 86.9612 129.974">
            <path d={svgPaths.p3592cf00} fill="var(--fill-0, white)" fillOpacity="0.8" id="Ellipse 2985" />
          </svg>
        </div>
      </div>
      <Frame108 />
      <div className="absolute h-[129.76px] left-[212.43px] top-[109.88px] w-[94.181px]">
        <div className="absolute inset-[-0.71%_-1.35%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 96.7216 131.604">
            <path d={svgPaths.p8465e60} id="Vector 7755" stroke="url(#paint0_linear_8_504)" strokeWidth="3.13935" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_504" x1="95.4513" x2="1.27036" y1="0.922024" y2="130.682">
                <stop />
                <stop offset="0.450845" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[302.42px] size-[8.372px] top-[105.69px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.37164 8.37164">
          <circle cx="4.18582" cy="4.18582" fill="var(--fill-0, black)" id="Ellipse 2989" r="4.18582" />
        </svg>
      </div>
    </div>
  );
}

function Frame111() {
  return (
    <div className="absolute bg-white h-[317px] left-0 overflow-clip rounded-[24px] top-0 w-[540px]">
      <Frame109 />
    </div>
  );
}

function Frame29() {
  return <div className="bg-[#646fc6] h-[24.449px] rounded-[3.056px] shrink-0 w-[9.169px]" />;
}

function Frame64() {
  return (
    <div className="absolute content-stretch flex gap-[9.169px] items-center left-[18.34px] top-[18.34px]">
      <Frame29 />
      <p className="font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[18.337px] text-black text-nowrap tracking-[-0.3667px]">Stock Trends</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Urbanist:Regular',sans-serif] font-normal gap-[30.562px] items-start leading-[1.3] left-[18.34px] text-[10.697px] text-black top-[73.35px] tracking-[-0.2139px] w-[19.101px]">
      <p className="relative shrink-0 w-full">80K</p>
      <p className="relative shrink-0 w-full">60K</p>
      <p className="relative shrink-0 w-full">40K</p>
      <p className="relative shrink-0 w-full">20K</p>
      <p className="relative shrink-0 w-full">0</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="absolute content-stretch flex font-['Urbanist:Regular',sans-serif] font-normal gap-[47.371px] items-center leading-[1.3] left-[47.37px] text-[10.697px] text-black text-nowrap top-[273.53px] tracking-[-0.2139px]">
      <p className="relative shrink-0">1</p>
      <p className="relative shrink-0">5</p>
      <p className="relative shrink-0">10</p>
      <p className="relative shrink-0">15</p>
      <p className="relative shrink-0">20</p>
      <p className="relative shrink-0">25</p>
      <p className="relative shrink-0">30</p>
    </div>
  );
}

function Frame32() {
  return <div className="bg-[#cabdff] h-[15.281px] rounded-[3.056px] shrink-0 w-[19.101px]" />;
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[6.112px] items-center relative shrink-0">
      <Frame32 />
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[12.225px] text-black text-nowrap tracking-[-0.2445px]">Total Product</p>
    </div>
  );
}

function Frame33() {
  return <div className="bg-[#b5e4ca] h-[15.281px] rounded-[3.056px] shrink-0 w-[19.101px]" />;
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[6.112px] items-center relative shrink-0">
      <Frame33 />
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[12.225px] text-black text-nowrap tracking-[-0.2445px]">Available</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="absolute content-stretch flex gap-[30.562px] items-center left-[calc(50%+0.38px)] top-[305.62px] translate-x-[-50%]">
      <Frame36 />
      <Frame37 />
    </div>
  );
}

function Frame90() {
  return (
    <div className="absolute h-[133.326px] left-[47.75px] top-[99.33px] w-[350.697px]">
      <div className="absolute inset-[0_-0.03%_-2.29%_-0.24%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 351.663 136.381">
          <g id="Frame 2121453522">
            <path d={svgPaths.p20339960} id="Vector 7746" stroke="url(#paint0_linear_8_496)" strokeWidth="1.52809" />
            <path d={svgPaths.p3c575e00} fill="url(#paint1_linear_8_496)" fillOpacity="0.7" id="Vector 7747" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_496" x1="346.203" x2="-1.43745" y1="3.05734" y2="132.945">
              <stop stopColor="#CABDFF" stopOpacity="0" />
              <stop offset="0.502332" stopColor="#CABDFF" />
              <stop offset="1" stopColor="#CABDFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_8_496" x1="1.23571" x2="351.932" y1="101.617" y2="101.617">
              <stop stopColor="#CABDFF" stopOpacity="0" />
              <stop offset="0.498622" stopColor="#CABDFF" />
              <stop offset="1" stopColor="#CABDFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="absolute left-[215.46px] size-[15.281px] top-[165.03px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2809 15.2809">
        <g id="Frame 2121453406">
          <rect fill="var(--fill-0, #000019)" height="15.2809" rx="7.64045" width="15.2809" />
          <circle cx="7.64045" cy="7.64045" fill="var(--fill-0, white)" id="Ellipse 2972" r="3.82022" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBoldArrowDown1() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/arrow-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.2247 12.2247">
        <g id="arrow-down">
          <path d={svgPaths.p174b500} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function BoldArrowDown1() {
  return (
    <div className="relative shrink-0 size-[12.225px]" data-name="bold/arrow-down">
      <VuesaxBoldArrowDown1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[3.056px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[12.225px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2445px]">Monthly</p>
      <BoldArrowDown1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[36.674px] relative rounded-[18.337px] shrink-0">
      <div className="content-stretch flex flex-col h-full items-center justify-center overflow-clip px-[12.225px] py-[9.933px] relative rounded-[inherit]">
        <Frame4 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.764px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[18.337px]" />
    </div>
  );
}

function VuesaxLinearSetting2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/setting-4">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.2247 12.2247">
        <g id="setting-4">
          <path d="M11.206 3.31086H8.14981" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.764045" />
          <path d="M3.05618 3.31086H1.01873" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.764045" />
          <path d={svgPaths.pb18f880} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.764045" />
          <path d="M11.206 8.91386H9.16854" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.764045" />
          <path d="M4.07491 8.91386H1.01873" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.764045" />
          <path d={svgPaths.p28491000} id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.764045" />
          <g id="Vector_7" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxLinearSetting3() {
  return (
    <div className="absolute left-1/2 size-[12.225px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="vuesax/linear/setting-4">
      <VuesaxLinearSetting2 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative rounded-[18.337px] shrink-0 size-[36.674px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <VuesaxLinearSetting3 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.764px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[18.337px]" />
    </div>
  );
}

function Frame43() {
  return (
    <div className="absolute content-stretch flex gap-[6.112px] items-center left-[284.99px] top-[18.34px]">
      <Frame2 />
      <Frame10 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="absolute content-stretch flex gap-[7.64px] h-[22.157px] items-center left-[168.09px] px-[7.64px] py-[3.056px] top-[160.45px] w-[46.607px]">
      <div className="absolute h-[22.157px] left-0 top-0 w-[46.245px]" data-name="Union">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.2454 22.1572">
          <path d={svgPaths.p24f7dfc0} fill="var(--fill-0, #000019)" id="Union" />
        </svg>
      </div>
      <p className="font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[1.3] relative shrink-0 text-[12.225px] text-nowrap text-white tracking-[-0.2445px]">$38K</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="absolute bg-white h-[340px] left-[calc(50%-0.07px)] rounded-[18.337px] top-[56px] translate-x-[-50%] w-[427.865px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Frame64 />
        <Frame35 />
        <Frame34 />
        <Frame38 />
        <div className="absolute h-0 left-[18.34px] top-[74.11px] w-[391.191px]">
          <div className="absolute inset-[-0.76px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 391.191 0.764045">
              <line id="Line 88" opacity="0.4" stroke="url(#paint0_linear_8_500)" strokeDasharray="2.29 2.29" strokeWidth="0.764045" x2="391.191" y1="0.382022" y2="0.382022" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_500" x1="0" x2="391.191" y1="1.26404" y2="1.26404">
                  <stop stopOpacity="0" />
                  <stop offset="0.504766" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute h-0 left-[18.34px] top-[257.48px] w-[391.191px]">
          <div className="absolute inset-[-0.76px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 391.191 0.764045">
              <line id="Line 88" opacity="0.4" stroke="url(#paint0_linear_8_500)" strokeDasharray="2.29 2.29" strokeWidth="0.764045" x2="391.191" y1="0.382022" y2="0.382022" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_500" x1="0" x2="391.191" y1="1.26404" y2="1.26404">
                  <stop stopOpacity="0" />
                  <stop offset="0.504766" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute h-0 left-[18.34px] top-[226.92px] w-[391.191px]">
          <div className="absolute inset-[-0.76px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 391.191 0.764045">
              <line id="Line 88" opacity="0.4" stroke="url(#paint0_linear_8_500)" strokeDasharray="2.29 2.29" strokeWidth="0.764045" x2="391.191" y1="0.382022" y2="0.382022" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_500" x1="0" x2="391.191" y1="1.26404" y2="1.26404">
                  <stop stopOpacity="0" />
                  <stop offset="0.504766" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute h-0 left-[18.34px] top-[196.36px] w-[391.191px]">
          <div className="absolute inset-[-0.76px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 391.191 0.764045">
              <line id="Line 88" opacity="0.4" stroke="url(#paint0_linear_8_500)" strokeDasharray="2.29 2.29" strokeWidth="0.764045" x2="391.191" y1="0.382022" y2="0.382022" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_500" x1="0" x2="391.191" y1="1.26404" y2="1.26404">
                  <stop stopOpacity="0" />
                  <stop offset="0.504766" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute h-0 left-[18.34px] top-[165.8px] w-[391.191px]">
          <div className="absolute inset-[-0.76px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 391.191 0.764045">
              <line id="Line 88" opacity="0.4" stroke="url(#paint0_linear_8_500)" strokeDasharray="2.29 2.29" strokeWidth="0.764045" x2="391.191" y1="0.382022" y2="0.382022" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_500" x1="0" x2="391.191" y1="1.26404" y2="1.26404">
                  <stop stopOpacity="0" />
                  <stop offset="0.504766" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute h-0 left-[18.34px] top-[135.24px] w-[391.191px]">
          <div className="absolute inset-[-0.76px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 391.191 0.764045">
              <line id="Line 88" opacity="0.4" stroke="url(#paint0_linear_8_500)" strokeDasharray="2.29 2.29" strokeWidth="0.764045" x2="391.191" y1="0.382022" y2="0.382022" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_500" x1="0" x2="391.191" y1="1.26404" y2="1.26404">
                  <stop stopOpacity="0" />
                  <stop offset="0.504766" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute h-0 left-[18.34px] top-[104.68px] w-[391.191px]">
          <div className="absolute inset-[-0.76px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 391.191 0.764045">
              <line id="Line 88" opacity="0.4" stroke="url(#paint0_linear_8_500)" strokeDasharray="2.29 2.29" strokeWidth="0.764045" x2="391.191" y1="0.382022" y2="0.382022" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_500" x1="0" x2="391.191" y1="1.26404" y2="1.26404">
                  <stop stopOpacity="0" />
                  <stop offset="0.504766" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <Frame90 />
        <div className="absolute h-[72.308px] left-[55.78px] top-[131.31px] w-[343.056px]">
          <div className="absolute inset-[-1.06%_-0.09%_-1.01%_-0.07%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 343.599 73.8013">
              <path d={svgPaths.p177e0880} id="Vector 7748" stroke="url(#paint0_linear_8_485)" strokeWidth="1.52809" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_485" x1="0.226284" x2="343.282" y1="36.9178" y2="36.9178">
                  <stop stopColor="#B5E4CA" stopOpacity="0" />
                  <stop offset="0.502969" stopColor="#B5E4CA" />
                  <stop offset="1" stopColor="#B5E4CA" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute h-[104.292px] left-[55.78px] top-[131.42px] w-[343.056px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 343.056 104.292">
            <path d={svgPaths.p139e96f0} fill="url(#paint0_linear_8_554)" fillOpacity="0.7" id="Vector 7749" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8_554" x1="343.056" x2="-7.86409e-07" y1="73.3483" y2="73.3483">
                <stop stopColor="#B5E4CA" stopOpacity="0" />
                <stop offset="0.495162" stopColor="#B5E4CA" />
                <stop offset="1" stopColor="#B5E4CA" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <Frame40 />
        <Frame43 />
        <Frame39 />
      </div>
      <div aria-hidden="true" className="absolute border-[#646fc6] border-[3px] border-solid inset-[-3px] pointer-events-none rounded-[21.337px] shadow-[0px_3.716px_59.454px_0px_rgba(100,111,198,0.25)]" />
    </div>
  );
}

function Frame110() {
  return (
    <div className="absolute bg-white h-[317px] left-[580px] overflow-clip rounded-[24px] top-0 w-[540px]">
      <Frame60 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-nowrap text-white tracking-[-0.2302px]">All</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-[#646fc5] content-stretch flex flex-col h-[34.531px] items-start overflow-clip px-[17.265px] py-[9.352px] relative rounded-[17.265px] shrink-0">
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-black text-nowrap tracking-[-0.2302px]">In Progress</p>
    </div>
  );
}

function Frame68() {
  return (
    <div className="h-[34.531px] relative rounded-[17.265px] shrink-0">
      <div className="content-stretch flex flex-col h-full items-start overflow-clip px-[17.265px] py-[9.352px] relative rounded-[inherit]">
        <Frame6 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.719px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[17.265px]" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-black text-nowrap tracking-[-0.2302px]">{` Out for Delivery`}</p>
    </div>
  );
}

function Frame69() {
  return (
    <div className="h-[34.531px] relative rounded-[17.265px] shrink-0">
      <div className="content-stretch flex flex-col h-full items-start overflow-clip px-[17.265px] py-[9.352px] relative rounded-[inherit]">
        <Frame7 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.719px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[17.265px]" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-black text-nowrap tracking-[-0.2302px]">Delivered</p>
    </div>
  );
}

function Frame67() {
  return (
    <div className="h-[34.531px] relative rounded-[17.265px] shrink-0">
      <div className="content-stretch flex flex-col h-full items-start overflow-clip px-[17.265px] py-[9.352px] relative rounded-[inherit]">
        <Frame8 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.719px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[17.265px]" />
    </div>
  );
}

function Frame78() {
  return (
    <div className="absolute content-stretch flex gap-[8.633px] items-center left-[17.27px] top-[57.55px]">
      <Frame41 />
      <Frame68 />
      <Frame69 />
      <Frame67 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Tata Ace</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame56() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.26px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">TA 2173 XRQ</p>
      <Frame52 />
    </div>
  );
}

function Frame54() {
  return <div className="absolute bg-[#cabdff] h-[5.755px] left-0 top-0 w-[76.255px]" />;
}

function Frame53() {
  return (
    <div className="bg-[rgba(202,189,255,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame54 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px_56.112px] items-start left-[17.26px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">70%</p>
      <Frame53 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[171.93px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #B13F3F)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#b13f3f] text-[11.51px] text-nowrap tracking-[-0.2302px]">Delayed</p>
    </div>
  );
}

function Frame70() {
  return (
    <div className="absolute bg-[rgba(202,189,255,0.2)] h-[123.735px] left-[17.27px] overflow-clip rounded-[11.51px] top-[109.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame56 />
      <Frame72 />
      <Frame45 />
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Dost</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame57() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.26px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">DS 8456 XRT</p>
      <Frame55 />
    </div>
  );
}

function Frame58() {
  return <div className="absolute bg-[#cabdff] h-[5.755px] left-0 top-0 w-[100.714px]" />;
}

function Frame59() {
  return (
    <div className="bg-[rgba(202,189,255,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame58 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px] items-start justify-between left-[17.26px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">100%</p>
      <Frame59 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[157.55px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #2BAF48)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#2baf48] text-[11.51px] text-nowrap tracking-[-0.2302px]">Completed</p>
    </div>
  );
}

function Frame80() {
  return (
    <div className="absolute bg-[rgba(202,189,255,0.2)] h-[123.735px] left-[17.27px] overflow-clip rounded-[11.51px] top-[250.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame57 />
      <Frame79 />
      <Frame44 />
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Carry</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame62() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.26px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">CY 4291 XRV</p>
      <Frame61 />
    </div>
  );
}

function Frame63() {
  return <div className="absolute bg-[#cabdff] h-[5.755px] left-0 top-0 w-[61.867px]" />;
}

function Frame65() {
  return (
    <div className="bg-[rgba(202,189,255,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame63 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px_56.112px] items-start left-[17.26px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">60%</p>
      <Frame65 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[171.93px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #B13F3F)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#b13f3f] text-[11.51px] text-nowrap tracking-[-0.2302px]">Delayed</p>
    </div>
  );
}

function Frame74() {
  return (
    <div className="absolute bg-[rgba(202,189,255,0.2)] h-[123.735px] left-[17.27px] overflow-clip rounded-[11.51px] top-[391.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame62 />
      <Frame81 />
      <Frame46 />
    </div>
  );
}

function Frame66() {
  return <div className="absolute bg-[#cabdff] h-[5.755px] left-0 top-0 w-[61.867px]" />;
}

function Frame82() {
  return (
    <div className="bg-[rgba(202,189,255,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame66 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px_56.112px] items-start left-[17.26px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">60%</p>
      <Frame82 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[171.93px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #B13F3F)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#b13f3f] text-[11.51px] text-nowrap tracking-[-0.2302px]">Delayed</p>
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Bolero</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame85() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.26px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">BL 7285 XRX</p>
      <Frame84 />
    </div>
  );
}

function Frame76() {
  return (
    <div className="absolute bg-[rgba(202,189,255,0.2)] h-[123.735px] left-[17.27px] overflow-clip rounded-[11.51px] top-[532.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame83 />
      <Frame47 />
      <Frame85 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Jeeto</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame87() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.27px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">MJ 3928 XRS</p>
      <Frame86 />
    </div>
  );
}

function Frame88() {
  return <div className="absolute bg-[#b1e5fc] h-[5.755px] left-0 top-0 w-[100.714px]" />;
}

function Frame89() {
  return (
    <div className="bg-[rgba(177,229,252,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame88 />
    </div>
  );
}

function Frame91() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px] items-start justify-between left-[17.27px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">100%</p>
      <Frame89 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[157.55px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #2BAF48)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#2baf48] text-[11.51px] text-nowrap tracking-[-0.2302px]">Completed</p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="absolute bg-[rgba(177,229,252,0.2)] h-[123.735px] left-[287.76px] overflow-clip rounded-[11.51px] top-[109.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame87 />
      <Frame91 />
      <Frame48 />
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Porter</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame93() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.27px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">PT 6732 XRU</p>
      <Frame92 />
    </div>
  );
}

function Frame94() {
  return <div className="absolute bg-[#b1e5fc] h-[5.755px] left-0 top-0 w-[48.918px]" />;
}

function Frame95() {
  return (
    <div className="bg-[rgba(177,229,252,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame94 />
    </div>
  );
}

function Frame96() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px] items-start justify-between left-[17.27px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">40%</p>
      <Frame95 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[171.93px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #B13F3F)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#b13f3f] text-[11.51px] text-nowrap tracking-[-0.2302px]">Delayed</p>
    </div>
  );
}

function Frame73() {
  return (
    <div className="absolute bg-[rgba(177,229,252,0.2)] h-[123.735px] left-[287.76px] overflow-clip rounded-[11.51px] top-[250.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame93 />
      <Frame96 />
      <Frame49 />
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Maxima</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame98() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.27px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">MX 5568 XRW</p>
      <Frame97 />
    </div>
  );
}

function Frame99() {
  return <div className="absolute bg-[#b1e5fc] h-[5.755px] left-0 top-0 w-[100.714px]" />;
}

function Frame100() {
  return (
    <div className="bg-[rgba(177,229,252,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame99 />
    </div>
  );
}

function Frame101() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px] items-start justify-between left-[17.27px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">100%</p>
      <Frame100 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[157.55px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #2BAF48)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#2baf48] text-[11.51px] text-nowrap tracking-[-0.2302px]">Completed</p>
    </div>
  );
}

function Frame75() {
  return (
    <div className="absolute bg-[rgba(177,229,252,0.2)] h-[123.735px] left-[287.76px] overflow-clip rounded-[11.51px] top-[391.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame98 />
      <Frame101 />
      <Frame50 />
    </div>
  );
}

function Frame102() {
  return <div className="absolute bg-[#b1e5fc] h-[5.755px] left-0 top-0 w-[100.714px]" />;
}

function Frame103() {
  return (
    <div className="bg-[rgba(177,229,252,0.25)] h-[5.755px] overflow-clip relative rounded-[4.316px] shrink-0 w-[100.714px]">
      <Frame102 />
    </div>
  );
}

function Frame104() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[4px] items-start justify-between left-[17.27px] top-[82.73px] w-[100.714px]">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Task</p>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">100%</p>
      <Frame103 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[5.755px] h-[21.582px] items-center justify-center left-[157.55px] overflow-clip px-[8.633px] py-[2.878px] rounded-[12.23px] shadow-[0px_0px_57.551px_0px_rgba(0,0,0,0.08)] top-[84.89px]">
      <div className="relative shrink-0 size-[5.755px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7551 5.7551">
          <circle cx="2.87755" cy="2.87755" fill="var(--fill-0, #2BAF48)" id="Ellipse 2973" r="2.87755" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#2baf48] text-[11.51px] text-nowrap tracking-[-0.2302px]">Completed</p>
    </div>
  );
}

function Frame105() {
  return (
    <div className="content-stretch flex gap-[5.755px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Eco</p>
      <div className="relative shrink-0 size-[4.316px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31633 4.31633">
          <circle cx="2.15816" cy="2.15816" fill="var(--fill-0, black)" fillOpacity="0.6" id="Ellipse 2973" r="2.15816" />
        </svg>
      </div>
      <p className="font-['Urbanist:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[11.51px] text-[rgba(0,0,0,0.6)] text-nowrap tracking-[-0.2302px]">Medium</p>
    </div>
  );
}

function Frame106() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.878px] items-start left-[17.27px] top-[17.26px] w-[101.434px]">
      <p className="font-['Urbanist:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14.388px] text-black tracking-[-0.2878px] w-full">EC 3159 XRY</p>
      <Frame105 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="absolute bg-[rgba(177,229,252,0.2)] h-[123.735px] left-[287.76px] overflow-clip rounded-[11.51px] top-[532.35px] w-[258.98px]">
      <div className="absolute h-[76.974px] left-[151.07px] shadow-[2.158px_0.719px_5.755px_0px_rgba(0,0,0,0.25)] top-[-7.19px] w-[112.765px]" data-name="image 489">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[133.12%] left-[-0.13%] max-w-none top-[-17.83%] w-[136.34%]" src={imgImage489} />
        </div>
      </div>
      <Frame104 />
      <Frame51 />
      <Frame106 />
    </div>
  );
}

function VuesaxLinearSetting4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/setting-4">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5102 11.5102">
        <g id="setting-4">
          <path d="M10.551 3.11735H7.67347" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.719388" />
          <path d="M2.87755 3.11735H0.959184" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.719388" />
          <path d={svgPaths.p297b74f0} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.719388" />
          <path d="M10.551 8.39286H8.63265" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.719388" />
          <path d="M3.83673 8.39286H0.959184" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.719388" />
          <path d={svgPaths.p3599380} id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.719388" />
          <g id="Vector_7" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxLinearSetting5() {
  return (
    <div className="absolute left-1/2 size-[11.51px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="vuesax/linear/setting-4">
      <VuesaxLinearSetting4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute border-[0.719px] border-[rgba(0,0,0,0.1)] border-solid overflow-clip right-[17.27px] rounded-[17.265px] size-[34.531px] top-[57.55px]">
      <VuesaxLinearSetting5 />
    </div>
  );
}

function Frame30() {
  return <div className="bg-[#646fc6] h-[23.02px] rounded-[2.878px] shrink-0 w-[8.633px]" />;
}

function Frame107() {
  return (
    <div className="absolute content-stretch flex gap-[8.633px] items-center left-[17.27px] top-[17.27px]">
      <Frame30 />
      <p className="font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[17.265px] text-black text-nowrap tracking-[-0.3453px]">Delivery Updates</p>
    </div>
  );
}

function Frame31() {
  return <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(255,255,255,0)] h-[51.796px] left-1/2 to-[#ffffff] translate-x-[-50%] w-[564px]" />;
}

function Frame42() {
  return (
    <div className="absolute bg-white h-[566.878px] left-[56px] overflow-clip rounded-[17.265px] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.06)] top-[56px] w-[564px]">
      <Frame78 />
      <Frame70 />
      <Frame80 />
      <Frame74 />
      <Frame76 />
      <Frame71 />
      <Frame73 />
      <Frame75 />
      <Frame77 />
      <Frame11 />
      <Frame107 />
      <Frame31 />
    </div>
  );
}

function Frame112() {
  return (
    <div className="absolute bg-white h-[317px] left-[1160px] overflow-clip rounded-[24px] top-0 w-[540px]">
      <Frame42 />
    </div>
  );
}

function Frame120() {
  return <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(248,248,248,0)] h-[97px] left-[calc(50%+2px)] to-[#f8f8f8] to-[88.7%] translate-x-[-50%] w-[1440px]" />;
}

function Frame118() {
  return (
    <div className="absolute h-[317px] left-[-132px] top-[586px] w-[1700px]">
      <Frame111 />
      <Frame110 />
      <Frame112 />
      <Frame120 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f8f8f8] relative size-full" data-name="50">
      <Frame17 />
      <Frame117 />
      <Frame114 />
      <Frame113 />
      <Frame118 />
    </div>
  );
}