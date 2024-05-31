import { useState } from "react";
import { useTranslation } from "react-i18next";

import BtnToResizeComponent from "./BtnToResizeComponent";
import BtnToMyLocation from "./BtnToMyLocation";
import i18n from "../locales/i18n";
import bread from "../assets/baguette_bread.png";

function Header() {
  const { t } = useTranslation();
  const [resize, setResize] = useState(false);

  const handleTranslateContent = function () {
    i18n.language === "en"
      ? i18n.changeLanguage("ko")
      : i18n.changeLanguage("en");
  };

  return (
    <div className="header">
      <img src={bread} alt="bread emoji"></img>
      <div className="title">{t("header.title")}</div>
      <label className="toggle-switch">
        <input type="checkbox" onClick={handleTranslateContent}></input>
        <div className="toggle-options">
          <p>Korean</p>
          <p>English</p>
          <span className="slider"></span>
        </div>
      </label>
      <BtnToResizeComponent resize={resize} setResize={setResize} />
      <BtnToMyLocation resize={resize} />
    </div>
  );
}

export default Header;
