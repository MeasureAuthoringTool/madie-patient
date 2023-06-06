import React from "react";

const SiteMap = ({ className = "madie-icon", ...props }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path d="M15.2 11.102H14.4V8.4898C14.3998 8.23008 14.3154 7.98109 14.1654 7.79744C14.0154 7.6138 13.8121 7.5105 13.6 7.5102H8.53333V4.89796H9.6C9.8121 4.89766 10.0154 4.79435 10.1654 4.61071C10.3154 4.42707 10.3998 4.17808 10.4 3.91837V0.979592C10.3998 0.719881 10.3154 0.470893 10.1654 0.28725C10.0154 0.103606 9.8121 0.000302467 9.6 0H6.4C6.1879 0.000302467 5.98456 0.103606 5.83459 0.28725C5.68461 0.470893 5.60025 0.719881 5.6 0.979592V3.91837C5.60025 4.17808 5.68461 4.42707 5.83459 4.61071C5.98456 4.79435 6.1879 4.89766 6.4 4.89796H7.46667V7.5102H2.4C2.1879 7.5105 1.98456 7.6138 1.83458 7.79744C1.6846 7.98109 1.60024 8.23008 1.6 8.4898V11.102H0.8C0.587903 11.1023 0.384563 11.2056 0.234587 11.3893C0.0846118 11.5729 0.000247015 11.8219 0 12.0816V15.0204C0.000247015 15.2801 0.0846118 15.5291 0.234587 15.7127C0.384563 15.8964 0.587903 15.9997 0.8 16H3.46667C3.67876 15.9997 3.8821 15.8964 4.03208 15.7127C4.18205 15.5291 4.26642 15.2801 4.26667 15.0204V12.0816C4.26642 11.8219 4.18205 11.5729 4.03208 11.3893C3.8821 11.2056 3.67876 11.1023 3.46667 11.102H2.66667V8.81633H7.46667V11.102H6.66667C6.45457 11.1023 6.25123 11.2056 6.10125 11.3893C5.95128 11.5729 5.86691 11.8219 5.86667 12.0816V15.0204C5.86691 15.2801 5.95128 15.5291 6.10125 15.7127C6.25123 15.8964 6.45457 15.9997 6.66667 16H9.33333C9.54543 15.9997 9.74877 15.8964 9.89875 15.7127C10.0487 15.5291 10.1331 15.2801 10.1333 15.0204V12.0816C10.1331 11.8219 10.0487 11.5729 9.89875 11.3893C9.74877 11.2056 9.54543 11.1023 9.33333 11.102H8.53333V8.81633H13.3333V11.102H12.5333C12.3212 11.1023 12.1179 11.2056 11.9679 11.3893C11.8179 11.5729 11.7336 11.8219 11.7333 12.0816V15.0204C11.7336 15.2801 11.8179 15.5291 11.9679 15.7127C12.1179 15.8964 12.3212 15.9997 12.5333 16H15.2C15.4121 15.9997 15.6154 15.8964 15.7654 15.7127C15.9154 15.5291 15.9998 15.2801 16 15.0204V12.0816C15.9998 11.8219 15.9154 11.5729 15.7654 11.3893C15.6154 11.2056 15.4121 11.1023 15.2 11.102ZM6.66667 1.30612H9.33333V3.59184H6.66667V1.30612ZM3.2 12.4082V14.6939H1.06667V12.4082H3.2ZM9.06667 12.4082V14.6939H6.93333V12.4082H9.06667ZM14.9333 14.6939H12.8V12.4082H14.9333V14.6939Z" />
    </svg>
  );
};

export default SiteMap;
