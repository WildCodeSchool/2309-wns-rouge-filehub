import React from 'react';


export default function Header(): React.ReactNode {
    return (
        <header style={headerStyle}>
            <div style={containerStyle}>
                <img src='/Logo-fileHub-v1.png' alt="Logo" style={logoStyle} />
                <div style={linksContainerStyle}>
                    <a href="/moncompte" style={linkStyle}>
                        <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg" stroke="#000000">
                            <g id="SVGRepo_bgCarrier"></g>
                            <g id="SVGRepo_tracerCarrier"></g>
                            <g id="SVGRepo_iconCarrier">
                                <g clip-path="url(#clip0_15_82)">
                                    <rect width="24" height="24" fill="white"></rect>
                                    <g filter="url(#filter0_d_15_82)">
                                        <path
                                            d="M14.3365 12.3466L14.0765 11.9195C13.9082 12.022 13.8158 12.2137 13.8405 12.4092C13.8651 12.6046 14.0022 12.7674 14.1907 12.8249L14.3365 12.3466ZM9.6634 12.3466L9.80923 12.8249C9.99769 12.7674 10.1348 12.6046 10.1595 12.4092C10.1841 12.2137 10.0917 12.022 9.92339 11.9195L9.6634 12.3466ZM4.06161 19.002L3.56544 18.9402L4.06161 19.002ZM19.9383 19.002L20.4345 18.9402L19.9383 19.002ZM16 8.5C16 9.94799 15.2309 11.2168 14.0765 11.9195L14.5965 12.7737C16.0365 11.8971 17 10.3113 17 8.5H16ZM12 4.5C14.2091 4.5 16 6.29086 16 8.5H17C17 5.73858 14.7614 3.5 12 3.5V4.5ZM7.99996 8.5C7.99996 6.29086 9.79082 4.5 12 4.5V3.5C9.23854 3.5 6.99996 5.73858 6.99996 8.5H7.99996ZM9.92339 11.9195C8.76904 11.2168 7.99996 9.948 7.99996 8.5H6.99996C6.99996 10.3113 7.96342 11.8971 9.40342 12.7737L9.92339 11.9195ZM9.51758 11.8683C6.36083 12.8309 3.98356 15.5804 3.56544 18.9402L4.55778 19.0637C4.92638 16.1018 7.02381 13.6742 9.80923 12.8249L9.51758 11.8683ZM3.56544 18.9402C3.45493 19.8282 4.19055 20.5 4.99996 20.5V19.5C4.70481 19.5 4.53188 19.2719 4.55778 19.0637L3.56544 18.9402ZM4.99996 20.5H19V19.5H4.99996V20.5ZM19 20.5C19.8094 20.5 20.545 19.8282 20.4345 18.9402L19.4421 19.0637C19.468 19.2719 19.2951 19.5 19 19.5V20.5ZM20.4345 18.9402C20.0164 15.5804 17.6391 12.8309 14.4823 11.8683L14.1907 12.8249C16.9761 13.6742 19.0735 16.1018 19.4421 19.0637L20.4345 18.9402Z"
                                            fill="#000000">

                                        </path>
                                    </g>
                                </g>
                                <defs>
                                    <filter id="filter0_d_15_82" x="2.55444" y="3.5" width="18.8911" height="19"
                                            filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                        <feColorMatrix in="SourceAlpha" type="matrix"
                                                       values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                       result="hardAlpha">

                                        </feColorMatrix>
                                        <feOffset dy="1"></feOffset>
                                        <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                                        <feColorMatrix type="matrix"
                                                       values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
                                        <feBlend mode="normal" in2="BackgroundImageFix"
                                                 result="effect1_dropShadow_15_82"></feBlend>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_82"
                                                 result="shape"></feBlend>
                                    </filter>
                                    <clipPath id="clip0_15_82">
                                        <rect width="24" height="24" fill="white"></rect>
                                    </clipPath>
                                </defs>
                            </g>
                        </svg>
                        Mon Compte
                    </a>
                    <a href="/mesfichiers" style={linkStyle}>
                        <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier"></g>
                            <g id="SVGRepo_tracerCarrier"></g>
                            <g id="SVGRepo_iconCarrier">
                                <g id="File / Files">
                                    <path id="Vector"
                                          d="M9 6H9.33687C9.58146 6 9.70385 6 9.81893 6.02763C9.92097 6.05213 10.0189 6.09263 10.1084 6.14746C10.2093 6.20928 10.2959 6.29591 10.4688 6.46875L13.5315 9.53149C13.7044 9.70444 13.7904 9.79044 13.8523 9.89135C13.9071 9.98082 13.9482 10.0786 13.9727 10.1807C14 10.2946 14 10.4155 14 10.6552V18M9 6H4.59961C4.03956 6 3.75981 6 3.5459 6.10899C3.35774 6.20487 3.20487 6.35774 3.10899 6.5459C3 6.75981 3 7.04004 3 7.6001V19.4001C3 19.9601 3 20.2398 3.10899 20.4537C3.20487 20.6419 3.35774 20.7952 3.5459 20.8911C3.7596 21 4.03902 21 4.598 21L12.4011 21C12.96 21 13.2405 21 13.4542 20.8911C13.6423 20.7952 13.7948 20.6421 13.8906 20.4539C13.9996 20.24 14 19.9599 14 19.3999V18M9 6V9.4C9 9.96005 9 10.2399 9.10899 10.4538C9.20487 10.642 9.35774 10.7952 9.5459 10.8911C9.7596 11 10.039 11 10.598 11H13.9996M10 6.0001V4.6001C10 4.04005 10 3.75981 10.109 3.5459C10.2049 3.35774 10.3577 3.20487 10.5459 3.10899C10.7598 3 11.0396 3 11.5996 3H16M16 3H16.3369C16.5815 3 16.7038 3 16.8189 3.02763C16.921 3.05213 17.0189 3.09263 17.1084 3.14746C17.2093 3.20928 17.2959 3.29592 17.4688 3.46875L20.5315 6.53149C20.7044 6.70444 20.7904 6.79044 20.8523 6.89135C20.9071 6.98082 20.9482 7.07863 20.9727 7.18066C21 7.29458 21 7.41552 21 7.65515V16.3999C21 16.9599 20.9996 17.24 20.8906 17.4539C20.7948 17.6421 20.6429 17.7952 20.4548 17.8911C20.2411 18 19.961 18 19.402 18H14M16 3V6.4C16 6.96005 16 7.23988 16.109 7.4538C16.2049 7.64196 16.3577 7.79524 16.5459 7.89111C16.7596 8 17.039 8 17.598 8H20.9996"
                                          stroke="#000000" stroke-width="0.504" stroke-linecap="round"
                                          strokeLinejoin="round">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        Mes Fichiers
                    </a>
                </div>
            </div>
        </header>
    );
}

const headerStyle: React.CSSProperties = {
    borderBottom: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
};

const linksContainerStyle: React.CSSProperties = {
    display: 'flex',
};

const linkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
    textDecoration: 'none',
    color: '#777',
    fontSize: '16px',
    transition: 'color 0.3s ease',
};

const logoStyle: React.CSSProperties = {
    width: '120px',
    height: 'auto',
};
