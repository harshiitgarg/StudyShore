import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/HomePage/HighlightText";
import Button from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimeLineSection from "../components/core/HomePage/TimeLineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import Instructor from "../components/core/HomePage/Instructor";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";

const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p className="">Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        {/* Heading */}
        <div className="text-4xl text-center font-bold">
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </div>
        {/* Sub Heading */}
        <div className="text-center text-pure-greys-100 w-[90%] -mt-2">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>
        {/* CTA Buttons */}
        <div className="flex flex-row mt-8 gap-4">
          <Button linkto={"/signup"} active={true}>
            {"Learn More"}
          </Button>
          <Button linkto={"/login"} active={false}>
            {"Book a Demo"}
          </Button>
        </div>
        {/* Video */}
        <div className="mx-24 my-10 shadow-[10px_-5px_50px_-5px] shadow-blue-200 ">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>
        {/* Code Section 1 */}
        <div>
          <CodeBlocks
            heading={
              <div>
                Unlock your <HighlightText text={"coding potential"} /> with our
                online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            btn1={{
              btnText: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            position={"flex-row"}
            codeColor={"text-yellow-25"}
            codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            bgGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>
        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            heading={
              <div>
                Start <HighlightText text={"coding in seconds"} />.
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            btn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            position={"flex-row-reverse"}
            codeColor={"text-yellow-25"}
            codeBlock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            bgGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
        <ExploreMore />
      </div>
      {/* Section 2 */}
      <div className="bg-pure-greys-5">
        {/* Two buttons */}
        <div className="homepage_bg h-[333px]">
          <div className="flex gap-5 w-11/12 max-w-maxContent items-center mx-auto">
            <div className="flex text-white mx-auto my-56 gap-6">
              <Button active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog <FaArrowRight />
                </div>
              </Button>
              <Button active={false} linkto={"/signup"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-11/12 max-w-maxContent mx-auto py-8">
          <div className="flex gap-24">
            <div className="text-4xl w-[45%]">
              Get the Skills you need for a{" "}
              <HighlightText text={"job that is in demand"} />
            </div>
            <div className="w-[45%] flex flex-col gap-6 items-start">
              <div className="text-richblack-700">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <Button active={true} linkto={"/signup"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <TimeLineSection />
        <LearningLanguageSection />
      </div>
      {/* Section 3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <Instructor />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
