import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer-area">
        <div className="copyright-area">
          <p>
            Future Visions{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-c-circle"
              viewBox="0 0 16 16"
            >
              <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM8.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512Z" />
            </svg>{" "}
            2023 Tous droits réservés
          </p>
          <p>
            Made with{" "}
            <svg
              viewBox="0 0 1792 1792"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              height="0.8rem"
            >
              <path
                d="M896 1664q-26 0-44-18l-624-602q-10-8-27.5-26T145 952.5 77 855 23.5 734 0 596q0-220 127-344t351-124q62 0 126.5 21.5t120 58T820 276t76 68q36-36 76-68t95.5-68.5 120-58T1314 128q224 0 351 124t127 344q0 221-229 450l-623 600q-18 18-44 18z"
                fill="#e25555"
              />
            </svg>{" "}
            Rania Lakoud
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;
