import React from "react";

const Elements = ({ className = "madie-icon", ...props }) => {
  return (
    <svg
      width="232"
      height="16"
      viewBox="0 0 232 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.43671 8C1.89984 8.98526 2.72341 10.345 3.8132 11.4869C5.01406 12.7451 6.44558 13.6452 8 13.6452C9.55442 13.6452 10.9859 12.7451 12.1868 11.4869C13.2766 10.345 14.1002 8.98526 14.5633 8C14.1002 7.01474 13.2766 5.65497 12.1868 4.51311C10.9859 3.25488 9.55442 2.35484 8 2.35484C6.44558 2.35484 5.01406 3.25488 3.8132 4.51311C2.72341 5.65497 1.89984 7.01474 1.43671 8ZM2.81537 3.58367C4.1288 2.20749 5.89728 1 8 1C10.1027 1 11.8712 2.20749 13.1846 3.58367C14.5069 4.96912 15.462 6.62076 15.9446 7.73315C16.0185 7.90356 16.0185 8.09644 15.9446 8.26685C15.462 9.37924 14.5069 11.0309 13.1846 12.4163C11.8712 13.7925 10.1027 15 8 15C5.89728 15 4.1288 13.7925 2.81537 12.4163C1.49309 11.0309 0.538021 9.37924 0.0554434 8.26685C-0.0184811 8.09644 -0.0184811 7.90356 0.0554434 7.73315C0.538021 6.62076 1.49309 4.96912 2.81537 3.58367Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 10.5333C8.72353 10.5333 9.65 9.78261 9.65 8.40927C9.65 7.03594 8.72353 6.28528 8 6.28528C7.27647 6.28528 6.35 7.03594 6.35 8.40927C6.35 9.78261 7.27647 10.5333 8 10.5333ZM8 11.8669C9.65685 11.8669 11 10.3189 11 8.40927C11 6.49966 9.65685 4.95161 8 4.95161C6.34315 4.95161 5 6.49966 5 8.40927C5 10.3189 6.34315 11.8669 8 11.8669Z"
      />
      <path d="M32 8C33.0609 8 34.0783 7.57857 34.8284 6.82843C35.5786 6.07828 36 5.06087 36 4C36 2.93913 35.5786 1.92172 34.8284 1.17157C34.0783 0.421427 33.0609 0 32 0C30.9391 0 29.9217 0.421427 29.1716 1.17157C28.4214 1.92172 28 2.93913 28 4C28 5.06087 28.4214 6.07828 29.1716 6.82843C29.9217 7.57857 30.9391 8 32 8ZM34.6667 4C34.6667 4.70724 34.3857 5.38552 33.8856 5.88562C33.3855 6.38572 32.7072 6.66667 32 6.66667C31.2928 6.66667 30.6145 6.38572 30.1144 5.88562C29.6143 5.38552 29.3333 4.70724 29.3333 4C29.3333 3.29276 29.6143 2.61448 30.1144 2.11438C30.6145 1.61428 31.2928 1.33333 32 1.33333C32.7072 1.33333 33.3855 1.61428 33.8856 2.11438C34.3857 2.61448 34.6667 3.29276 34.6667 4ZM40 14.6667C40 16 38.6667 16 38.6667 16H25.3333C25.3333 16 24 16 24 14.6667C24 13.3333 25.3333 9.33333 32 9.33333C38.6667 9.33333 40 13.3333 40 14.6667ZM38.6667 14.6613C38.6653 14.3333 38.4613 13.3467 37.5573 12.4427C36.688 11.5733 35.052 10.6667 32 10.6667C28.9467 10.6667 27.312 11.5733 26.4427 12.4427C25.5387 13.3467 25.336 14.3333 25.3333 14.6613H38.6667Z" />
      <path d="M52.8696 7.38462C51.9471 7.38462 51.0624 7.06044 50.4101 6.48341C49.7578 5.90637 49.3913 5.12374 49.3913 4.30769V1.84615C49.3913 1.68294 49.4646 1.52642 49.5951 1.41101C49.7255 1.2956 49.9025 1.23077 50.087 1.23077H50.7826C50.9671 1.23077 51.144 1.16593 51.2745 1.05053C51.405 0.93512 51.4783 0.778595 51.4783 0.615385C51.4783 0.452174 51.405 0.295649 51.2745 0.180242C51.144 0.064835 50.9671 0 50.7826 0H50.087C49.5335 0 49.0026 0.194505 48.6113 0.540726C48.2199 0.886947 48 1.35652 48 1.84615V4.30769C48.0009 5.00292 48.1925 5.68756 48.5585 6.30282C48.9244 6.91808 49.4537 7.44558 50.1009 7.84C50.7227 8.32494 51.2269 8.91631 51.5832 9.57841C51.9395 10.2405 52.1405 10.9596 52.1739 11.6923C52.1739 12.8348 52.687 13.9305 53.6002 14.7383C54.5134 15.5462 55.752 16 57.0435 16C58.335 16 59.5736 15.5462 60.4868 14.7383C61.4 13.9305 61.913 12.8348 61.913 11.6923V10.9908C62.5688 10.841 63.1403 10.4848 63.5204 9.98892C63.9005 9.49306 64.0632 8.89158 63.9778 8.29723C63.8925 7.70288 63.565 7.15647 63.0569 6.76042C62.5487 6.36436 61.8947 6.14586 61.2174 6.14586C60.5401 6.14586 59.8861 6.36436 59.3779 6.76042C58.8697 7.15647 58.5423 7.70288 58.457 8.29723C58.3716 8.89158 58.5342 9.49306 58.9144 9.98892C59.2945 10.4848 59.866 10.841 60.5217 10.9908V11.6923C60.5217 12.5084 60.1553 13.291 59.503 13.868C58.8507 14.4451 57.966 14.7692 57.0435 14.7692C56.121 14.7692 55.2363 14.4451 54.584 13.868C53.9317 13.291 53.5652 12.5084 53.5652 11.6923C53.6004 10.9587 53.8035 10.239 54.1623 9.57689C54.521 8.91474 55.0278 8.32385 55.6522 7.84C56.2968 7.44421 56.8234 6.91611 57.1868 6.30094C57.5503 5.68576 57.7398 5.00182 57.7391 4.30769V1.84615C57.7391 1.35652 57.5193 0.886947 57.1279 0.540726C56.7365 0.194505 56.2057 0 55.6522 0H54.9565C54.772 0 54.5951 0.064835 54.4646 0.180242C54.3342 0.295649 54.2609 0.452174 54.2609 0.615385C54.2609 0.778595 54.3342 0.93512 54.4646 1.05053C54.5951 1.16593 54.772 1.23077 54.9565 1.23077H55.6522C55.8367 1.23077 56.0136 1.2956 56.1441 1.41101C56.2745 1.52642 56.3478 1.68294 56.3478 1.84615V4.30769C56.3478 4.71176 56.2579 5.11187 56.0831 5.48518C55.9083 5.85849 55.6521 6.19769 55.3291 6.48341C55.0061 6.76912 54.6226 6.99577 54.2006 7.1504C53.7786 7.30503 53.3263 7.38462 52.8696 7.38462ZM61.2174 9.84615C60.8484 9.84615 60.4945 9.71648 60.2336 9.48567C59.9727 9.25486 59.8261 8.9418 59.8261 8.61539C59.8261 8.28897 59.9727 7.97591 60.2336 7.7451C60.4945 7.51429 60.8484 7.38462 61.2174 7.38462C61.5864 7.38462 61.9403 7.51429 62.2012 7.7451C62.4621 7.97591 62.6087 8.28897 62.6087 8.61539C62.6087 8.9418 62.4621 9.25486 62.2012 9.48567C61.9403 9.71648 61.5864 9.84615 61.2174 9.84615Z" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M85 5.5H75C74.1716 5.5 73.5 6.17157 73.5 7V13C73.5 13.8284 74.1716 14.5 75 14.5H85C85.8284 14.5 86.5 13.8284 86.5 13V7C86.5 6.17157 85.8284 5.5 85 5.5ZM75 4C73.3431 4 72 5.34315 72 7V13C72 14.6569 73.3431 16 75 16H85C86.6569 16 88 14.6569 88 13V7C88 5.34315 86.6569 4 85 4H75Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M77.5 1.5V4H82.5V1.5H77.5ZM77 0C76.4477 0 76 0.447715 76 1V4.5C76 5.05228 76.4477 5.5 77 5.5H83C83.5523 5.5 84 5.05228 84 4.5V1C84 0.447715 83.5523 0 83 0H77Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M80 7C80.4142 7 80.75 7.33579 80.75 7.75L80.75 12.25C80.75 12.6642 80.4142 13 80 13C79.5858 13 79.25 12.6642 79.25 12.25L79.25 7.75C79.25 7.33579 79.5858 7 80 7Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M83 10C83 10.4142 82.6642 10.75 82.25 10.75L77.75 10.75C77.3358 10.75 77 10.4142 77 10C77 9.58579 77.3358 9.25 77.75 9.25L82.25 9.25C82.6642 9.25 83 9.58579 83 10Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M110.365 14.74C110.384 14.6759 110.4 14.5782 110.4 14.4348C110.4 13.825 110.113 12.1839 109.1 10.7397C108.127 9.35387 106.59 8.26 104 8.26C101.41 8.26 99.8727 9.35387 98.9005 10.7397C97.8874 12.1839 97.6 13.825 97.6 14.4348C97.6 14.5782 97.6162 14.6759 97.6346 14.74H110.365ZM110.315 14.8458C110.314 14.8451 110.318 14.8384 110.33 14.8279C110.321 14.8413 110.315 14.8466 110.315 14.8458ZM97.6705 14.8279C97.6822 14.8384 97.6863 14.8451 97.6854 14.8458C97.6846 14.8466 97.6787 14.8413 97.6705 14.8279ZM110.667 16C110.667 16 112 16 112 14.4348C112 12.8696 110.667 7 104 7C97.3333 7 96 12.8696 96 14.4348C96 16 97.3333 16 97.3333 16H110.667Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M104 5.65C104.827 5.65 105.886 4.89015 105.886 3.5C105.886 2.10985 104.827 1.35 104 1.35C103.173 1.35 102.114 2.10985 102.114 3.5C102.114 4.89015 103.173 5.65 104 5.65ZM104 7C105.893 7 107.428 5.433 107.428 3.5C107.428 1.567 105.893 0 104 0C102.106 0 100.571 1.567 100.571 3.5C100.571 5.433 102.106 7 104 7Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M99.8195 9.36391C99.7692 8.68918 99.7619 8.73106 99.8194 8.35815L101.002 7.83427C100.954 8.14237 100.915 8.69157 100.96 9.29877C101.006 9.91083 101.135 10.5412 101.396 11.0364L100.358 11.4555C100.014 10.8022 99.8695 10.0338 99.8195 9.36391Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M108.01 9.58779C107.836 10.2467 107.593 10.8258 107.415 11.1684L106.375 10.7551C106.521 10.472 106.74 9.95598 106.896 9.36305C107.054 8.76538 106.945 8.54072 106.857 8.00073L108 8.50072C108.116 9.21317 108.182 8.93366 108.01 9.58779Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M101.384 12.822C101.697 12.7915 101.923 12.5443 101.888 12.2698C101.854 11.9954 101.571 11.7976 101.257 11.8281C100.944 11.8587 100.718 12.1059 100.753 12.3803C100.787 12.6548 101.07 12.8525 101.384 12.822ZM101.51 13.8159C102.451 13.7244 103.129 12.9827 103.024 12.1594C102.92 11.336 102.072 10.7427 101.131 10.8343C100.19 10.9258 99.512 11.6675 99.6166 12.4908C99.7213 13.3142 100.569 13.9074 101.51 13.8159Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M106.95 11.5328C106.928 11.5309 106.905 11.5289 106.881 11.5269C106.734 11.5142 106.62 11.5046 106.52 11.5023C106.419 11.5001 106.363 11.5062 106.331 11.5131C106.326 11.5143 106.322 11.5153 106.32 11.5161C106.314 11.5241 106.302 11.5431 106.289 11.5804C106.287 11.5883 106.284 11.596 106.281 11.6037C106.075 12.1086 105.883 12.4856 105.729 12.7671C105.694 12.8317 105.663 12.8882 105.635 12.938C105.918 12.989 106.117 13.2196 106.088 13.4765C106.057 13.7513 105.778 13.9522 105.463 13.9252L105.454 13.9245C105.321 13.913 105.193 13.902 105.086 13.8883C104.988 13.8756 104.846 13.8538 104.715 13.7989C104.555 13.7314 104.374 13.5956 104.321 13.365C104.28 13.1882 104.338 13.032 104.369 12.9553C104.413 12.8461 104.498 12.6955 104.588 12.5347C104.624 12.4699 104.662 12.4035 104.697 12.3374C104.837 12.0806 105.012 11.7386 105.2 11.2779C105.264 11.0984 105.366 10.9336 105.52 10.8003C105.681 10.6622 105.867 10.5847 106.05 10.544C106.356 10.4758 106.702 10.5062 106.95 10.528C106.965 10.5293 106.979 10.5305 106.993 10.5317C107.017 10.5337 107.041 10.5357 107.067 10.5378C107.298 10.5565 107.62 10.5825 107.887 10.6963C108.263 10.857 108.474 11.1467 108.573 11.5247C108.663 11.8682 108.759 12.1601 108.842 12.4153C108.848 12.4351 108.855 12.4546 108.861 12.474C108.943 12.7254 109.027 12.9835 109.051 13.1963C109.075 13.406 109.062 13.7681 108.682 13.9896C108.524 14.0816 108.351 14.1162 108.206 14.1295C108.058 14.143 107.9 14.1379 107.738 14.124C107.424 14.097 107.194 13.8524 107.225 13.5776C107.256 13.3027 107.536 13.1018 107.85 13.1288C107.86 13.1297 107.87 13.1305 107.88 13.1313C107.854 13.0362 107.816 12.9128 107.762 12.7484C107.756 12.7287 107.749 12.7085 107.742 12.688C107.659 12.4338 107.556 12.1184 107.459 11.7478C107.435 11.6539 107.409 11.6162 107.4 11.6054L107.4 11.6049C107.396 11.6 107.395 11.5992 107.386 11.5952C107.367 11.5873 107.326 11.5743 107.235 11.5615C107.155 11.5503 107.068 11.5428 106.95 11.5328ZM108.108 13.1322C108.108 13.1322 108.107 13.1323 108.106 13.1325L108.108 13.1322ZM105.441 13.3054C105.44 13.3056 105.441 13.3029 105.443 13.2972C105.442 13.3025 105.441 13.3053 105.441 13.3054Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M128.785 5.73753V9.61632C128.785 10.067 128.47 10.5052 127.998 10.5052C127.526 10.5052 127.21 10.067 127.21 9.61632L127.21 5.73753C127.21 5.28685 127.526 4.84864 127.998 4.84864C128.47 4.84864 128.785 5.28685 128.785 5.73753ZM128.967 11.9865C128.967 12.5562 128.57 13.0909 127.998 13.0909C127.425 13.0909 127.028 12.5562 127.028 11.9865C127.028 11.4168 127.425 10.8822 127.998 10.8822C128.57 10.8822 128.967 11.4168 128.967 11.9865ZM129.81 1.11919L135.784 13.0699C136.457 14.4161 135.478 16 133.973 16H122.027C120.522 16 119.543 14.4161 120.216 13.0699L123.203 7.09456L126.19 1.11919C126.936 -0.373059 129.064 -0.373068 129.81 1.11919ZM128.421 1.81424C128.247 1.46749 127.753 1.46749 127.579 1.81424L121.606 13.765C121.45 14.0778 121.677 14.4458 122.027 14.4458H133.973C134.323 14.4458 134.55 14.0778 134.394 13.765L128.421 1.81424Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M152 14.75C155.728 14.75 158.75 11.7279 158.75 8C158.75 4.27208 155.728 1.25 152 1.25C148.272 1.25 145.25 4.27208 145.25 8C145.25 11.7279 148.272 14.75 152 14.75ZM152 16C156.418 16 160 12.4183 160 8C160 3.58172 156.418 0 152 0C147.582 0 144 3.58172 144 8C144 12.4183 147.582 16 152 16Z"
      />
      <path d="M151.4 4.66667V8.66667C151.4 9.03486 151.669 9.33333 152 9.33333C152.332 9.33333 152.6 9.03486 152.6 8.66667V4.66667C152.6 4.29848 152.332 4 152 4C151.669 4 151.4 4.29848 151.4 4.66667Z" />
      <path d="M151.2 11.1111C151.2 11.602 151.558 12 152 12C152.442 12 152.8 11.602 152.8 11.1111C152.8 10.6202 152.442 10.2222 152 10.2222C151.558 10.2222 151.2 10.6202 151.2 11.1111Z" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M170.931 2.47119V1.83771V1.20422C170.931 0.877408 171.085 0.569217 171.35 0.345642C171.615 0.122598 171.97 0 172.336 0H179.664C179.836 0.000127822 180.004 0.0577059 180.131 0.164897M180.131 0.164897L183.795 3.25384C183.923 3.36144 184 3.5124 184 3.67529V12.3246C184 12.6514 183.846 12.9596 183.581 13.1832C183.316 13.4062 182.961 13.5288 182.595 13.5288H181.069V14.7958C181.069 15.1226 180.915 15.4308 180.65 15.6544C180.385 15.8774 180.03 16 179.664 16H169.405C169.039 16 168.684 15.8774 168.419 15.6544C168.154 15.4308 168 15.1226 168 14.7958V3.67541C168 3.3486 168.154 3.04041 168.419 2.81683C168.684 2.59379 169.039 2.47119 169.405 2.47119H170.931M180.864 5.72508C180.992 5.83268 181.069 5.98359 181.069 6.14648V12.356H182.595C182.617 12.356 182.635 12.3484 182.645 12.3397C182.65 12.3356 182.652 12.3319 182.653 12.3294L182.654 12.3266L182.655 12.3246V3.92492L179.391 1.17285H172.336C172.314 1.17285 172.296 1.18043 172.286 1.18911C172.281 1.19323 172.279 1.19695 172.278 1.19939C172.276 1.20174 172.276 1.20422 172.276 1.20422V2.47119H176.733C176.905 2.47132 177.073 2.5289 177.2 2.63609M177.2 2.63609L180.864 5.72508L177.2 2.63609ZM179.722 14.8006C179.724 14.7983 179.724 14.7958 179.724 14.7958V6.39611L176.46 3.64404H169.405C169.383 3.64404 169.365 3.65162 169.355 3.6603C169.35 3.66442 169.348 3.66814 169.347 3.67058C169.345 3.67293 169.345 3.67541 169.345 3.67541V14.7958C169.345 14.7958 169.345 14.7983 169.347 14.8006C169.348 14.803 169.35 14.8068 169.355 14.8109C169.365 14.8196 169.383 14.8271 169.405 14.8271H179.664C179.686 14.8271 179.704 14.8196 179.714 14.8109C179.719 14.8068 179.721 14.803 179.722 14.8006ZM177.405 9.85339C177.405 10.0164 177.328 10.1674 177.201 10.2751C177.074 10.3823 176.905 10.4398 176.733 10.4398H172.336C172.164 10.4398 171.996 10.3823 171.868 10.2751C171.741 10.1674 171.664 10.0164 171.664 9.85339C171.664 9.69043 171.741 9.53938 171.868 9.43166C171.996 9.32448 172.164 9.26697 172.336 9.26697H176.733C176.905 9.26697 177.074 9.32448 177.201 9.43166C177.328 9.53938 177.405 9.69043 177.405 9.85339ZM177.405 12.3246C177.405 12.4876 177.328 12.6386 177.201 12.7463C177.074 12.8535 176.905 12.911 176.733 12.911H172.336C172.164 12.911 171.996 12.8535 171.868 12.7463C171.741 12.6386 171.664 12.4876 171.664 12.3246C171.664 12.1616 171.741 12.0106 171.868 11.9029C171.996 11.7957 172.164 11.7382 172.336 11.7382H176.733C176.905 11.7382 177.074 11.7957 177.201 11.9029C177.328 12.0106 177.405 12.1616 177.405 12.3246Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M203.517 0C204.712 0.00157194 205.853 0.556401 206.692 1.5347C207.53 2.51242 207.999 3.8345 208 5.21028C208 8.13214 206.146 10.7606 204.276 12.6712C202.403 14.5858 200.491 15.8029 200.332 15.9028C200.231 15.966 200.117 16 200 16C199.883 16 199.769 15.966 199.668 15.9028C199.541 15.8231 196.59 13.9529 194.384 11.1459C194.264 10.993 194.203 10.794 194.21 10.5929C194.218 10.3919 194.293 10.199 194.425 10.0578C194.558 9.91593 194.738 9.83727 194.926 9.8468C195.114 9.85631 195.287 9.95253 195.407 10.106C197.038 12.18 199.183 13.7556 200 14.3169C200.684 13.8464 202.3 12.6652 203.766 11.0766C205.289 9.42762 206.629 7.36181 206.629 5.21053C206.628 4.23688 206.295 3.30657 205.709 2.62298C205.124 1.94 204.335 1.56028 203.516 1.55901C202.205 1.55906 201.1 2.36985 200.637 3.69211C200.587 3.83269 200.502 3.956 200.389 4.04417C200.276 4.13258 200.141 4.18146 200 4.18146C199.859 4.18146 199.724 4.13258 199.611 4.04417C199.498 3.95601 199.413 3.83284 199.364 3.69225C198.9 2.37229 197.795 1.55906 196.484 1.55901C195.665 1.56028 194.876 1.94 194.291 2.62298C193.705 3.30654 193.373 4.23681 193.371 5.21043V5.3524C193.376 5.55295 193.313 5.75044 193.192 5.90135C193.07 6.05323 192.896 6.14706 192.708 6.15393C192.519 6.1608 192.34 6.07964 192.209 5.93613C192.079 5.79325 192.005 5.59944 192 5.39831L192 5.39502L192 5.2104C192.001 3.83462 192.47 2.51242 193.308 1.5347C194.147 0.556401 195.288 0.00157194 196.483 1.10039e-07C197.918 2.12743e-07 199.181 0.690959 200 1.86247C200.819 0.690959 202.082 0 203.517 0Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M197.242 7.8022L196.823 8.42967C196.638 8.70787 196.326 8.87497 195.991 8.87497H193.125C192.711 8.87497 192.375 8.53919 192.375 8.12497C192.375 7.71076 192.711 7.37497 193.125 7.37497H195.724L196.332 6.46268C196.682 5.93762 197.425 5.86406 197.871 6.31028L200.008 8.44774L200.427 7.82027C200.612 7.54207 200.924 7.37497 201.259 7.37497H203.125C203.539 7.37497 203.875 7.71076 203.875 8.12497C203.875 8.53919 203.539 8.87497 203.125 8.87497H201.526L200.918 9.78726C200.568 10.3123 199.825 10.3859 199.379 9.93967L197.242 7.8022Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M217.361 15.1701C217.31 15.3174 217.256 15.4636 217.199 15.6086C217.12 15.8079 217.273 16.0308 217.472 15.9965C217.589 15.9759 217.706 15.9543 217.823 15.9317L217.828 15.9307C217.941 15.9089 218.053 15.8862 218.165 15.8625L218.185 15.8582C218.359 15.8213 218.526 15.7833 218.687 15.7445C218.719 15.7366 218.751 15.7288 218.783 15.7209C220.262 15.3552 221.192 14.9239 221.653 14.6742C222.419 14.893 223.208 15.0032 224 15.0021C228.418 15.0021 232 11.6437 232 7.50103C232 3.35832 228.418 0 224 0C219.582 0 216 3.35832 216 7.50103C216 9.387 216.743 11.1122 217.97 12.4303C217.908 13.038 217.8 13.6389 217.647 14.2269C217.64 14.2535 217.633 14.2801 217.626 14.3067C217.572 14.5109 217.512 14.7135 217.446 14.9142L217.443 14.926C217.417 15.0063 217.39 15.0864 217.362 15.1661L217.361 15.1701ZM219.287 13.8184C220.17 13.5464 220.732 13.2761 221.01 13.1252L221.496 12.8621L222.017 13.0111C222.662 13.1956 223.329 13.2887 223.998 13.2878L224 13.2878C227.881 13.2878 230.5 10.3952 230.5 7.50103C230.5 4.60684 227.881 1.71429 224 1.71429C220.119 1.71429 217.5 4.60684 217.5 7.50103C217.5 8.84682 218.026 10.1381 218.997 11.1812L219.547 11.7714L219.46 12.6276C219.419 13.0277 219.362 13.4251 219.287 13.8184Z"
      />
      <path d="M222.5 7.42857C222.5 7.90196 222.164 8.28572 221.75 8.28572C221.336 8.28572 221 7.90196 221 7.42857C221 6.95518 221.336 6.57143 221.75 6.57143C222.164 6.57143 222.5 6.95518 222.5 7.42857Z" />
      <path d="M225 7.42857C225 7.90196 224.664 8.28572 224.25 8.28572C223.836 8.28572 223.5 7.90196 223.5 7.42857C223.5 6.95518 223.836 6.57143 224.25 6.57143C224.664 6.57143 225 6.95518 225 7.42857Z" />
      <path d="M227.5 7.42857C227.5 7.90196 227.164 8.28572 226.75 8.28572C226.336 8.28572 226 7.90196 226 7.42857C226 6.95518 226.336 6.57143 226.75 6.57143C227.164 6.57143 227.5 6.95518 227.5 7.42857Z" />
    </svg>
  );
};

export default Elements;
