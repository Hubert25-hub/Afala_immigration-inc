/* Écran d'ouverture : ne l'afficher qu'une fois par session */
try{if(sessionStorage.getItem('afala-ouverture')){document.documentElement.classList.add('no-splash')}else{sessionStorage.setItem('afala-ouverture','1')}}catch(e){}
