import React from "react";
import { SYSTEM_CONSTANTS } from "../../constants";

const Page = (props: any) => {
  React.useEffect(() => {
    document.title = props.title + SYSTEM_CONSTANTS.APP_NAME;
  }, []);

  return props.component;
};

export default Page;
