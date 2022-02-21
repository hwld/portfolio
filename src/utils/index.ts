import conferenceImg from "../images/conference_schedule/home.png";
import countanyImg from "../images/countany/home.png";
import funSiteImg from "../images/fun_site/home.png";
import gameStoreImg from "../images/game_store/home.png";
import pianoImg from "../images/piano/home.png";
import qFlasherImg from "../images/q-flasher/home.png";
import reactNotesImg from "../images/react-notes/home.png";
import garallyImg from "../images/remote-polar/home.png";
import surveyImg from "../images/survey_manager/home.png";
import blogImg from "../images/web_blog/home.png";

export type WorkData = {
  name: string;
  imgUrl: string;
  githubUrl?: string;
  siteUrl?: string;
};

export const WORKS: {
  name: string;
  imgUrl: string;
  githubUrl?: string;
  siteUrl?: string;
}[] = [
  {
    name: "react-notes",
    imgUrl: reactNotesImg,
    githubUrl: "https://github.com/hwld/react-notes",
    siteUrl: "https://react-s1te.web.app",
  },
  { name: "q-flasher", imgUrl: qFlasherImg },
  { name: "countany", imgUrl: countanyImg },
  { name: "疑似カンファレンス", imgUrl: conferenceImg },
  { name: "疑似ファンサイト", imgUrl: funSiteImg },
  { name: "疑似ゲームストア", imgUrl: gameStoreImg },
  { name: "Webピアノ", imgUrl: pianoImg },
  { name: "アンケート作成サイト", imgUrl: surveyImg },
  { name: "Webブログと管理画面", imgUrl: blogImg },
  { name: "ギャラリーサイト", imgUrl: garallyImg },
];
