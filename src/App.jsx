import { useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Volunteering from './components/Volunteering';
import Profile from './components/Profile';
import Firebase from './components/Firebase';

function App() {
  const [profileDetails, setProfileDetails] = useState({
    fullname: '',
    title: '',
    location: '',
    photo: '',
    about: '',
    experience: '',
    education: '',
    skills: '',
    volunteering: '',
  });
  const [url, setUrl] = useState('');

  useEffect(() => {
    window.chrome?.tabs &&
      window?.chrome?.tabs?.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          setUrl(tabs[0]?.url);
          window?.chrome?.tabs.sendMessage(
            tabs[0].id || 0,
            { type: 'GET_DOM' },
            (response) => {
              setProfileDetails({
                fullname: response?.fullname,
                title: response?.title,
                location: response?.location,
                photo: response?.photo,
                about: response?.about,
                education: response?.education,
                experience: response?.experience,
                skills: response?.skills,
                volunteering: response?.volunteering,
              });
            }
          );
        }
      );
  }, [url]);

  const sanitizeHTMLHandler = (html) => {
    let cleanHTML = sanitizeHtml(html, {
      allowedTags: [
        'address',
        'article',
        'aside',
        'footer',
        'header',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hgroup',
        'main',
        'nav',
        'section',
        'blockquote',
        'dd',
        'div',
        'dl',
        'dt',
        'figcaption',
        'figure',
        'hr',
        'li',
        'main',
        'ol',
        'p',
        'pre',
        'ul',
        'a',
        'abbr',
        'b',
        'bdi',
        'bdo',
        'br',
        'cite',
        'code',
        'data',
        'dfn',
        'em',
        'i',
        'kbd',
        'mark',
        'q',
        'rb',
        'rp',
        'rt',
        'rtc',
        'ruby',
        's',
        'samp',
        'small',
        'span',
        'strong',
        'sub',
        'sup',
        'time',
        'u',
        'var',
        'wbr',
        'caption',
        'col',
        'colgroup',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'tr',
      ],
      allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      },
      selfClosing: [
        'img',
        'br',
        'hr',
        'area',
        'base',
        'basefont',
        'input',
        'link',
        'meta',
      ],
      // URL schemes we permit
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
      allowedSchemesByTag: {},
      allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
      allowProtocolRelative: true,
      enforceHtmlBoundary: false,
    });
    return cleanHTML;
  };
  let cleanHTMLSkills = sanitizeHTMLHandler(profileDetails?.skills);
  let cleanHTMLEdu = sanitizeHTMLHandler(profileDetails?.education);
  let cleanHTMLAbout = sanitizeHTMLHandler(profileDetails?.about);
  let cleanHTMLExp = sanitizeHTMLHandler(profileDetails?.experience);
  let cleanHTMLVol = sanitizeHTMLHandler(profileDetails?.volunteering);

  useEffect(() => {
    if (profileDetails) {
      setProfileDetails({
        ...profileDetails,
        skills:
          profileDetails?.skills === null ? 'Not Available' : cleanHTMLSkills,
        education:
          profileDetails?.education === null ? 'Not Available' : cleanHTMLEdu,
        about:
          profileDetails?.about === null ? 'Not Available' : cleanHTMLAbout,
        experience:
          profileDetails?.experience === null ? 'Not Available' : cleanHTMLExp,
        volunteering:
          profileDetails?.volunteering === null
            ? 'Not Available'
            : cleanHTMLVol,
      });
    }
    // console.log(profileDetails);
  }, [
    profileDetails?.education,
    profileDetails?.experience,
    profileDetails?.volunteering,
    profileDetails?.about,
    profileDetails?.skills,
  ]);

  async function addProfileHandler(profile) {
    const response = await fetch(
      "https://chat-d89cb-default-rtdb.firebaseio.com//profiles.json"
      ,
      {
        method: "POST",
        body: JSON.stringify(profile),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = response.json();
    console.log(data);
  }
  function submitHandler(event) {
    event.preventDefault();
    addProfileHandler(profileDetails);
  }


  return (
    <>
      <section className="pt-4 bg-gray-100 ">
        <div className="  w-96 rounded-xl ">
          <div className="text-[#0A66C2] font-semibold text-center text-xl">
            LinkedIn Profile Saver
          </div>

          {/* <Firebase /> */}
          <button onClick={submitHandler} class="px-5 py-2.5 relative rounded group  text-white font-medium inline-block">
            <span class="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
            <span class="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
            <span class="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
            <span class="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
            <span class="relative">Save Profile ⚡</span>
          </button>
          <div className="relative flex flex-col  break-words  w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-6">
              <Profile
                profileDetails={profileDetails}
                cleanHTMLAbout={cleanHTMLAbout}
              />
              <Experience
                profileDetails={profileDetails}
                cleanHTMLExp={cleanHTMLExp}
              />
              <Skills
                profileDetails={profileDetails}
                cleanHTMLSkills={cleanHTMLSkills}
              />
              <Education
                profileDetails={profileDetails}
                cleanHTMLEdu={cleanHTMLEdu}
              />
              <Volunteering
                profileDetails={profileDetails}
                cleanHTMLVol={cleanHTMLVol}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
