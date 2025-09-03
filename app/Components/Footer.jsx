import React from 'react';
// import Logo from './Logo';

const Footer = () => {
    return (
      <footer className="footer mt-10 footer-horizonta 
       footer-center bg-sky-700 text-primary-content p-10">
  <aside>
    
 {/* <Logo></Logo> */}

    <p className="font-bold">
   The  <span className='text-red-700 font-bold text-3xl italic'> 
     R</span> oyel Global Solutions Ltd.
      <br />
      Providing reliable tech since 2024
    </p>
    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
  </aside>
  <nav>
    <p className='font-bold '>Contacts with us</p>

    <div className="grid grid-flow-col gap-4">

      <a 
  href="https://t.me/itisroyel528" 
  target="_blank" 
  rel="noopener noreferrer"
  class="inline-flex  items-center gap-2"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 24 24">
    <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12c0-6.628-5.372-12-12-12zm5.574 8.83l-1.748 8.25c-.133.63-.48.78-.97.486l-2.68-1.976-1.293 1.247c-.143.143-.263.263-.54.263l.194-2.73 4.96-4.48c.215-.194-.047-.303-.332-.11l-6.123 3.84-2.64-.825c-.573-.18-.583-.573.12-.84l10.327-3.988c.48-.18.9.113.746.828z"/>
  </svg>

</a>

      <a 
  href="https://wa.me/8801907226353" 
  target="_blank" 
  rel="noopener noreferrer"
  class="inline-flex  items-center gap-2"
>
 
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#25D366" viewBox="0 0 24 24">
    <path d="M20.52 3.48a11.71 11.71 0 0 0-16.55 0 11.83 11.83 0 0 0-3.28 8.27 11.79 11.79 0 0 0 2.1 6.12L0 24l6.24-1.64a11.83 11.83 0 0 0 6.14 1.58h.03c3.1 0 6.03-1.21 8.27-3.28a11.7 11.7 0 0 0 0-16.56zm-8.52 17.36h-.02a9.1 9.1 0 0 1-4.6-1.26l-.33-.2-3.7.97.99-3.6-.21-.36a9.09 9.09 0 0 1 1.33-11.73 9.15 9.15 0 0 1 12.91 0 9.09 9.09 0 0 1 0 12.91 9.1 9.1 0 0 1-6.07 2.28zm5.37-7.6c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.19.29-.73.95-.9 1.15-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.19-.29.28-.48.09-.19.05-.36-.03-.51-.08-.15-.65-1.56-.89-2.13-.23-.56-.47-.48-.65-.49l-.56-.01c-.19 0-.5.07-.76.36s-1 1-1 2.43 1.03 2.82 1.18 3.02c.15.19 2.05 3.15 4.97 4.41.69.3 1.23.48 1.65.61.69.21 1.32.18 1.82.11.56-.08 1.72-.7 1.96-1.38.24-.69.24-1.28.17-1.38-.07-.1-.27-.16-.56-.31z"/>
  </svg>

 
</a>

      <a 
        href="https://x.com/royel528" 
  target="_blank" 
  rel="noopener noreferrer"
  class="inline-flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
        </svg>
      </a>
      <a 
        href="https://www.youtube.com/@RS-Midea"
  target="_blank"
  rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
        </svg>
      </a>
    <a
  href="https://www.facebook.com/profile.php?id=100085936730814"
  target="_blank"
  rel="noopener noreferrer"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="fill-current"
  >
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
  </svg>
</a>

    </div>
  </nav>
</footer>
    );
};

export default Footer;