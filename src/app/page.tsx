"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function Home() {
  const [placeholder, setPlaceholder] = useState<string>("");
  const [focus, setFocus] = useState<boolean>(false);
  const [tabIconPosition, setTabIconPosition] = useState<number>(4);
  const [isTabIconVisible, setIsTabIconVisible] = useState<boolean>(false);
  const [isCTAVisible, setIsCTAVisible] = useState<boolean>(false);
  const [isTyping, setTyping] = useState<boolean>(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

   useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', checkScreenSize);

    checkScreenSize();
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const mainElement = document.querySelector("main") as HTMLDivElement;
      if (!mainElement) {
        return;
      }
      mainElement.style.opacity = "0";
      window.onload = () => {
        mainElement.style.opacity = "1";
      };
    });
  }, []);

  const navRef = useRef(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const svgRef = useRef(null);

  useEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -15, filter: "blur(5px)" });
    sectionRefs.current.forEach((section) => {
      gsap.set(section, { opacity: 0, y: 15, filter: "blur(5px)" });
    });

    gsap.to(navRef.current, {
      opacity: 1,
      y: 0, 
      filter: "blur(0px)",
      duration: 1.5,
      ease: "power2.out",
    });

    sectionRefs.current.forEach((section, index) => {
      gsap.to(section, {
        opacity: 1.5,
        y: 0, 
        filter: "blur(0px)", 
        duration: 1.2,
        delay: index * 0.12,
        ease: "power2.out",
      });
    });

    if (svgRef.current) {
      const path = (svgRef.current as SVGSVGElement).querySelector('path');
      if (!path) {
        return;
      }
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        delay: 1,
        duration: 3,
        ease: "power.inOut",
      });
    }


  }, []);

  const texts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor sed do",
    "Lorem ipsum dolor sit amet, consectetur elit",
    "Lorem ipsum dolor sit amet, consectetur do eiusmod tempor incididunt ut labore",
    "Lorem ipsum dolor sit amet, consectetur sed do eiusmod tempor",
  ];

  const currentIndex = useRef<number>(0);
  const typeText = (text: string) => {
    let currentText = "";
    let i = 0;

    typingRef.current = setInterval(() => {
      if (i < text.length) {
        currentText += text[i];
        setPlaceholder(currentText);
        setTabIconPosition(3.5 + currentText.length / 1.32);
        i++;
      } else {
        clearInterval(typingRef.current as number);
        setTimeout(() => deleteText(text), 3500);
      }
    }, 80);
  };

  const deleteText = (text: string) => {
    let currentText = text;

    typingRef.current = setInterval(() => {
      currentText = currentText.slice(0, -1);
      setPlaceholder(currentText);
      setTabIconPosition(3.5 + currentText.length / 1.32);

      if (currentText === "") {
        clearInterval(typingRef.current as number);
        currentIndex.current = (currentIndex.current + 1) % texts.length;
        if (!focus) {
          typeText(texts[currentIndex.current]);
        }
      }
    }, 15);
  };

  useEffect(() => {
    typeText(texts[currentIndex.current]);

    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
    };
  }, []);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
    if (!typingRef.current) {
      typeText(texts[currentIndex.current]);
    }
  };

  const handleInput = () => {
    clearInterval(typingRef.current as number); 
  };

  const handleTabIconClick = () => {
    setTyping(!isTyping);
    setIsTabIconVisible(false);
    setTimeout(() => {
      document.getElementById("prompt")?.focus();
    }, 100);
    setTimeout(() => {
      document.getElementById("prompt")!.value = placeholder;
    }, 10);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      handleTabIconClick();
    }
  };

  useEffect(() => {
    if (
      document.getElementById("prompt").value.length > 0 
    ) {
      setIsCTAVisible(true);
    } else {
      setIsCTAVisible(false);
    }
    if (document.getElementById("prompt").value.length > 0) {
      setIsTabIconVisible(false);
    } else if (placeholder.length < 12) {
      setIsTabIconVisible(false);
    } else {
      setIsTabIconVisible(true);
    }
  }, [placeholder, isTyping]);

  return (
    <div
      id="page-wrapper"
      className="font-[family-name:var(--font-ibm)] w-screen overflow-hidden "
    >

      <Image
        src="/gradient-img.svg"
        alt="bg"
        fill={true}
        className="w-full h-[200vh] absolute -z-10 object-cover"
      />

      <nav
        ref={navRef}
        className="flex relative justify-between items-center md:py-5 py-2 max-w-[72rem] mx-auto px-4 sm:px-8"
      >
        <div className="bg-gradient-to-r from-[transparent] via-[#363636] to-[#363636] h-[1px] width-[100vw] transform translate-x-[30vw] absolute bottom-0 left-0 right-0"></div>
        <div className="bg-gradient-to-r to-[transparent] via-[#363636] from-[#363636] h-[1px] width-[100vw] transform translate-x-[-30vw] absolute bottom-0 left-0 right-0"></div>
        <div className="items-center flex">
          <a href="#">
            <svg
              width="107"
              height="24"
              viewBox="0 0 107 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.97058 2.51471V12L7.80882 10.7647C3.97059 8.55882 1.58823 4.45588 1.58823 0H0V10.8529C0 14.3824 2.02941 17.6471 5.25 19.1912L10.0147 21.4853V12L12.1765 13.2353C16.0147 15.4412 18.3971 19.5441 18.3971 24H19.9853V13.1471C19.9853 9.61764 17.9559 6.35294 14.7353 4.80882L9.97058 2.51471Z"
                fill="white"
              />
              <path
                d="M29.4236 19V5.90909H37.6309V7.60938H31.3987V11.598H37.2027V13.2919H31.3987V17.2997H37.7077V19H29.4236ZM48.515 9.18182L44.9546 19H42.9092L39.3424 9.18182H41.3943L43.8808 16.7372H43.983L46.4632 9.18182H48.515ZM54.2087 19.1982C53.2414 19.1982 52.4083 18.9915 51.7094 18.5781C51.0148 18.1605 50.4779 17.5746 50.0986 16.8203C49.7236 16.0618 49.5361 15.1733 49.5361 14.1548C49.5361 13.1491 49.7236 12.2628 50.0986 11.4957C50.4779 10.7287 51.0063 10.13 51.6839 9.69957C52.3657 9.26918 53.1626 9.05398 54.0745 9.05398C54.6285 9.05398 55.1654 9.1456 55.6853 9.32884C56.2052 9.51207 56.6718 9.79972 57.0851 10.1918C57.4985 10.5838 57.8245 11.093 58.0631 11.7195C58.3018 12.3416 58.4211 13.098 58.4211 13.9886V14.6662H50.6164V13.2344H56.5482C56.5482 12.7315 56.4459 12.2862 56.2414 11.8984C56.0368 11.5064 55.7492 11.1974 55.3785 10.9716C55.012 10.7457 54.5816 10.6328 54.0873 10.6328C53.5503 10.6328 53.0816 10.7649 52.681 11.0291C52.2847 11.2891 51.9779 11.63 51.7606 12.0518C51.5475 12.4695 51.441 12.9233 51.441 13.4134V14.532C51.441 15.1882 51.556 15.7464 51.7861 16.2067C52.0205 16.6669 52.3465 17.0185 52.7641 17.2614C53.1817 17.5 53.6697 17.6193 54.2279 17.6193C54.5901 17.6193 54.9204 17.5682 55.2187 17.4659C55.517 17.3594 55.7748 17.2017 55.9921 16.9929C56.2094 16.7841 56.3756 16.5263 56.4907 16.2195L58.2996 16.5455C58.1547 17.0781 57.8948 17.5447 57.5198 17.9453C57.1491 18.3416 56.6824 18.6506 56.1199 18.8722C55.5617 19.0895 54.9246 19.1982 54.2087 19.1982ZM60.5416 19V9.18182H62.3889V10.7415H62.4912C62.6702 10.2131 62.9855 9.79758 63.4372 9.49503C63.8932 9.18821 64.4088 9.0348 64.9841 9.0348C65.1034 9.0348 65.2441 9.03906 65.406 9.04759C65.5722 9.05611 65.7021 9.06676 65.7959 9.07955V10.9077C65.7192 10.8864 65.5828 10.8629 65.3868 10.8374C65.1908 10.8075 64.9948 10.7926 64.7987 10.7926C64.347 10.7926 63.9443 10.8885 63.5906 11.0803C63.2412 11.2678 62.9642 11.5298 62.7597 11.8665C62.5551 12.1989 62.4529 12.5781 62.4529 13.0043V19H60.5416ZM67.6032 19V5.90909H75.7211V7.60938H69.5784V11.598H75.1395V13.2919H69.5784V19H67.6032ZM79.9079 5.90909V19H77.9967V5.90909H79.9079ZM86.6148 19.1982C85.6943 19.1982 84.8911 18.9872 84.205 18.5653C83.5189 18.1435 82.9862 17.5533 82.607 16.7947C82.2277 16.0362 82.0381 15.1499 82.0381 14.1357C82.0381 13.1172 82.2277 12.2266 82.607 11.4638C82.9862 10.701 83.5189 10.1087 84.205 9.68679C84.8911 9.26491 85.6943 9.05398 86.6148 9.05398C87.5352 9.05398 88.3385 9.26491 89.0246 9.68679C89.7107 10.1087 90.2433 10.701 90.6226 11.4638C91.0019 12.2266 91.1915 13.1172 91.1915 14.1357C91.1915 15.1499 91.0019 16.0362 90.6226 16.7947C90.2433 17.5533 89.7107 18.1435 89.0246 18.5653C88.3385 18.9872 87.5352 19.1982 86.6148 19.1982ZM86.6212 17.5938C87.2178 17.5938 87.7121 17.4361 88.1041 17.1207C88.4962 16.8054 88.786 16.3857 88.9735 15.8615C89.1652 15.3374 89.2611 14.7599 89.2611 14.1293C89.2611 13.5028 89.1652 12.9276 88.9735 12.4034C88.786 11.875 88.4962 11.451 88.1041 11.1314C87.7121 10.8118 87.2178 10.652 86.6212 10.652C86.0203 10.652 85.5218 10.8118 85.1254 11.1314C84.7334 11.451 84.4415 11.875 84.2497 12.4034C84.0622 12.9276 83.9685 13.5028 83.9685 14.1293C83.9685 14.7599 84.0622 15.3374 84.2497 15.8615C84.4415 16.3857 84.7334 16.8054 85.1254 17.1207C85.5218 17.4361 86.0203 17.5938 86.6212 17.5938ZM95.1546 19L92.2654 9.18182H94.2405L96.1645 16.392H96.2604L98.1908 9.18182H100.166L102.084 16.3601H102.179L104.091 9.18182H106.066L103.183 19H101.233L99.2391 11.9112H99.0921L97.0977 19H95.1546Z"
                fill="white"
              />
            </svg>
          </a>
          <ul className="ml-8 space-x-2 text-sm font-medium  hidden md:flex">
            <li>
              <a
                className="flex py-1 gap-2 px-3 items-center hover:bg-[rgba(133,140,148,0.12)] rounded-4xl transition duration-300"
                href="#"
              >
                <span>Platform</span>
                <div className="w-4 h-4">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.3391 6.35375L9.33913 11.3538C9.29269 11.4002 9.23755 11.4371 9.17685 11.4623C9.11615 11.4874 9.05109 11.5004 8.98538 11.5004C8.91967 11.5004 8.85461 11.4874 8.79391 11.4623C8.73321 11.4371 8.67807 11.4002 8.63163 11.3538L3.63163 6.35375C3.56162 6.28382 3.51394 6.1947 3.49461 6.09765C3.47529 6.00061 3.48519 5.90002 3.52307 5.8086C3.56094 5.71719 3.62509 5.63908 3.70739 5.58414C3.78968 5.5292 3.88643 5.49992 3.98538 5.5H13.9854C14.0843 5.49992 14.1811 5.5292 14.2634 5.58414C14.3457 5.63908 14.4098 5.71719 14.4477 5.8086C14.4856 5.90002 14.4955 6.00061 14.4761 6.09765C14.4568 6.1947 14.4091 6.28382 14.3391 6.35375Z"
                      fill="#CFD3D8"
                      fill-opacity="0.3"
                    />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                className="flex py-1 gap-2 px-3 items-center hover:bg-[rgba(133,140,148,0.12)] rounded-4xl transition duration-300"
                href="#"
              >
                <span>Product</span>
                <div className="w-4 h-4">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.3391 6.35375L9.33913 11.3538C9.29269 11.4002 9.23755 11.4371 9.17685 11.4623C9.11615 11.4874 9.05109 11.5004 8.98538 11.5004C8.91967 11.5004 8.85461 11.4874 8.79391 11.4623C8.73321 11.4371 8.67807 11.4002 8.63163 11.3538L3.63163 6.35375C3.56162 6.28382 3.51394 6.1947 3.49461 6.09765C3.47529 6.00061 3.48519 5.90002 3.52307 5.8086C3.56094 5.71719 3.62509 5.63908 3.70739 5.58414C3.78968 5.5292 3.88643 5.49992 3.98538 5.5H13.9854C14.0843 5.49992 14.1811 5.5292 14.2634 5.58414C14.3457 5.63908 14.4098 5.71719 14.4477 5.8086C14.4856 5.90002 14.4955 6.00061 14.4761 6.09765C14.4568 6.1947 14.4091 6.28382 14.3391 6.35375Z"
                      fill="#CFD3D8"
                      fill-opacity="0.3"
                    />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                className="flex py-1 gap-2 px-3 items-center hover:bg-[rgba(133,140,148,0.12)] rounded-4xl transition duration-300"
                href="#"
              >
                <span>Pricing</span>
                <div className="w-4 h-4">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.3391 6.35375L9.33913 11.3538C9.29269 11.4002 9.23755 11.4371 9.17685 11.4623C9.11615 11.4874 9.05109 11.5004 8.98538 11.5004C8.91967 11.5004 8.85461 11.4874 8.79391 11.4623C8.73321 11.4371 8.67807 11.4002 8.63163 11.3538L3.63163 6.35375C3.56162 6.28382 3.51394 6.1947 3.49461 6.09765C3.47529 6.00061 3.48519 5.90002 3.52307 5.8086C3.56094 5.71719 3.62509 5.63908 3.70739 5.58414C3.78968 5.5292 3.88643 5.49992 3.98538 5.5H13.9854C14.0843 5.49992 14.1811 5.5292 14.2634 5.58414C14.3457 5.63908 14.4098 5.71719 14.4477 5.8086C14.4856 5.90002 14.4955 6.00061 14.4761 6.09765C14.4568 6.1947 14.4091 6.28382 14.3391 6.35375Z"
                      fill="#CFD3D8"
                      fill-opacity="0.3"
                    />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                className="flex py-1 gap-2 px-3 items-center hover:bg-[rgba(133,140,148,0.12)] rounded-4xl transition duration-300"
                href="#"
              >
                <span>Company</span>
                <div className="w-4 h-4">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.3391 6.35375L9.33913 11.3538C9.29269 11.4002 9.23755 11.4371 9.17685 11.4623C9.11615 11.4874 9.05109 11.5004 8.98538 11.5004C8.91967 11.5004 8.85461 11.4874 8.79391 11.4623C8.73321 11.4371 8.67807 11.4002 8.63163 11.3538L3.63163 6.35375C3.56162 6.28382 3.51394 6.1947 3.49461 6.09765C3.47529 6.00061 3.48519 5.90002 3.52307 5.8086C3.56094 5.71719 3.62509 5.63908 3.70739 5.58414C3.78968 5.5292 3.88643 5.49992 3.98538 5.5H13.9854C14.0843 5.49992 14.1811 5.5292 14.2634 5.58414C14.3457 5.63908 14.4098 5.71719 14.4477 5.8086C14.4856 5.90002 14.4955 6.00061 14.4761 6.09765C14.4568 6.1947 14.4091 6.28382 14.3391 6.35375Z"
                      fill="#CFD3D8"
                      fill-opacity="0.3"
                    />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                className="flex py-1 gap-2 px-3 items-center hover:bg-[rgba(133,140,148,0.12)] rounded-4xl transition duration-300"
                href="#"
              >
                <span>Resources</span>
                <div className="w-4 h-4">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.3391 6.35375L9.33913 11.3538C9.29269 11.4002 9.23755 11.4371 9.17685 11.4623C9.11615 11.4874 9.05109 11.5004 8.98538 11.5004C8.91967 11.5004 8.85461 11.4874 8.79391 11.4623C8.73321 11.4371 8.67807 11.4002 8.63163 11.3538L3.63163 6.35375C3.56162 6.28382 3.51394 6.1947 3.49461 6.09765C3.47529 6.00061 3.48519 5.90002 3.52307 5.8086C3.56094 5.71719 3.62509 5.63908 3.70739 5.58414C3.78968 5.5292 3.88643 5.49992 3.98538 5.5H13.9854C14.0843 5.49992 14.1811 5.5292 14.2634 5.58414C14.3457 5.63908 14.4098 5.71719 14.4477 5.8086C14.4856 5.90002 14.4955 6.00061 14.4761 6.09765C14.4568 6.1947 14.4091 6.28382 14.3391 6.35375Z"
                      fill="#CFD3D8"
                      fill-opacity="0.3"
                    />
                  </svg>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 text-sm">
          <button className="flex py-2 gap-2 px-3 items-center hover:bg-[rgba(133,140,148,0.12)] rounded-lg transition duration-300 cursor-pointer">
            Login
          </button>
          <button className="flex py-2 border hover:bg-[#162A69] border-[#4A6DD9] gap-2 px-3 items-center rounded-lg transition duration-300 cursor-pointer">
            Try for free
            <svg width="16" height="17" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.25 5.15145V14.179C16.25 14.3631 16.1768 14.5398 16.0466 14.67C15.9164 14.8002 15.7397 14.8734 15.5556 14.8734C15.3714 14.8734 15.1948 14.8002 15.0645 14.67C14.9343 14.5398 14.8612 14.3631 14.8612 14.179V6.82762L4.93611 16.7535C4.80581 16.8838 4.62908 16.957 4.44481 16.957C4.26053 16.957 4.08381 16.8838 3.9535 16.7535C3.8232 16.6232 3.75 16.4465 3.75 16.2622C3.75 16.0779 3.8232 15.9012 3.9535 15.7709L13.8794 5.84588H6.52808C6.34391 5.84588 6.16728 5.77271 6.03705 5.64249C5.90682 5.51226 5.83365 5.33563 5.83365 5.15145C5.83365 4.96728 5.90682 4.79065 6.03705 4.66042C6.16728 4.53019 6.34391 4.45703 6.52808 4.45703H15.5556C15.7397 4.45703 15.9164 4.53019 16.0466 4.66042C16.1768 4.79065 16.25 4.96728 16.25 5.15145Z" fill="#4A6DD9"/>
            </svg>

          </button>
        </div>
      </nav>

      <main className="max-w-[72rem] mx-auto flex flex-col px-2 sm:px-8 overflow-hidden"> 
        <div className="pt-14 pb-18 sm:pt-18 sm:pb-22 relative">
        <div className="bg-gradient-to-r from-[transparent] via-[transparent] to-[#363636] h-[1px] width-[100vw] transform translate-x-[30vw] absolute bottom-0 left-0 right-0"></div>
        <div className="bg-gradient-to-r to-[transparent] via-[#363636] from-[transparent] h-[1px] width-[100vw] transform  absolute bottom-0 left-0 right-0"></div>

          <svg width="100%" className="absolute top-0 left-0 right-0" viewBox="0 0 1152 254" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.6">
            <mask id="path-1-inside-1_15035_420" fill="white">
            <path d="M0 254L1152 254V0L0 0L0 254Z"/>
            </mask>
            <path d="M1152 254H1151V0H1152H1153V254H1152ZM0 0H1L1 254H0H-1L-1 0H0Z" fill="url(#paint0_linear_15035_420)" mask="url(#path-1-inside-1_15035_420)"/>
            <line y1="-0.5" x2="254" y2="-0.5" transform="matrix(-2.36287e-08 -1 -1 8.08629e-08 144 254)" stroke="url(#paint1_linear_15035_420)" stroke-dasharray="5 5"/>
            <line y1="-0.5" x2="254" y2="-0.5" transform="matrix(-2.36287e-08 -1 -1 8.08628e-08 288 254)" stroke="url(#paint2_linear_15035_420)"/>
            <line y1="-0.5" x2="254" y2="-0.5" transform="matrix(-2.36287e-08 -1 -1 8.08629e-08 432 254)" stroke="url(#paint3_linear_15035_420)" stroke-dasharray="5 5"/>
            <line y1="-0.5" x2="254" y2="-0.5" transform="matrix(-2.36287e-08 -1 -1 8.08629e-08 576 254)" stroke="url(#paint4_linear_15035_420)"/>
            <line y1="-0.5" x2="254" y2="-0.5" transform="matrix(-2.36287e-08 -1 -1 8.08628e-08 720 254)" stroke="url(#paint5_linear_15035_420)" stroke-dasharray="5 5"/>
            <line y1="-0.5" x2="254" y2="-0.5" transform="matrix(-2.36287e-08 -1 -1 8.08629e-08 864 254)" stroke="url(#paint6_linear_15035_420)"/>
            <line y1="-0.5" x2="254" y2="-0.5" transform="matrix(-2.36287e-08 -1 -1 8.08629e-08 1008 254)" stroke="url(#paint7_linear_15035_420)" stroke-dasharray="5 5"/>
            </g>
            <defs>
            <linearGradient id="paint0_linear_15035_420" x1="576" y1="254" x2="576" y2="-1.51396e-05" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#434343"/>
            </linearGradient>
            <linearGradient id="paint1_linear_15035_420" x1="0" y1="0.5" x2="254" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint2_linear_15035_420" x1="0" y1="0.5" x2="254" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint3_linear_15035_420" x1="0" y1="0.5" x2="254" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint4_linear_15035_420" x1="0" y1="0.5" x2="254" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint5_linear_15035_420" x1="0" y1="0.5" x2="254" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint6_linear_15035_420" x1="0" y1="0.5" x2="254" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint7_linear_15035_420" x1="0" y1="0.5" x2="254" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            </defs>
          </svg>

          <svg width="100%" className="absolute bottom-0 left-0 right-0" viewBox="0 0 1152 264" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.6">
            <mask id="path-1-inside-1_15001_303" fill="white">
            <path d="M0 0L1152 0V264L0 264L0 0Z"/>
            </mask>
            <path d="M1152 0L1151 0V264H1152H1153V0L1152 0ZM0 264H1L1 0L0 0L-1 0L-1 264H0Z" fill="url(#paint0_linear_15001_303)" mask="url(#path-1-inside-1_15001_303)"/>
            <line x1="144.5" y1="4.04314e-08" x2="144.5" y2="264" stroke="url(#paint1_linear_15001_303)" stroke-dasharray="5 5"/>
            <line x1="288.5" y1="4.04314e-08" x2="288.5" y2="264" stroke="url(#paint2_linear_15001_303)"/>
            <line x1="432.5" y1="4.04314e-08" x2="432.5" y2="264" stroke="url(#paint3_linear_15001_303)" stroke-dasharray="5 5"/>
            <line x1="576.5" y1="4.04314e-08" x2="576.5" y2="264" stroke="url(#paint4_linear_15001_303)"/>
            <line x1="720.5" y1="4.04314e-08" x2="720.5" y2="264" stroke="url(#paint5_linear_15001_303)" stroke-dasharray="5 5"/>
            <line x1="864.5" y1="4.04314e-08" x2="864.5" y2="264" stroke="url(#paint6_linear_15001_303)"/>
            <line x1="1008.5" y1="4.04314e-08" x2="1008.5" y2="264" stroke="url(#paint7_linear_15001_303)" stroke-dasharray="5 5"/>
            </g>
            <defs>
            <linearGradient id="paint0_linear_15001_303" x1="576" y1="0" x2="576" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#434343"/>
            </linearGradient>
            <linearGradient id="paint1_linear_15001_303" x1="143.5" y1="-4.04314e-08" x2="143.5" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint2_linear_15001_303" x1="287.5" y1="-4.04314e-08" x2="287.5" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint3_linear_15001_303" x1="431.5" y1="-4.04314e-08" x2="431.5" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint4_linear_15001_303" x1="575.5" y1="-4.04314e-08" x2="575.5" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint5_linear_15001_303" x1="719.5" y1="-4.04314e-08" x2="719.5" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint6_linear_15001_303" x1="863.5" y1="-4.04314e-08" x2="863.5" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            <linearGradient id="paint7_linear_15001_303" x1="1007.5" y1="-4.04314e-08" x2="1007.5" y2="264" gradientUnits="userSpaceOnUse">
            <stop stop-color="#363636" stop-opacity="0"/>
            <stop offset="1" stop-color="#363636"/>
            </linearGradient>
            </defs>
          </svg>


        <section
          ref={(el) => (sectionRefs.current[0] = el)}
          className="text-center px-4 sm:px-8 md:px-12 lg:px-16"
        >
          <h1 className="text-[36px] sm:text-[52px] md:text-[60px] max-w-3xl mx-auto font-[family-name:var(--font-sf)] leading-tight font-medium mb-4">
            <span className="inline-block text-nowrap">Lorem ipsum<span className="relative"> dolor sit
              <svg ref={svgRef} className="absolute left-auto max-w-[120px] right-0 bottom-0 translate-y-[100%] sm:left-0 sm:max-w-none" width="246" height="19" viewBox="0 0 246 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.6" d="M1.8746 7.64974C20.9567 5.43159 136.188 0.700663 183.705 1.44049C197.365 1.65318 211.027 1.88974 224.691 2.22078C229.044 2.32625 237.023 1.74519 242.574 3.3093C244.786 3.93251 244.438 4.90261 242.461 5.34581C234.093 7.22227 224.399 6.73916 215.726 7.35093C196.726 8.691 177.925 10.9769 158.886 12.1051C150.392 12.6084 142.061 13.7289 133.589 14.2664C122.926 14.9429 131.334 14.8281 137.26 14.7078C159.88 14.2487 181.627 14.7029 204.205 17.1549" stroke="url(#paint0_linear_13001_12505)" stroke-width="2" stroke-linecap="round"/>
                <defs>
                <linearGradient id="paint0_linear_13001_12505" x1="-9.05512" y1="-19.6465" x2="212.015" y2="115.583" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FF7750"/>
                <stop offset="0.54" stop-color="#BD5969"/>
                <stop offset="1" stop-color="#4B2494"/>
                </linearGradient>
                </defs>
              </svg>
              </span></span>
            <span className="inline-block text-nowrap"> in tempor</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-3xl mx-auto text-[#CFD3D8] text-balance">
            Lorem ipsum dolor sit amet consectetur adipiscing sed do eiusmod
          </p>

          <div className="p-[1.125px] max-w-[54rem] relative shadow-md shadow-gray-900/80 flex rounded-[15px] bg-gradient-to-r from-[#FF7750] to-[#4B2494] mx-auto">
            <a
              href="#"
              id="tabicon"
              className="absolute top-[15px] left-[5ch] transition duration-200"
              style={{
                left: `${tabIconPosition}ch`,
                opacity: isMobile ? 0 : isTabIconVisible ? 1 : 0,
              }} // Adjust left position based on current text length
              onClick={handleTabIconClick}
            >
              <svg
                width="55"
                height="22"
                viewBox="0 0 55 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.510791"
                  y="0.510791"
                  width="53.3237"
                  height="20.0216"
                  rx="3.57554"
                  stroke="#545B64"
                  stroke-width="1.02158"
                />
                <path
                  d="M21.917 14.8347H20.9015V12.246C19.8003 12.8038 18.7562 13.6619 17.755 14.8347H16.9255C17.3975 13.8193 17.8552 13.0469 18.3128 12.5464H8.90202V11.5309H18.2985C17.8552 11.0303 17.3975 10.258 16.9255 9.25687H17.755C18.7562 10.4296 19.8003 11.2878 20.9015 11.8456V9.25687H21.917V14.8347ZM27.3335 7.09725V16.0218H26.1321V7.09725H22.957V6.03889H30.5085V7.09725H27.3335ZM36.4004 16.0218C35.9713 16.0218 35.6614 15.9074 35.4707 15.6785C35.2896 15.4497 35.1751 15.1637 35.1275 14.8204H35.056C34.8939 15.2781 34.6269 15.6213 34.255 15.8502C33.8832 16.079 33.4398 16.1934 32.9249 16.1934C32.1431 16.1934 31.5329 15.9932 31.0943 15.5927C30.6652 15.1923 30.4507 14.6488 30.4507 13.9623C30.4507 13.2662 30.7033 12.7323 31.2087 12.3604C31.7236 11.9886 32.5197 11.8027 33.5971 11.8027H35.056V11.0732C35.056 10.5488 34.9129 10.1484 34.6269 9.87186C34.3409 9.59536 33.9023 9.4571 33.3111 9.4571C32.863 9.4571 32.4863 9.55722 32.1812 9.75745C31.8856 9.95768 31.6377 10.2247 31.4375 10.5584L30.751 9.91477C30.9512 9.51431 31.2707 9.17583 31.7093 8.89932C32.1479 8.61328 32.7009 8.47025 33.3683 8.47025C34.2646 8.47025 34.9606 8.68955 35.4564 9.12815C35.9522 9.56675 36.2001 10.177 36.2001 10.9588V15.0206H37.044V16.0218H36.4004ZM33.1109 15.2209C33.3969 15.2209 33.6591 15.1875 33.8975 15.1208C34.1359 15.054 34.3409 14.9587 34.5125 14.8347C34.6841 14.7108 34.8176 14.5677 34.9129 14.4056C35.0083 14.2436 35.056 14.0672 35.056 13.8765V12.6608H33.5399C32.882 12.6608 32.4005 12.7561 32.0954 12.9468C31.7998 13.1375 31.652 13.414 31.652 13.7764V14.0767C31.652 14.439 31.7808 14.7203 32.0382 14.9205C32.3052 15.1208 32.6627 15.2209 33.1109 15.2209ZM38.677 5.4382H39.8211V9.84326H39.8784C40.069 9.37606 40.3456 9.0328 40.7079 8.81351C41.0797 8.58467 41.5231 8.47025 42.038 8.47025C42.4956 8.47025 42.9104 8.56083 43.2823 8.74199C43.6541 8.92316 43.9688 9.18059 44.2262 9.51431C44.4932 9.84803 44.6934 10.2533 44.8269 10.73C44.9699 11.2067 45.0414 11.7407 45.0414 12.3318C45.0414 12.923 44.9699 13.4569 44.8269 13.9337C44.6934 14.4104 44.4932 14.8156 44.2262 15.1494C43.9688 15.4831 43.6541 15.7405 43.2823 15.9217C42.9104 16.1028 42.4956 16.1934 42.038 16.1934C41.0368 16.1934 40.317 15.7357 39.8784 14.8204H39.8211V16.0218H38.677V5.4382ZM41.7233 15.1637C42.3717 15.1637 42.8818 14.9634 43.2537 14.563C43.6255 14.153 43.8114 13.619 43.8114 12.9611V11.7025C43.8114 11.0446 43.6255 10.5155 43.2537 10.115C42.8818 9.70501 42.3717 9.50001 41.7233 9.50001C41.4659 9.50001 41.218 9.53815 40.9796 9.61443C40.7508 9.68117 40.5506 9.77652 40.3789 9.90047C40.2073 10.0244 40.069 10.177 39.9642 10.3581C39.8688 10.5298 39.8211 10.7157 39.8211 10.9159V13.6619C39.8211 13.9003 39.8688 14.1148 39.9642 14.3055C40.069 14.4867 40.2073 14.644 40.3789 14.7775C40.5506 14.9015 40.7508 14.9968 40.9796 15.0635C41.218 15.1303 41.4659 15.1637 41.7233 15.1637Z"
                  fill="#CFD3D8"
                />
              </svg>
            </a>
            <a
              style={{ opacity: isCTAVisible ? 1 : 0 }}
              href="#"
              className="absolute right-4 bottom-4 p-2.5 bg-[#4368E3] hover:opacity-75 transition duration-200 rounded-lg"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.6855 2.78218C15.1458 2.78218 15.5189 3.15528 15.5189 3.61551V9.54144C15.5189 10.1205 15.3201 10.6953 14.9377 11.1355C14.552 11.5794 14.0017 11.8563 13.3985 11.8563H4.03069L5.5711 13.3967C5.89654 13.7221 5.89654 14.2497 5.5711 14.5752C5.24566 14.9006 4.71802 14.9006 4.39259 14.5752L1.42962 11.6122C1.27334 11.4559 1.18555 11.244 1.18555 11.023C1.18555 10.8019 1.27334 10.59 1.42962 10.4337L4.39259 7.47073C4.71802 7.1453 5.24566 7.1453 5.5711 7.47073C5.89654 7.79617 5.89654 8.32381 5.5711 8.64925L4.03076 10.1896H13.3985C13.478 10.1896 13.5824 10.1542 13.6795 10.0425C13.7798 9.92702 13.8522 9.74825 13.8522 9.54144V3.61551C13.8522 3.15528 14.2253 2.78218 14.6855 2.78218Z"
                  fill="white"
                />
              </svg>
            </a>
            <textarea
              placeholder={placeholder}
              rows={5}
              name="prompt"
              id="prompt"
              className="bg-[#212429] p-3 resize-none rounded-[14px] w-full mx-auto text-md ring-2 ring-[#434343] outline-[#434343] focus:outline-0 focus:ring-0 transition duration-300"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onInput={handleInput}
              onKeyDown={handleKeyPress}
            />
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className="mt-12 flex items-center"
        >
          <div className="flex flex-col sm:flex-row gap-7 mx-auto">
            <div className="flex items-center space-x-4">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_15001_395)">
                  <path
                    d="M26 5.29114H6C5.46957 5.29114 4.96086 5.50185 4.58579 5.87692C4.21071 6.252 4 6.7607 4 7.29114V14.2911C4 20.8811 7.19 24.8749 9.86625 27.0649C12.7487 29.4224 15.6163 30.2224 15.7413 30.2561C15.9131 30.3029 16.0944 30.3029 16.2663 30.2561C16.3913 30.2224 19.255 29.4224 22.1413 27.0649C24.81 24.8749 28 20.8811 28 14.2911V7.29114C28 6.7607 27.7893 6.252 27.4142 5.87692C27.0391 5.50185 26.5304 5.29114 26 5.29114ZM21.71 13.9986L14.71 20.9986C14.6171 21.0916 14.5068 21.1654 14.3854 21.2157C14.264 21.266 14.1339 21.2919 14.0025 21.2919C13.8711 21.2919 13.741 21.266 13.6196 21.2157C13.4982 21.1654 13.3879 21.0916 13.295 20.9986L10.295 17.9986C10.1074 17.811 10.0019 17.5565 10.0019 17.2911C10.0019 17.0258 10.1074 16.7713 10.295 16.5836C10.4826 16.396 10.7371 16.2906 11.0025 16.2906C11.2679 16.2906 11.5224 16.396 11.71 16.5836L14 18.8774L20.2925 12.5836C20.3854 12.4907 20.4957 12.417 20.6171 12.3667C20.7385 12.3165 20.8686 12.2906 21 12.2906C21.1314 12.2906 21.2615 12.3165 21.3829 12.3667C21.5043 12.417 21.6146 12.4907 21.7075 12.5836C21.8004 12.6765 21.8741 12.7868 21.9244 12.9082C21.9747 13.0296 22.0006 13.1597 22.0006 13.2911C22.0006 13.4225 21.9747 13.5526 21.9244 13.674C21.8741 13.7954 21.8004 13.9057 21.7075 13.9986H21.71Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_15001_395">
                    <rect
                      width="32"
                      height="32"
                      fill="white"
                      transform="translate(0.5 0.291138)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <div>
                <p className="text-md">Lorem ipsum dolor</p>
                <p className="text-sm text-gray-500">Sit amet consectetur</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_15001_395)">
                  <path
                    d="M26 5.29114H6C5.46957 5.29114 4.96086 5.50185 4.58579 5.87692C4.21071 6.252 4 6.7607 4 7.29114V14.2911C4 20.8811 7.19 24.8749 9.86625 27.0649C12.7487 29.4224 15.6163 30.2224 15.7413 30.2561C15.9131 30.3029 16.0944 30.3029 16.2663 30.2561C16.3913 30.2224 19.255 29.4224 22.1413 27.0649C24.81 24.8749 28 20.8811 28 14.2911V7.29114C28 6.7607 27.7893 6.252 27.4142 5.87692C27.0391 5.50185 26.5304 5.29114 26 5.29114ZM21.71 13.9986L14.71 20.9986C14.6171 21.0916 14.5068 21.1654 14.3854 21.2157C14.264 21.266 14.1339 21.2919 14.0025 21.2919C13.8711 21.2919 13.741 21.266 13.6196 21.2157C13.4982 21.1654 13.3879 21.0916 13.295 20.9986L10.295 17.9986C10.1074 17.811 10.0019 17.5565 10.0019 17.2911C10.0019 17.0258 10.1074 16.7713 10.295 16.5836C10.4826 16.396 10.7371 16.2906 11.0025 16.2906C11.2679 16.2906 11.5224 16.396 11.71 16.5836L14 18.8774L20.2925 12.5836C20.3854 12.4907 20.4957 12.417 20.6171 12.3667C20.7385 12.3165 20.8686 12.2906 21 12.2906C21.1314 12.2906 21.2615 12.3165 21.3829 12.3667C21.5043 12.417 21.6146 12.4907 21.7075 12.5836C21.8004 12.6765 21.8741 12.7868 21.9244 12.9082C21.9747 13.0296 22.0006 13.1597 22.0006 13.2911C22.0006 13.4225 21.9747 13.5526 21.9244 13.674C21.8741 13.7954 21.8004 13.9057 21.7075 13.9986H21.71Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_15001_395">
                    <rect
                      width="32"
                      height="32"
                      fill="white"
                      transform="translate(0.5 0.291138)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <div>
                <p className="text-md">Lorem ipsum dolor</p>
                <p className="text-sm text-gray-500">Sit amet consectetur</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_15001_395)">
                  <path
                    d="M26 5.29114H6C5.46957 5.29114 4.96086 5.50185 4.58579 5.87692C4.21071 6.252 4 6.7607 4 7.29114V14.2911C4 20.8811 7.19 24.8749 9.86625 27.0649C12.7487 29.4224 15.6163 30.2224 15.7413 30.2561C15.9131 30.3029 16.0944 30.3029 16.2663 30.2561C16.3913 30.2224 19.255 29.4224 22.1413 27.0649C24.81 24.8749 28 20.8811 28 14.2911V7.29114C28 6.7607 27.7893 6.252 27.4142 5.87692C27.0391 5.50185 26.5304 5.29114 26 5.29114ZM21.71 13.9986L14.71 20.9986C14.6171 21.0916 14.5068 21.1654 14.3854 21.2157C14.264 21.266 14.1339 21.2919 14.0025 21.2919C13.8711 21.2919 13.741 21.266 13.6196 21.2157C13.4982 21.1654 13.3879 21.0916 13.295 20.9986L10.295 17.9986C10.1074 17.811 10.0019 17.5565 10.0019 17.2911C10.0019 17.0258 10.1074 16.7713 10.295 16.5836C10.4826 16.396 10.7371 16.2906 11.0025 16.2906C11.2679 16.2906 11.5224 16.396 11.71 16.5836L14 18.8774L20.2925 12.5836C20.3854 12.4907 20.4957 12.417 20.6171 12.3667C20.7385 12.3165 20.8686 12.2906 21 12.2906C21.1314 12.2906 21.2615 12.3165 21.3829 12.3667C21.5043 12.417 21.6146 12.4907 21.7075 12.5836C21.8004 12.6765 21.8741 12.7868 21.9244 12.9082C21.9747 13.0296 22.0006 13.1597 22.0006 13.2911C22.0006 13.4225 21.9747 13.5526 21.9244 13.674C21.8741 13.7954 21.8004 13.9057 21.7075 13.9986H21.71Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_15001_395">
                    <rect
                      width="32"
                      height="32"
                      fill="white"
                      transform="translate(0.5 0.291138)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <div>
                <p className="text-md">Lorem ipsum dolor</p>
                <p className="text-sm text-gray-500">Sit amet consectetur</p>
              </div>
            </div>
          </div>
        </section>

      </div>

        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          className="marquee-container mt-12 pb-6 max-w-[72rem] mx-auto overflow-hidden"
        >
          <div className="marquee-items flex space-x-12">
            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-1.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-2.png"
                alt="Logo 1"
                width={203}
                height={500}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-3.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item relative flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-4.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />

              <a href="/casestudy" className="absolute text-[10px] bottom-0 mx-auto translate-y-[80%] rounded-[5px] text-white px-2 py-1 bg-[#2B3036]">
                CASE STUDY
              </a>
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-5.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-6.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-7.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="relative marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-8.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
              <a href="/casestudy" className="absolute text-[10px] bottom-0 mx-auto translate-y-[80%] rounded-[5px] text-white px-2 py-1 bg-[#2B3036]">
                CASE STUDY
              </a>
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-9.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-10.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-11.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-12.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-13.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-14.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-15.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-16.png"
                alt="Logo 1"
                width={203}
                height={50}
                
              />
            </div>
          </div>

          <div className="marquee-items flex space-x-12">
            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-1.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-2.png"
                alt="Logo 1"
                width={203}
                height={500}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-3.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item relative flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-4.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />

              <a href="/casestudy" className="absolute text-[10px] bottom-0 mx-auto translate-y-[80%] rounded-[5px] text-white px-2 py-1 bg-[#2B3036]">
                CASE STUDY
              </a>
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-5.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-6.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-7.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="relative marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-8.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
              <a href="/casestudy" className="absolute text-[10px] bottom-0 mx-auto translate-y-[80%] rounded-[5px] text-white px-2 py-1 bg-[#2B3036]">
                CASE STUDY
              </a>
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-9.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-10.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-11.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-12.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-13.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-14.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-15.png"
                alt="Logo 1"
                width={203}
                height={50}
                loading="eager"
              />
            </div>

            <div className="marquee-item flex justify-center items-center">
              <Image
                className="w-auto"
                src="/companylogo-16.png"
                alt="Logo 1"
                width={203}
                height={50}
                
              />
            </div>
          </div>

        </section>
        <div className="pt-12">

        </div>
      </main>
    </div>
  );
}
