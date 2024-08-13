import { useTranslation } from "react-i18next";
import { useBakeryInfo } from "../hooks/useBakeryInfo";
import { useEffect, useState } from "react";

import Spinner from "./Spinner";

function Review() {
  const { comment, id, img } = useBakeryInfo();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const imgStyle = isLoading ? { display: "block" } : { display: "none" };

  function handleSpinner() {
    setIsLoading(true);
  }

  useEffect(() => {
    if (!img) setIsLoading(true);
  }, [img, setIsLoading]);

  if (!comment)
    return (
      <div className="review" data-id={id}>
        <div>✸ {t("info.oneSentenceReview")}</div>
        <div>coming soon!</div>
      </div>
    );

  return (
    <div className="review" data-id={id}>
      <div>✸ {t("info.oneSentenceReview")}</div>
      <div>
        <img src={img} alt="review" onLoad={handleSpinner} style={imgStyle} />
        {!isLoading && <Spinner />}
        <div>{comment}</div>
      </div>
    </div>
  );
}

export default Review;
