import { useStyles } from "../../../style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Heart = ({ fillColor = "#ffffff"}) => {
  const classes = useStyles();

  return (
      <FontAwesomeIcon icon={faHeart} className={classes.heart} style={{color: fillColor}}/>
  );
};

export default Heart;
