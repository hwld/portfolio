import conferenceImg from "../../images/conference_schedule/home.webp";
import countanyImg from "../../images/countany/home.webp";
import funSiteImg from "../../images/fun_site/home.webp";
import gameStoreImg from "../../images/game_store/home.webp";
import memoryGameImg from "../../images/hobby/memory-game.webp";
import reversiImg from "../../images/hobby/reversi.webp";
import wordleCloneImg from "../../images/hobby/wordle-clone.webp";
import pianoImg from "../../images/piano/home.webp";
import qFlasherImg from "../../images/q-flasher/home.webp";
import reactNotesImg from "../../images/react-notes/home.webp";
import garallyImg from "../../images/remote-polar/home.webp";
import surveyImg from "../../images/survey_manager/home.webp";
import blogImg from "../../images/web_blog/home.webp";

export type WorkData = {
  name: string;
  desc: string;
  imgUrl: string;
  githubUrl?: string;
  siteUrl?: string;
};

export const DEPLOYED_WORKS: WorkData[] = [
  {
    name: "react-notes",
    desc: "カテゴリ分けできるメモ帳",
    imgUrl: reactNotesImg,
    githubUrl: "https://github.com/hwld/react-notes",
    siteUrl: "https://react-s1te.web.app",
  },
  {
    name: "q-flasher",
    desc: "webで動く単語帳",
    imgUrl: qFlasherImg,
    githubUrl: "https://github.com/hwld/qflasher",
    siteUrl: "https://q-flasher.web.app",
  },
  {
    name: "countany",
    desc: "カウンターを作れるアプリ",
    imgUrl: countanyImg,
    githubUrl: "https://github.com/hwld/countany",
    siteUrl: "https://countany.vercel.app",
  },
];

export const PROJECTS_WORKS: WorkData[] = [
  {
    name: "バナナ-カンファレンス",
    desc: "chakra-uiを試すために作った偽カンファレンスのサイト",
    imgUrl: conferenceImg,
    githubUrl:
      "https://github.com/hwld/50ReactProjects/tree/master/business_and_realworld/conference_schedule",
  },
  {
    name: "Rick&Mortyのファンサイト",
    desc: "アニメーションを試すために作ったサイト",
    imgUrl: funSiteImg,
    githubUrl:
      "https://github.com/hwld/50ReactProjects/tree/master/fun_and_interesting/fan_wiki",
  },
  {
    name: "偽ゲームストア",
    desc: "paypalを試すために作った偽ゲームストア",
    imgUrl: gameStoreImg,
    githubUrl:
      "https://github.com/hwld/50ReactProjects/tree/master/business_and_realworld/ecommerce_store",
  },
  {
    name: "Webピアノ",
    desc: "webで動くピアノ",
    imgUrl: pianoImg,
    githubUrl:
      "https://github.com/hwld/50ReactProjects/tree/master/fun_and_interesting/musical_instrument",
  },
  {
    name: "アンケート作成サイト",
    desc: "google formのようなアンケート作成サイト",
    imgUrl: surveyImg,
    githubUrl:
      "https://github.com/hwld/50ReactProjects/tree/master/business_and_realworld/survey_creator_and_manager",
  },
  {
    name: "Webブログと管理画面",
    desc: "管理画面からcmsを操作するという二度手間なサイト",
    imgUrl: blogImg,
    githubUrl:
      "https://github.com/hwld/50ReactProjects/tree/master/business_and_realworld/website_admin",
  },
  {
    name: "リモート極地",
    desc: "極地の動画を集めたギャラリーサイト",
    imgUrl: garallyImg,
    githubUrl:
      "https://github.com/hwld/50ReactProjects/tree/master/fun_and_interesting/video_gallery",
  },
];

export const HOBBY_WORKS: WorkData[] = [
  {
    name: "真剣衰弱",
    desc: "webで動く真剣衰弱",
    imgUrl: memoryGameImg,
    githubUrl: "https://github.com/hwld/memory-game",
  },
  {
    name: "オセロ",
    desc: "webで動くオセロ",
    imgUrl: reversiImg,
    githubUrl: "https://github.com/hwld/reversi",
  },
  {
    name: "Wordle Clone",
    desc: "wordleというゲームのクローン",
    imgUrl: wordleCloneImg,
    githubUrl: "https://github.com/hwld/wordle-clone",
  },
];
