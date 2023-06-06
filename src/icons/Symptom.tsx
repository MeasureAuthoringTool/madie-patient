import React from "react";

const Symptom = ({ className = "madie-icon", ...props }) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path d="M4.72 0.231727C4.86063 0.0912769 5.05125 0.0123874 5.25 0.0123874C5.44875 0.0123874 5.63937 0.0912769 5.78 0.231727L6.78 1.23073C7.56711 0.936721 8.43389 0.936721 9.221 1.23073L10.22 0.230727C10.3123 0.134359 10.4286 0.064419 10.557 0.0281582C10.6854 -0.00810257 10.8211 -0.00936476 10.9502 0.0245025C11.0792 0.0583697 11.1969 0.126134 11.2909 0.22077C11.3849 0.315407 11.452 0.433472 11.485 0.562727C11.5186 0.691501 11.5173 0.82689 11.4813 0.955001C11.4452 1.08311 11.3758 1.19933 11.28 1.29173L10.505 2.06773C11.121 2.69773 11.5 3.56073 11.5 4.51173V4.83873C11.5 4.93873 11.491 5.03573 11.475 5.13073C11.883 5.27073 12.239 5.52273 12.504 5.85273L14.472 5.06573C14.6548 5.00061 14.8556 5.00884 15.0325 5.08871C15.2093 5.16857 15.3483 5.31385 15.4202 5.49402C15.4922 5.6742 15.4915 5.87525 15.4184 6.05495C15.3453 6.23465 15.2053 6.37902 15.028 6.45773L13 7.26973V9.01173H15.25C15.4489 9.01173 15.6397 9.09075 15.7803 9.2314C15.921 9.37205 16 9.56281 16 9.76173C16 9.96064 15.921 10.1514 15.7803 10.2921C15.6397 10.4327 15.4489 10.5117 15.25 10.5117H13V11.0117C13 11.4207 12.951 11.8177 12.859 12.1977L15.029 13.0657C15.2077 13.1436 15.3491 13.2881 15.4231 13.4684C15.4971 13.6488 15.498 13.8509 15.4256 14.0319C15.3532 14.2129 15.2131 14.3586 15.0351 14.4381C14.8571 14.5176 14.6551 14.5246 14.472 14.4577L12.288 13.5847C11.8439 14.3253 11.2154 14.9381 10.4639 15.3635C9.71243 15.7888 8.86353 16.0122 8 16.0117C7.13647 16.0122 6.28757 15.7888 5.53607 15.3635C4.78457 14.9381 4.15612 14.3253 3.712 13.5847L1.529 14.4577C1.3454 14.5269 1.14198 14.5214 0.962391 14.4424C0.782798 14.3634 0.641326 14.2171 0.568319 14.035C0.495312 13.8529 0.496584 13.6494 0.571863 13.4682C0.647142 13.287 0.790432 13.1425 0.971 13.0657L3.141 12.1977C3.04712 11.8094 2.99979 11.4113 3 11.0117V10.5117H0.75C0.551088 10.5117 0.360322 10.4327 0.21967 10.2921C0.0790176 10.1514 0 9.96064 0 9.76173C0 9.56281 0.0790176 9.37205 0.21967 9.2314C0.360322 9.09075 0.551088 9.01173 0.75 9.01173H3V7.26973L0.971 6.45773C0.790432 6.38095 0.647142 6.23647 0.571863 6.05527C0.496584 5.87407 0.495312 5.67059 0.568319 5.48847C0.641326 5.30634 0.782798 5.16008 0.962391 5.08105C1.14198 5.00202 1.3454 4.99652 1.529 5.06573L3.496 5.85273C3.761 5.52273 4.116 5.26973 4.526 5.13073C4.50883 5.03434 4.50013 4.93663 4.5 4.83873V4.51173C4.5 3.56073 4.88 2.69773 5.495 2.06773L4.72 1.29173C4.57955 1.1511 4.50066 0.960478 4.50066 0.761727C4.50066 0.562977 4.57955 0.372353 4.72 0.231727ZM5.25 6.51173C5.05109 6.51173 4.86032 6.59074 4.71967 6.7314C4.57902 6.87205 4.5 7.06281 4.5 7.26173V11.0117C4.5 11.94 4.86875 12.8302 5.52513 13.4866C6.1815 14.143 7.07174 14.5117 8 14.5117C8.92826 14.5117 9.8185 14.143 10.4749 13.4866C11.1313 12.8302 11.5 11.94 11.5 11.0117V7.26173C11.5 7.06281 11.421 6.87205 11.2803 6.7314C11.1397 6.59074 10.9489 6.51173 10.75 6.51173H5.25ZM6.173 5.01173H9.827C9.84976 5.01186 9.87231 5.00748 9.89336 4.99883C9.91441 4.99018 9.93353 4.97744 9.94963 4.96135C9.96572 4.94526 9.97845 4.92614 9.9871 4.90509C9.99575 4.88404 10.0001 4.86148 10 4.83873V4.51173C10 3.98129 9.78929 3.47259 9.41421 3.09751C9.03914 2.72244 8.53043 2.51173 8 2.51173C7.46957 2.51173 6.96086 2.72244 6.58579 3.09751C6.21071 3.47259 6 3.98129 6 4.51173V4.83873C6 4.93473 6.077 5.01173 6.173 5.01173Z" />
    </svg>
  );
};

export default Symptom;
