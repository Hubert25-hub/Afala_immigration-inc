
(function(){
  var btn=document.getElementById('menuBtn'), menu=document.getElementById('mobileMenu');
  if(!btn||!menu) return;
  function close(){ menu.classList.remove('open'); btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','Ouvrir le menu'); }
  btn.addEventListener('click',function(){
    var open=menu.classList.toggle('open');
    btn.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
  });
  menu.addEventListener('click',function(e){ if(e.target.closest('a')) close(); });
  window.addEventListener('resize',function(){ if(window.innerWidth>860) close(); });
  
})();


(function(){
  var form=document.getElementById('rdvForm'); if(!form) return;
  var dateInput=document.getElementById('r-date');
  if(dateInput){ dateInput.min=new Date().toISOString().split('T')[0]; }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    function v(id){ var el=document.getElementById(id); return el?el.value.trim():''; }
    var box=document.getElementById('rdvResult');
    var fields=[['Ton nom complet','r-nom'],['Ton téléphone ou WhatsApp','r-tel'],['Service visé','r-prog'],['Date souhaitée','r-date'],['Moment souhaité','r-moment']];
    var missing=[];
    fields.forEach(function(f){ if(!v(f[1])) missing.push(f[0]); });
    if(missing.length){
      box.className='form-result show'; box.style.background='#FDECEC'; box.style.borderColor='#F5B8BA';
      box.innerHTML='<b style="color:#B30F18">Il manque quelques informations :</b> '+missing.join(', ')+'. Complète-les pour envoyer ta demande.';
      box.scrollIntoView({behavior:'smooth',block:'center'}); return;
    }
    var parts=v('r-date').split('-');
    var dateFr=parts.length===3?(parts[2]+'/'+parts[1]+'/'+parts[0]):v('r-date');
    var lines=['Bonjour AFALA IMMIGRATION INC, je souhaite prendre rendez-vous pour une consultation.',
      'Nom : '+v('r-nom'),'Téléphone : '+v('r-tel'),'Service visé : '+v('r-prog'),
      'Date souhaitée : '+dateFr,'Moment souhaité : '+v('r-moment')];
    if(v('r-msg')) lines.push('Message : '+v('r-msg'));
    var url='https://wa.me/15815256184?text='+encodeURIComponent(lines.join('\n'));
    box.className='form-result show'; box.style.background=''; box.style.borderColor='';
    box.innerHTML='<b>Ta demande est prête.</b> Elle s\'ouvre dans WhatsApp, il ne reste qu\'à l\'envoyer. Le cabinet te confirme ton rendez-vous en retour.<p style="margin:10px 0 0"><a class="btn btn-red" target="_blank" rel="noopener" href="'+url+'">Ouvrir WhatsApp</a></p>';
    box.scrollIntoView({behavior:'smooth',block:'center'});
    window.open(url,'_blank');
  });
})();

  (function(){var s=document.getElementById('splash');if(!s)return;
    function fermer(){if(s){s.style.opacity='0';s.style.visibility='hidden';setTimeout(function(){if(s)s.remove()},480);s=null}}
    s.addEventListener('click',fermer);setTimeout(fermer,2100);})();

var LIEN_STRIPE_CONSULTATION = "";
  (function(){
    var f = document.getElementById('parcoursForm');
    if(!f) return;
    var cd = document.getElementById('c-date');
    if(cd){ cd.min = new Date().toISOString().split('T')[0]; }
    function v(id){ var e = document.getElementById(id); return e ? e.value.trim() : ''; }
    function dateFr(val){ var p = val.split('-'); return p.length === 3 ? (p[2] + '/' + p[1] + '/' + p[0]) : val; }
    var box = document.getElementById('parcoursResult');
    function erreur(manquants){
      box.className = 'form-result error';
      box.innerHTML = '<b style="color:#B30F18">' + AFALA_T('Il manque quelques réponses :') + '</b> ' + manquants.map(function(x){ return AFALA_T(x); }).join(', ') + '.';
      box.scrollIntoView({behavior:'smooth', block:'center'});
    }
    var champsTest = [['f-prog','le service visé'],['f-edu',"ton niveau d'études"],['f-lang','les langues que tu parles'],['f-exp','ton expérience de travail'],['f-age','ton âge'],['f-residence','ton pays de résidence actuel'],['f-citoyennete','ton pays de citoyenneté']];
    f.addEventListener('submit', function(ev){
      ev.preventDefault();
      var manquants = [];
      champsTest.forEach(function(c){ if(!v(c[0])) manquants.push(c[1]); });
      [['c-nom','ton nom complet'],['c-tel','ton téléphone ou WhatsApp'],['c-mail','ton courriel'],['c-date','la date souhaitée'],['c-moment','le moment souhaité']].forEach(function(c){ if(!v(c[0])) manquants.push(c[1]); });
      if(manquants.length){ erreur(manquants); return; }
      box.className = 'form-result';
      box.textContent = AFALA_T('Envoi de ton questionnaire et de ta demande au cabinet…');
      var donnees = {
        _subject: 'Parcours complet : admissibilité et consultation, site AFALA',
        'Service visé': v('f-prog'), "Niveau d'études": v('f-edu'), 'Langues parlées': v('f-lang'),
        'Expérience de travail': v('f-exp'), 'Âge': v('f-age'), 'Pays de résidence actuel': v('f-residence'), 'Pays de citoyenneté': v('f-citoyennete'),
        Nom: v('c-nom'), 'Téléphone ou WhatsApp': v('c-tel'), Courriel: v('c-mail'),
        'Date souhaitée': dateFr(v('c-date')), 'Moment souhaité': v('c-moment'),
        Message: v('c-msg') || 'Aucun'
      };
      fetch('https://formsubmit.co/ajax/info@afalaimmigration.ca', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(donnees)
      }).catch(function(){}).finally(function(){
        if(LIEN_STRIPE_CONSULTATION){
          box.textContent = AFALA_T('Tout est envoyé au cabinet. Redirection vers le paiement sécurisé…');
          setTimeout(function(){ window.location.href = LIEN_STRIPE_CONSULTATION; }, 900);
        } else {
          box.className = 'form-result success';
          box.textContent = AFALA_T('Merci, ton questionnaire et ta demande sont envoyés au cabinet. Le cabinet te confirme ton rendez-vous et les modalités de paiement.');
        }
      });
    });
    })();





(function(){
  var t = document.getElementById('marqueeTrack');
  if(!t) return;
  t.innerHTML += t.innerHTML;
})();




(function(){
  function createSlideshow(cfg){
    var slides = cfg.slides, labels = cfg.labels || null, labelEl = cfg.labelEl || null,
        dotsBox = cfg.dotsBox || null, delay = cfg.delay, idx = 0, holdUntil = 0, dots = [];
    if(!slides.length) return;
    function render(){
      slides.forEach(function(s,i){ s.classList.toggle('active', i === idx); });
      if(labelEl && labels) labelEl.textContent = (window.AFALA_T ? window.AFALA_T(labels[idx]) : labels[idx]);
      dots.forEach(function(d,i){ d.classList.toggle('active', i === idx); d.setAttribute('aria-pressed', i === idx ? 'true' : 'false'); });
    }
    function go(n){ idx = (n + slides.length) % slides.length; render(); }
    if(dotsBox){
      slides.forEach(function(s,i){
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Voir la photo : ' + (labels ? labels[i] : ('photo ' + (i + 1))));
        b.addEventListener('click', function(){ holdUntil = 0; go(i); });
        dotsBox.appendChild(b); dots.push(b);
      });
    }
    if(cfg.root){
      
      
      
      
      cfg.root.addEventListener('touchstart', function(){ holdUntil = Infinity; }, {passive:true});
      var release = function(){ holdUntil = Date.now() + 2500; };
      cfg.root.addEventListener('touchend', release, {passive:true});
      cfg.root.addEventListener('touchcancel', release, {passive:true});
      cfg.root.addEventListener('focusin', function(){ holdUntil = Infinity; });
      cfg.root.addEventListener('focusout', function(){ if(holdUntil === Infinity) holdUntil = 0; });
    }
    render();
    if(slides.length > 1){
      setInterval(function(){
        if(Date.now() < holdUntil) return;
        go(idx + 1);
      }, delay);
    }
  }

  (function(){
    var panels = Array.prototype.slice.call(document.querySelectorAll('#heroCard .hc-panel'));
    if(panels.length < 2) return;
    var idx = 0;
    setInterval(function(){
      panels[idx].classList.remove('active');
      idx = (idx + 1) % panels.length;
      panels[idx].classList.add('active');
    }, 6000);
  })();
  createSlideshow({
    root: document.getElementById('heroPhoto'),
    slides: Array.prototype.slice.call(document.querySelectorAll('#heroPhoto .hero-slide')),
    labels: ['Rocheuses · Alberta','Toronto · Ontario','Québec · Québec','Vancouver · Colombie Britannique','Niagara · Ontario','Banff · Alberta'],
    labelEl: document.getElementById('heroBadge'),
    dotsBox: document.getElementById('heroDots'),
    delay: 5000
  });
  createSlideshow({
    root: document.getElementById('photoBreak'),
    slides: Array.prototype.slice.call(document.querySelectorAll('#photoBreak .pb-slide')),
    labels: ['Montréal · Québec','Ottawa · Ontario','Vancouver · Colombie-Britannique'],
    labelEl: document.getElementById('pbLabel'),
    delay: 7000
  });

})();


document.querySelectorAll('.faq-item').forEach(function(item){
  var btn=item.querySelector('.faq-q');
  btn.addEventListener('click',function(){
    var open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(o){o.classList.remove('open');o.querySelector('.faq-q').setAttribute('aria-expanded','false');});
    if(!open){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
  });
});


var toast=document.getElementById('waToast'), toastTimer;
document.querySelectorAll('[data-wa]').forEach(function(el){
  el.addEventListener('click',function(){
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){toast.classList.remove('show');},5200);
  });
});


(function(){
  var DICT = {"Votre projet d’immigration": "Your immigration project", "au Canada est notre priorité": "to Canada is our priority", "Accueil": "Home", "À propos": "About", "Processus": "Process", "Rendez-vous": "Appointment", "Prendre rendez-vous": "Book an appointment", "Titulaire d’un doctorat en océanographie physique de l’Université de Rimouski, mon engagement dans l’intégration des nouveaux arrivants a suscité en moi une passion pour l’immigration. Après une formation solide en immigration à l’Université de Montréal, je suis consultant accrédité, membre du Collège des consultants en immigration et en citoyenneté canadienne.": "I hold a PhD in physical oceanography from the Université de Rimouski, and my commitment to the integration of newcomers sparked in me a passion for immigration. After solid training in immigration at the Université de Montréal, I am an accredited consultant and a member of the College of Immigration and Citizenship Consultants of Canada.",
"Depuis Rimouski, au Québec, j’accompagne des candidats du Canada et de l’international dans leurs démarches d’immigration canadienne, en français ou en anglais. J’offre un service professionnel fondé sur la rigueur, l’honnêteté, la transparence et l’éthique.": "From Rimouski, Quebec, I support candidates from Canada and around the world with their Canadian immigration applications, in French or in English. I offer a professional service founded on rigour, honesty, transparency and ethics.",
"Je comprends les difficultés que vous rencontrez dans vos démarches d’immigration. Avec toutes mes compétences acquises, mon rôle est de clarifier et de sécuriser vos démarches, afin que vous puissiez avancer en toute tranquillité, sans stress et en toute confiance. Avec une analyse approfondie et personnalisée de votre dossier, je suis capable d’anticiper les obstacles et de vous guider avec honnêteté dans un contexte propre à votre réalité.": "I understand the difficulties you face in your immigration process. With all the skills I have acquired, my role is to clarify and secure your process, so that you can move forward with peace of mind, without stress and with complete confidence. With a thorough and personalized analysis of your file, I am able to anticipate obstacles and guide you honestly, in a context shaped by your own reality.",
"Un projet d’immigration est un projet de vie qui mérite du sérieux et de la rigueur. Et c’est avec professionnalisme, rigueur, honnêteté, transparence, respect et humanité que je m’engage à vous accompagner afin de réaliser votre projet canadien. N’hésitez pas à me contacter.": "An immigration project is a life project that deserves seriousness and rigour. And it is with professionalism, rigour, honesty, transparency, respect and humanity that I commit myself to supporting you in making your Canadian project a reality. Please do not hesitate to contact me.",
"Écris-nous ou joins le cabinet directement": "Write to us or reach the firm directly",
"Coordonnées": "Contact details",
"Formulaire de contact": "Contact form",
"Sujet de ton message": "Subject of your message",
"Ton message": "Your message",
"J'accepte que mes données soient traitées de manière confidentielle.": "I agree that my information will be handled confidentially.",
"Envoyer le message": "Send the message",
"Réponse sous 24 à 48 h. Pour une consultation, utilise plutôt la prise de rendez-vous.": "Reply within 24 to 48 hours. For a consultation, please use the appointment booking instead.",
"Prendre rendez-vous en ligne": "Book an appointment online",
"Consultation sur rendez-vous seulement.": "Consultations by appointment only.",
"Accréditation :": "Accreditation:",
"Envoi de ton message au cabinet…": "Sending your message to the firm…",
"Merci ! Ton message est bien envoyé. Le cabinet te répond sous 24 à 48 h.": "Thank you! Your message has been sent. The firm will reply within 24 to 48 hours.",
"L'envoi a échoué. Écris directement à info@afalaimmigration.ca ou appelle le +1 581 525 6184.": "Sending failed. Please email info@afalaimmigration.ca directly or call +1 581 525 6184.",
"Il manque des informations :": "Some information is missing:",
"CABINET D’IMMIGRATION CANADIENNE": "CANADIAN IMMIGRATION FIRM", "Politique de confidentialité": "Privacy Policy", "Rigueur": "Rigour", "Empathie": "Empathy", "Des parcours réels, racontés par les clients du cabinet.": "Real journeys, told by the firm's clients.", "Je tiens à remercier chaleureusement votre cabinet de consultation installé depuis Rimouski pour la qualité de son accompagnement. C'est un vrai plaisir de faire appel à vous !": "I want to warmly thank your consulting firm based in Rimouski for the quality of its support. It is a real pleasure to work with you!", "Bien plus qu’un cabinet d’immigration, c’est la garantie de faire partie d’une famille, une famille qui se souciera de vous et vous accompagnera du début jusqu’à la fin avec courtoisie et respect, je fais partie de cette famille et je vous le recommande à vous aussi. Faire confiance à AFALA c’est la garantie d’être entre de bonnes mains.": "Much more than an immigration firm, it is the guarantee of being part of a family, a family that will care about you and support you from start to finish with courtesy and respect. I am part of this family and I recommend it to you too. Trusting AFALA is the guarantee of being in good hands.", "Je suis sincèrement reconnaissante pour le merveilleux accompagnement que j’ai reçu tout au long de mes démarches pour venir au Canada. J’ai particulièrement apprécié sa bienveillance, sa patience et son suivi personnalisé, toujours accompagné d’explications claires et rassurantes. Une personne humaine, attentionnée et toujours disponible, que je recommande de tout cœur à tout le monde !": "I am sincerely grateful for the wonderful support I received throughout my process to come to Canada. I especially appreciated his kindness, his patience and his personalized follow-up, always with clear and reassuring explanations. A humane, attentive person who is always available, whom I recommend wholeheartedly to everyone!", "Un service très fiable et efficace, qui allie professionnalisme et vraie dimension humaine. Ce cabinet a éclairé toutes mes zones d'ombre avec un enthousiasme plus qu’à la hauteur. Je recommande vivement cette structure pour tout projet d'immigration au Canada, quelle que soit la nature de votre demande. Chaque centime investi s'est vu dans le résultat.": "A very reliable and efficient service that combines professionalism with a real human touch. This firm shed light on all my grey areas with enthusiasm that more than lived up to expectations. I highly recommend this firm for any immigration project to Canada, whatever the nature of your application. Every cent invested showed in the result.", "Honnêtement, je ne regrette pas du tout d'avoir choisi Dr AFALA. Au début j'avais peur, je ne savais pas par où commencer. Mais il m'a tout expliqué, étape par étape, et il m'a accompagné jusqu'à mon arrivée. C'est un consultant sérieux et honnête. Si vous voulez voyager sans stress, allez-y les yeux fermés.": "Honestly, I do not regret choosing Dr AFALA at all. At first I was afraid, I did not know where to start. But he explained everything to me, step by step, and supported me right up to my arrival. He is a serious and honest consultant. If you want to travel without stress, go for it with your eyes closed.", "J’ai personnellement bénéficié des services de ce cabinet pour mes démarches d’immigration au Canada et je peux témoigner de leur sérieux, de leur professionnalisme et de leur accompagnement. Le consultant est à l’écoute, disponible et prend le temps de bien m’orienter tout au long de la procédure. Je suis satisfait de l’accompagnement reçu et je recommande sincèrement ce cabinet à toute personne qui souhaite réaliser son projet d’immigration au Canada en toute confiance. Vous serez entre de bonnes mains !": "I personally used this firm's services for my immigration process to Canada and I can testify to their seriousness, their professionalism and their support. The consultant listens, is available and takes the time to guide me properly throughout the procedure. I am satisfied with the support I received and I sincerely recommend this firm to anyone who wants to carry out their immigration project to Canada with complete confidence. You will be in good hands!", "Cette structure offre un service de qualité, rapide et très fiable quelque soit la situation. Je vous le recommande fortement.": "This firm offers a quality service, fast and very reliable whatever the situation. I strongly recommend it to you.", "Si tu trouves un consultant en immigration qui prend soin de t’indiquer le meilleur choix conformément à ta demande, qui ne t’encombre pas d’informations inutiles et qui te motive à ne pas abandonner ; sache que tu as trouvé le bon. Consultant, nous n’abandonnerons jamais": "If you find an immigration consultant who takes care to point you to the best choice for your request, who does not burden you with useless information and who motivates you not to give up, know that you have found the right one. Consultant, we will never give up.", "J’ai commencé ma procédure avec des inquiétudes et les rumeurs sur l’immigration au Canada mais j’ai fait confiance à AFALA immigration. Aujourd’hui je suis fièrement résident permanent du Canada. Faites comme moi si vous désirez vivre la même expérience.": "I started my process with worries and the rumours about immigration to Canada, but I trusted AFALA Immigration. Today I am proudly a permanent resident of Canada. Do as I did if you want to live the same experience.","Consultant en immigration accrédité · CRIC-CISR n° R1056148": "Accredited immigration consultant · CICC No. R1056148","Vérifiez le statut auprès du Collège des consultants en immigration et en citoyenneté": "Verify Status with the College of Immigration and Citizenship Consultants", "On prend le temps de comprendre ton parcours, tes motivations et tes objectifs. On évalue ton admissibilité réelle, on repère les obstacles possibles et on t’explique clairement les options qui s’offrent à toi.": "We take the time to understand your background, your motivations and your goals. We assess your real eligibility, spot the possible obstacles and clearly explain the options available to you.", "Chaque situation est unique : on analyse ton profil en profondeur et on bâtit un plan d’action sur mesure. Programmes pertinents, risques à prévoir, voie la plus adaptée à ta réalité : tout est défini avant de se lancer.": "Every situation is unique: we analyze your profile in depth and build a tailored action plan. Relevant programs, risks to plan for, the path best suited to your reality: everything is defined before moving forward.", "On rassemble et on vérifie chaque document, on remplit chaque formulaire avec précision et on rédige les lettres avec soin. Ton dossier est ensuite déposé complet, conforme et de façon sécurisée auprès des autorités compétentes.": "We gather and check every document, fill out each form with precision and draft the letters with care. Your case is then filed complete, compliant and securely with the competent authorities.", "Après le dépôt, on reste à tes côtés : on surveille l’évolution de ton dossier, on gère les communications avec IRCC et on t’assiste si des documents supplémentaires sont demandés, jusqu’à la décision finale.": "After filing, we stay by your side: we monitor the progress of your case, handle communications with IRCC and assist you if additional documents are requested, right through to the final decision.", "ton pays de résidence actuel": "your current country of residence", "Visa visiteur": "Visitor visa", "Visiter le Canada pour le tourisme ou pour la famille : on prépare ta demande de visa visiteur, et l’autorisation de voyage électronique (AVE) si tu y as droit.": "Visit Canada for tourism or family: we prepare your visitor visa application, and the electronic travel authorization (eTA) if you are eligible.", "Pour les parents et les grands-parents qui veulent rester plus longtemps auprès de leur famille au Canada : on monte ton dossier de super visa au complet.": "For parents and grandparents who want to stay longer with their family in Canada: we put together your complete super visa application.", "Vivre, travailler et étudier partout au Canada de façon permanente : on identifie la voie qui correspond à ton profil et on monte ton dossier au complet.": "Live, work and study anywhere in Canada permanently: we identify the path that fits your profile and build your complete application.", "Entrée express": "Express Entry", "Le système Entrée express sélectionne les travailleurs qualifiés : on bâtit ton profil et on maximise tes chances d’être sélectionné.": "The Express Entry system selects skilled workers: we build your profile and maximize your chances of being selected.", "Candidats des provinces": "Provincial nominees", "Chaque province choisit ses candidats selon ses besoins : on cible la province qui correspond à ton profil et on prépare ta demande de nomination.": "Each province chooses its candidates based on its needs: we target the province that fits your profile and prepare your nomination application.", "Résidence permanente pour considérations humanitaires": "Permanent residence on humanitarian and compassionate grounds", "Photo du passeport canadien : Jusfiq, Wikimedia Commons (CC BY-SA 4.0).": "Canadian passport photo: Jusfiq, Wikimedia Commons (CC BY-SA 4.0).", "Nous contacter": "Contact us", "Ton avenir au": "Your future in", "commence": "begins", "ici": "here", "Étudier, travailler, visiter ou s'installer au Canada : on monte votre dossier en français ou en anglais, avec un plan clair, de façon rigoureuse et dans la transparence.": "Study, work, visit or settle in Canada: we build your case in French or in English, with a clear plan, rigorously and with full transparency.", "Vérifier mon admissibilité": "Check my eligibility", "Discuter sur WhatsApp": "Chat on WhatsApp", "Réponse sous 24 h": "Reply within 24 hours", "Consultant réglementé CRIC-CISR": "Regulated RCIC consultant", "Rocheuses · Alberta": "Rockies · Alberta", "Un projet, un plan, un dossier solide.": "One project, one plan, one solid case.", "Commence par le test d'admissibilité : 7 questions, 2 minutes, une première lecture honnête de ton profil.": "Start with the eligibility test: 7 questions, 2 minutes, a first honest read of your profile.", "Bienvenue chez AFALA IMMIGRATION INC": "Welcome to AFALA IMMIGRATION INC", "Des services de conseil et d’accompagnement pour réussir ton projet d’immigration au Canada. Explore nos services : il nous fera plaisir de t’accompagner dans la réalisation de ton rêve canadien.": "Advisory and support services to make your Canadian immigration project a success. Explore our services: we will be pleased to support you in making your Canadian dream a reality.", "Découvrir nos services": "Discover our services", "Consultant réglementé en immigration canadienne": "Regulated Canadian immigration consultant", "CRIC-CISR n° R1056148": "CICC No. R1056148", "Dr Tamkpanka Tamtare, consultant réglementé en immigration canadienne. Cabinet basé à Rimouski, dans l’Est du Québec.": "Dr Tamkpanka Tamtare, regulated Canadian immigration consultant. Firm based in Rimouski, in Eastern Quebec.", "Consultation initiale": "Initial consultation", "Des conseils stratégiques pour ton projet : ton profil est analysé en détail et la stratégie de ton dossier est définie avant de passer à l’action.": "Strategic advice for your project: your profile is analyzed in detail and your case strategy is defined before moving into action.", "Réserver ma consultation": "Book my consultation", "Permis d'études": "Study permit", "Visa visiteur": "Visitor visa", "Entrée Express": "Express Entry", "Permis de travail": "Work permit", "Parrainage familial": "Family sponsorship", "Résidence permanente": "Permanent residence", "Qui sommes-nous ?": "Who are we?", "Représentant du cabinet · Consultant en immigration accrédité · CRIC-CISR n° R1056148": "Firm representative · Accredited immigration consultant · CICC No. R1056148", "Dr Tamkpanka Tamtare est consultant en immigration accrédité, membre du Collège des consultants en immigration et en citoyenneté du Canada (CRIC-CISR, n° R1056148). Depuis Rimouski, au Québec, il accompagne des candidats du Canada et de l'international dans leurs démarches d'immigration canadienne, en français ou en anglais.": "Dr Tamkpanka Tamtare is an accredited immigration consultant, a member of the College of Immigration and Citizenship Consultants of Canada (CICC, No. R1056148). From Rimouski, Quebec, he supports applicants from Canada and abroad with their Canadian immigration procedures, in French or English.", "Sa méthode tient en quatre étapes : une consultation initiale pour évaluer ton projet, une analyse et une stratégie adaptées à ton profil, une préparation efficace de ton dossier jusqu'à son dépôt, puis un suivi adéquat jusqu'à la décision.": "His method has four steps: an initial consultation to assess your project, an analysis and a strategy tailored to your profile, efficient preparation of your case through to filing, then proper follow-up through to the decision.", "Rimouski, Québec": "Rimouski, Quebec", "Résidence temporaire et permanente": "Temporary and permanent residence", "Nos services": "Our services", "Choisis le service qui correspond à ton projet : chacun commence par le questionnaire d’admissibilité, suivi d’une consultation approfondie pour vérifier que la voie choisie correspond vraiment à ton profil.": "Choose the service that matches your project: each one starts with the eligibility questionnaire, followed by an in-depth consultation to confirm that the chosen path truly fits your profile.", "Résidence temporaire": "Temporary residence", "Visa visiteur ou touristique": "Visitor or tourist visa", "Demande EIMT": "LMIA application", "Super visa et AVE": "Super visa and eTA", "Tester mon admissibilité →": "Test my eligibility →", "Regroupement familial": "Family reunification", "Parrainage de conjoint, d'enfants ou de parents : réunir ta famille au Canada, dossier par dossier.": "Sponsoring a spouse, children or parents: bringing your family together in Canada, one case at a time.", "Entrée express et candidats des provinces": "Express Entry and provincial nominees", "On bâtit ton profil et on maximise tes chances d'être sélectionné.": "We build your profile and maximize your chances of being selected.", "Demande d'asile": "Asylum claim", "Une demande préparée avec rigueur et présentée avec soin, du dépôt jusqu'à la décision.": "A claim prepared with rigour and presented with care, from filing to the decision.", "Citoyenneté canadienne": "Canadian citizenship", "Vérification de ton admissibilité et préparation complète de ta demande de citoyenneté.": "Verification of your eligibility and complete preparation of your citizenship application.", "Résidence permanente humanitaire": "Humanitarian permanent residence", "Demande de résidence permanente pour considérations humanitaires : un dossier solide, présenté avec soin.": "Permanent residence application on humanitarian and compassionate grounds: a solid case, presented with care.", "Le processus": "The process", "Quatre étapes, zéro zone floue": "Four steps, zero grey areas", "Tu sais toujours où en est ton dossier et quelle est la prochaine étape. C'est la transparence qui fait la différence.": "You always know where your case stands and what the next step is. That transparency makes all the difference.", "On écoute ton projet et on évalue ton admissibilité réelle, sans promesses magiques.": "We listen to your project and assess your real eligibility, with no magic promises.", "Analyse et stratégie": "Analysis and strategy", "Analyse complète de ton profil et choix de la stratégie la mieux adaptée à ton dossier.": "A complete analysis of your profile and the choice of the strategy best suited to your case.", "Préparation et dépôt du dossier": "Case preparation and filing", "Préparation efficace de chaque pièce, vérification complète, puis dépôt auprès des autorités.": "Efficient preparation of every document, a complete review, then filing with the authorities.", "Suivi et décision": "Follow-up and decision", "Suivi adéquat de ton dossier jusqu'à la décision, et accompagnement après la réponse.": "Proper follow-up on your case through to the decision, and support after the answer.", "Des Rocheuses à Montréal, ton histoire commence par un dossier.": "From the Rockies to Montreal, your story starts with a case.", "Montréal · Québec": "Montreal · Quebec", "Ottawa · Ontario": "Ottawa · Ontario", "Vancouver · Colombie-Britannique": "Vancouver · British Columbia", "Admissibilité et prise de rendez-vous": "Eligibility and appointment booking", "Deux étapes,": "Two steps,", "un seul formulaire": "one single form", "Réponds aux 7 questions d’admissibilité, puis réserve ta consultation dans la foulée. Le cabinet reçoit tout en même temps : ton questionnaire et ta demande de rendez-vous, et il te confirme après le paiement.": "Answer the 7 eligibility questions, then book your consultation right away. The firm receives everything at once: your questionnaire and your appointment request, and confirms with you after payment.", "Questionnaires et prise de rendez-vous reçus ensemble par le cabinet": "Questionnaires and appointment booking received together by the firm", "Paiement en ligne sécurisé par Stripe": "Secure online payment by Stripe", "Réponse d'AFALA IMMIGRATION INC sous 24 h ouvrables": "Reply from AFALA IMMIGRATION INC within 24 business hours", "Téléphone": "Phone", "Téléphone et WhatsApp": "Phone and WhatsApp", "WhatsApp uniquement (Togo)": "WhatsApp only (Togo)", "Courriel": "Email", "Cabinet": "Office", "Heures": "Hours", "Lundi au samedi · 9 h à 18 h": "Monday to Saturday · 9 a.m. to 6 p.m.", "Commence ton parcours": "Start your journey", "Étape 1 : ton admissibilité · Étape 2 : ta prise de rendez-vous": "Step 1: your eligibility · Step 2: booking your appointment", "Étape 1 · Ton admissibilité": "Step 1 · Your eligibility", "1 · Quel service vises-tu ?": "1 · Which service are you targeting?", "Choisir…": "Choose…", "Regroupement et parrainage familial": "Family reunification and sponsorship", "Je ne sais pas encore": "I don't know yet", "2 · Ton niveau d'études le plus élevé": "2 · Your highest level of education", "Secondaire / Baccalauréat": "Secondary / High school diploma", "Formation professionnelle / BTS": "Vocational training / Technical diploma", "Licence (Bac+3)": "Bachelor's degree", "Master ou plus": "Master's degree or higher", "3 · Quelles langues parles-tu ?": "3 · Which languages do you speak?", "Français seulement": "French only", "Anglais seulement": "English only", "Français et anglais": "French and English", "Autre langue": "Another language", "4 · Ton expérience de travail": "4 · Your work experience", "Aucune pour le moment": "None yet", "Moins d'un an": "Less than one year", "1 à 3 ans": "1 to 3 years", "Plus de 3 ans": "More than 3 years", "5 · Ton âge": "5 · Your age", "6 · Ton pays de résidence actuel": "6 · Your current country of residence", "7 · Ton pays de citoyenneté": "7 · Your country of citizenship", "ton pays de résidence": "your country of residence", "ton pays de citoyenneté": "your country of citizenship", "18 à 25 ans": "18 to 25", "26 à 32 ans": "26 to 32", "33 à 40 ans": "33 to 40", "41 ans et plus": "41 and over", "Étape 2 · Ta prise de rendez-vous": "Step 2 · Booking your appointment", "Ton nom complet": "Your full name", "Ton téléphone ou WhatsApp": "Your phone or WhatsApp", "Ton courriel": "Your email", "Date souhaitée": "Preferred date", "Moment souhaité": "Preferred time", "Matin (9 h à 12 h)": "Morning (9 a.m. to 12 p.m.)", "Après-midi (12 h à 15 h)": "Afternoon (12 p.m. to 3 p.m.)", "Fin de journée (15 h à 18 h)": "Late afternoon (3 p.m. to 6 p.m.)", "Ton message (optionnel)": "Your message (optional)", "Envoyer et passer au paiement": "Submit and proceed to payment", "Paiement sécurisé par Stripe. Le cabinet reçoit ton questionnaire et ta demande, puis te confirme ton rendez-vous après le paiement.": "Secure payment by Stripe. The firm receives your questionnaire and your request, then confirms your appointment after payment.", "Témoignages": "Testimonials", "Ce que disent les clients": "What clients say", "Cette section accueillera uniquement les avis réels fournis par AFALA IMMIGRATION INC. Les trois emplacements ci-dessous montrent la mise en page finale.": "This section will feature only real reviews provided by AFALA IMMIGRATION INC. The three slots below show the final layout.", "Exemple, à remplacer": "Example, to be replaced", "[Témoignage réel du client à insérer ici, texte court fourni par AFALA IMMIGRATION INC, par exemple sur un permis d'études obtenu.]": "[Real client testimonial to insert here, a short text provided by AFALA IMMIGRATION INC, for example about an approved study permit.]", "[Prénom · Service · Pays]": "[First name · Service · Country]", "[Témoignage réel du client à insérer ici, texte court fourni par AFALA IMMIGRATION INC, par exemple sur un parrainage familial.]": "[Real client testimonial to insert here, a short text provided by AFALA IMMIGRATION INC, for example about a family sponsorship.]", "[Témoignage réel du client à insérer ici, texte court fourni par AFALA IMMIGRATION INC, par exemple sur une résidence permanente.]": "[Real client testimonial to insert here, a short text provided by AFALA IMMIGRATION INC, for example about a permanent residence.]", "Questions fréquentes": "Frequently asked questions", "Avant de te lancer": "Before you start", "Combien de temps prend le traitement de mon dossier ?": "How long does it take to process my case?", "Les délais varient selon le service et le pays de dépôt : quelques semaines pour un visa visiteur, plusieurs mois pour une résidence permanente. Dès la consultation, AFALA IMMIGRATION INC te donne l'estimation réaliste pour ton dossier, et te tient informé à chaque étape.": "Processing times vary by service and by the country where you file: a few weeks for a visitor visa, several months for permanent residence. Right at the consultation, AFALA IMMIGRATION INC gives you a realistic estimate for your case, and keeps you informed at every step.", "Quels documents dois-je préparer ?": "Which documents do I need to prepare?", "La base est presque toujours la même : passeport valide, diplômes et relevés, preuves d'expérience de travail, preuves de fonds et tests de langue selon le service. Après le test d'admissibilité, tu reçois la liste exacte pour ton cas, rien de plus, rien de moins.": "The basics are almost always the same: a valid passport, diplomas and transcripts, proof of work experience, proof of funds and language tests depending on the service. After the eligibility test, you receive the exact list for your situation, nothing more, nothing less.", "Combien coûte l'accompagnement ?": "How much does the support cost?", "Le questionnaire d’admissibilité se remplit directement sur le site, dans le même formulaire que la réservation de ta consultation. La consultation approfondie est payante et dure 1 h : le cabinet te confirme le tarif avant de commencer, sans surprise. Le tarif de l’accompagnement dépend ensuite du service choisi et de la complexité du dossier. Les frais gouvernementaux restent distincts et payés directement aux autorités.": "The eligibility questionnaire is completed right on this site, in the same form as your consultation booking. The in-depth consultation is paid and lasts 1 hour: the firm confirms the fee before you start, with no surprises. The support fee then depends on the chosen service and the complexity of the case. Government fees remain separate and are paid directly to the authorities.", "Et si ma demande est refusée ?": "What if my application is refused?", "Un refus n'est pas toujours une fin. On analyse d'abord les motifs officiels du refus, puis les options : nouvelle demande renforcée, demande de réexamen ou un autre service mieux adapté à ton profil. C'est exactement pour réduire ce risque que le dossier est vérifié pièce par pièce avant le dépôt.": "A refusal is not always the end. We first analyze the official reasons for the refusal, then the options: a stronger new application, a request for reconsideration, or another service better suited to your profile. Reducing that risk is exactly why every document is checked one by one before filing.", "Des conseils stratégiques": "Strategic advice", "Reçois des conseils d’experts pour ton immigration au Canada, adaptés à ta situation et à ton budget. Tout commence par le questionnaire d’admissibilité, rempli sur le site dans le même formulaire que ta réservation. La consultation approfondie vient ensuite : ton profil est analysé en détail, tes questions reçoivent des réponses claires, et la stratégie de ton dossier est définie avant de passer à l’action.": "Receive expert advice for your immigration to Canada, tailored to your situation and your budget. It all starts with the eligibility questionnaire, completed on this site in the same form as your booking. The in-depth consultation comes next: your profile is analyzed in detail, your questions get clear answers, and your case strategy is defined before moving into action.", "Consultation approfondie": "In-depth consultation", "Prêt à lancer ton dossier ?": "Ready to start your case?", "Fais le test d'admissibilité, réserve ta consultation, ou parle directement à AFALA IMMIGRATION INC sur WhatsApp.": "Take the eligibility test, book your consultation, or talk directly with AFALA IMMIGRATION INC on WhatsApp.", "Faire le test d’admissibilité": "Take the eligibility test", "AFALA IMMIGRATION INC, cabinet de services d'immigration canadienne basé à Rimouski, au Québec. Consultant réglementé, membre CRIC-CISR n° R1056148.": "AFALA IMMIGRATION INC, a Canadian immigration services firm based in Rimouski, Quebec. Regulated consultant, CICC member No. R1056148.", "Test d'admissibilité": "Eligibility test", "Téléphone : +1 418 509 8246": "Phone: +1 418 509 8246", "Téléphone et WhatsApp : +1 581 525 6184": "Phone and WhatsApp: +1 581 525 6184", "WhatsApp (Togo) : +228 91 50 99 54": "WhatsApp (Togo): +228 91 50 99 54", "Courriel :": "Email:", "Lun à Sam · 9 h à 18 h": "Mon to Sat · 9 a.m. to 6 p.m.", "© 2026 AFALA IMMIGRATION INC · Tous droits réservés.": "© 2026 AFALA IMMIGRATION INC · All rights reserved.", "+1 418 509 8246 (appels seulement) · +1 581 525 6184 (appel et WhatsApp) · +228 91 50 99 54 (WhatsApp uniquement).": "+1 418 509 8246 (calls only) · +1 581 525 6184 (calls and WhatsApp) · +228 91 50 99 54 (WhatsApp only).", "Québec · Québec": "Quebec City · Quebec", "Vancouver · Colombie Britannique": "Vancouver · British Columbia", "Il manque quelques réponses :": "A few answers are missing:", "le service visé": "the service you are targeting", "ton niveau d'études": "your level of education", "les langues que tu parles": "the languages you speak", "ton expérience de travail": "your work experience", "ton âge": "your age", "ton nom complet": "your full name", "ton téléphone ou WhatsApp": "your phone or WhatsApp", "ton courriel": "your email", "la date souhaitée": "your preferred date", "le moment souhaité": "your preferred time", "Envoi de ton questionnaire et de ta demande au cabinet…": "Sending your questionnaire and your request to the firm…", "Tout est envoyé au cabinet. Redirection vers le paiement sécurisé…": "Everything is sent to the firm. Redirecting you to secure payment…", "Merci, ton questionnaire et ta demande sont envoyés au cabinet. Le cabinet te confirme ton rendez-vous et les modalités de paiement.": "Thank you, your questionnaire and your request have been sent to the firm. The firm will confirm your appointment and the payment details.", "Autres services": "Other services", "Pour étudier dans un établissement canadien : de l'admission à l'obtention du permis, on prépare ton dossier au complet.": "To study at a Canadian institution: from admission to the permit itself, we prepare your complete file.", "Visiter le Canada pour le tourisme, la famille ou les affaires, avec un dossier complet et bien présenté.": "Visit Canada for tourism, family or business, with a complete and well presented application.", "Travailler au Canada en toute légalité : un permis lié à un employeur ou à ton profil, selon ta situation.": "Work in Canada legally: a permit tied to an employer or to your profile, depending on your situation.", "Tu es employeur et tu recrutes un travailleur étranger : on prépare ta demande d'étude d'impact sur le marché du travail.": "You are an employer hiring a foreign worker: we prepare your Labour Market Impact Assessment application.", "Le super visa pour les parents et les grands-parents qui visitent leur famille, et l'autorisation de voyage électronique pour les voyageurs admissibles.": "The super visa for parents and grandparents visiting their family, and the electronic travel authorization for eligible travellers.", "Visa visiteur, super visa et AVE": "Visitor visa, super visa and eTA", "Visiter le Canada pour le tourisme ou pour la famille : le visa visiteur pour les séjours, le super visa pour les parents et les grands-parents, et l'autorisation de voyage électronique pour les voyageurs admissibles.": "Visit Canada for tourism or for family: the visitor visa for stays, the super visa for parents and grandparents, and the electronic travel authorization for eligible travellers.", "La consultation dure 1 h.": "The consultation lasts 1 hour.", "Payante · 1 h.": "Paid · 1 hour.", "Le tarif t’est confirmé par le cabinet avant le rendez-vous, sans surprise.": "The fee is confirmed by the firm before the appointment, with no surprises.", "Accompagnement en français ou en anglais": "Support in French or English"};
  var PH = {"Prénom et nom": "First and last name", "Ex. : Canada": "E.g.: Canada", "Ex. : Togo": "E.g.: Togo", "Numéro où te joindre": "Number where we can reach you", "Adresse courriel": "Email address", "Décris ton projet en quelques mots": "Describe your project in a few words"};
  var TITRES = {fr: "AFALA IMMIGRATION INC · Immigration au Canada", en: "AFALA IMMIGRATION INC · Canadian Immigration"};
  var SALUT_FR = "Bonjour%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20vos%20services%20d%27immigration.";
  var SALUT_EN = "Hello%2C%20I%20would%20like%20information%20about%20your%20immigration%20services.";
  var lang = "fr";
  try { lang = localStorage.getItem("afala-lang") || "fr"; } catch(e){}
  if (location.hash.indexOf("lang=en") > -1) lang = "en";
  if (location.hash.indexOf("lang=fr") > -1) lang = "fr";
  window.AFALA_LANG = lang;
  window.AFALA_T = function(s){ return (window.AFALA_LANG === "en" && DICT[s]) ? DICT[s] : s; };
  var paires = [], pairesPH = [];
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var n;
  while (n = w.nextNode()){
    var brut = n.nodeValue, coeur = brut.trim();
    if (coeur && DICT[coeur]) paires.push([n, brut, coeur]);
  }
  document.querySelectorAll("[placeholder]").forEach(function(el){
    var p = el.getAttribute("placeholder");
    if (PH[p]) pairesPH.push([el, p]);
  });
  function appliquer(l){
    window.AFALA_LANG = l;
    paires.forEach(function(p){
      p[0].nodeValue = (l === "en") ? p[1].split(p[2]).join(DICT[p[2]]) : p[1];
    });
    pairesPH.forEach(function(p){
      p[0].setAttribute("placeholder", l === "en" ? PH[p[1]] : p[1]);
    });
    document.title = TITRES[l];
    document.documentElement.setAttribute("lang", l);
    document.querySelectorAll("[data-lang]").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-lang") === l);
    });
    if (SALUT_FR){
      document.querySelectorAll('a[href*="wa.me"]').forEach(function(a){
        var orig = a.getAttribute("data-href-fr");
        if (!orig){ orig = a.getAttribute("href"); a.setAttribute("data-href-fr", orig); }
        a.setAttribute("href", l === "en" ? orig.split(SALUT_FR).join(SALUT_EN) : orig);
      });
    }
    try { localStorage.setItem("afala-lang", l); } catch(e){}
  }
  document.querySelectorAll("[data-lang]").forEach(function(b){
    b.addEventListener("click", function(){ appliquer(b.getAttribute("data-lang")); });
  });
  appliquer(lang);
})();

document.addEventListener('DOMContentLoaded', function(){
  var LANG = (window.AFALA_LANG === 'en' || localStorage.getItem('afala-lang') === 'en') ? 'en' : 'fr';
  var T = {
    fr: {
      sub: "Réponses générales, puis le cabinet si nécessaire",
      placeholder: "Écris ta question...",
      note: "Informations générales seulement. Aucune réponse ne remplace une consultation professionnelle.",
      greeting: "Bonjour ! Je peux répondre à tes questions générales sur les services d'AFALA et les démarches d'immigration canadienne. Pour une analyse personnalisée de ton profil, la consultation avec le cabinet reste la meilleure porte d'entrée.",
      chips: ["Nos services", "Prendre rendez-vous", "La consultation", "Nous contacter"],
      fallback: "Je ne peux pas répondre avec certitude à cette question. Écris-nous à info@afalaimmigration.ca ou passe par le formulaire de consultation, le cabinet te répondra directement.",
      answers: {
        services: "AFALA accompagne 12 services : permis d'études, visa visiteur, super visa, permis de travail, demande EIMT, résidence permanente, Entrée express, candidats des provinces, regroupement familial, demande d'asile, résidence permanente pour considérations humanitaires et citoyenneté canadienne.\nDis-moi ton projet, je te dirige vers le bon service.",
        etudes: "Le permis d'études permet d'étudier dans un établissement canadien. Le cabinet prépare ton dossier au complet, de l'admission à l'obtention du permis.\nTu peux commencer par le test d'admissibilité sur le site, section Admissibilité et prise de rendez-vous.",
        visiteur: "Le visa visiteur sert pour le tourisme ou pour visiter ta famille au Canada. Si tu es un voyageur admissible, l'autorisation de voyage électronique (AVE) peut suffire. Le cabinet prépare ta demande au complet.",
        supervisa: "Le super visa permet aux parents et aux grands-parents de rester plus longtemps auprès de leur famille au Canada. Le cabinet monte le dossier au complet.",
        travail: "Le permis de travail permet de travailler légalement au Canada, lié à un employeur ou à ton profil selon ta situation. Le cabinet vérifie la voie qui correspond à ton cas.",
        eimt: "La demande EIMT (étude d'impact sur le marché du travail) concerne les employeurs qui recrutent un travailleur étranger. Le cabinet prépare la demande pour l'employeur.",
        residence: "La résidence permanente permet de vivre, travailler et étudier partout au Canada de façon permanente. Les voies principales sont Entrée express, les candidats des provinces et le regroupement familial. Le cabinet identifie celle qui correspond à ton profil.",
        express: "Entrée express sélectionne les travailleurs qualifiés pour la résidence permanente. Le cabinet bâtit ton profil et maximise tes chances d'être sélectionné.",
        provinces: "Chaque province choisit ses candidats selon ses besoins. Le cabinet cible la province qui correspond à ton profil et prépare ta demande de nomination.",
        famille: "Le regroupement familial permet de réunir conjoint, enfants ou parents au Canada, par le parrainage. Le cabinet monte le dossier au complet, étape par étape.",
        asile: "La demande d'asile est préparée avec rigueur et présentée avec soin, du dépôt jusqu'à la décision. Vu la sensibilité de ces dossiers, une consultation est fortement recommandée.",
        citoyennete: "Pour la citoyenneté canadienne, le cabinet vérifie ton admissibilité et prépare ta demande au complet.",
        humanitaire: "La résidence permanente pour considérations humanitaires vise les situations exceptionnelles. Le cabinet monte un dossier solide, présenté avec soin. Une consultation est recommandée pour évaluer ton cas.",
        consultation: "La consultation approfondie est payante et dure 1 h. Le tarif t'est confirmé par le cabinet avant le rendez-vous, sans surprise.\nPour réserver : remplis le formulaire dans la section Admissibilité et prise de rendez-vous du site (7 questions, puis ta prise de rendez-vous).",
        prix: "Les tarifs dépendent du service choisi et de la complexité de ton dossier, le cabinet te les confirme clairement avant de commencer. La consultation approfondie est payante et dure 1 h. Les frais gouvernementaux restent séparés et payés directement aux autorités.",
        delais: "Les délais varient selon le service et le pays de dépôt : quelques semaines pour un visa visiteur, plusieurs mois pour une résidence permanente. Dès la consultation, le cabinet te donne l'estimation réaliste pour ton dossier.",
        documents: "La base est presque toujours la même : passeport valide, diplômes et relevés, preuves d'expérience de travail, preuves de fonds et tests de langue selon le service. Après le test d'admissibilité, tu reçois la liste exacte pour ton cas.",
        contact: "Pour joindre le cabinet :\nTéléphone : +1 418 509 8246 (appels seulement)\nTéléphone et WhatsApp : +1 581 525 6184\nWhatsApp (Togo) : +228 91 50 99 54\nCourriel : info@afalaimmigration.ca\nHoraires : lundi au samedi, 9 h à 18 h.",
        adresse: "Le cabinet est basé à Rimouski, au Québec : 317-308 Rue du Bourgeois, Rimouski, QC G5L 7P9, Canada. Les dossiers sont accompagnés à distance partout au Canada et à l'international.",
        langues: "L'accompagnement se fait en français ou en anglais, selon ta préférence.",
        refus: "Un refus n'est pas toujours une fin. Le cabinet analyse d'abord les motifs officiels du refus, puis les options : nouvelle demande renforcée, demande de réexamen ou un autre service mieux adapté à ton profil.",
        merci: "Avec plaisir ! Si tu veux aller plus loin, le test d'admissibilité et la consultation sont la prochaine étape. Bonne chance dans ton projet !"
      }
    },
    en: {
      sub: "General answers first, then the firm if needed",
      placeholder: "Type your question...",
      note: "General information only. No answer replaces a professional consultation.",
      greeting: "Hello! I can answer your general questions about AFALA's services and Canadian immigration procedures. For a personalized analysis of your profile, a consultation with the firm is the best first step.",
      chips: ["Our services", "Book an appointment", "The consultation", "Contact us"],
      fallback: "I cannot answer this question with certainty. Write to us at info@afalaimmigration.ca or use the consultation form, the firm will reply to you directly.",
      answers: {
        services: "AFALA supports 12 services: study permit, visitor visa, super visa, work permit, LMIA application, permanent residence, Express Entry, provincial nominees, family reunification, asylum claim, permanent residence on humanitarian and compassionate grounds, and Canadian citizenship.\nTell me about your project and I will point you to the right service.",
        etudes: "A study permit lets you study at a Canadian institution. The firm prepares your complete application, from admission to the permit itself.\nYou can start with the eligibility test on this site, in the Eligibility and appointment booking section.",
        visiteur: "A visitor visa is for tourism or visiting family in Canada. If you are an eligible traveller, an electronic travel authorization (eTA) may be enough. The firm prepares your complete application.",
        supervisa: "The super visa lets parents and grandparents stay longer with their family in Canada. The firm puts together the complete application.",
        travail: "A work permit lets you work legally in Canada, tied to an employer or to your profile depending on your situation. The firm checks which path fits your case.",
        eimt: "The LMIA application is for employers hiring a foreign worker. The firm prepares the application for the employer.",
        residence: "Permanent residence lets you live, work and study anywhere in Canada permanently. The main paths are Express Entry, provincial nominees and family reunification. The firm identifies the one that fits your profile.",
        express: "Express Entry selects skilled workers for permanent residence. The firm builds your profile and maximizes your chances of being selected.",
        provinces: "Each province chooses its candidates based on its needs. The firm targets the province that fits your profile and prepares your nomination application.",
        famille: "Family reunification brings a spouse, children or parents to Canada through sponsorship. The firm builds the complete case, step by step.",
        asile: "An asylum claim is prepared with rigour and presented with care, from filing to the decision. Given how sensitive these cases are, a consultation is strongly recommended.",
        citoyennete: "For Canadian citizenship, the firm verifies your eligibility and prepares your complete application.",
        humanitaire: "Permanent residence on humanitarian and compassionate grounds covers exceptional situations. The firm builds a solid case, presented with care. A consultation is recommended to assess your situation.",
        consultation: "The in-depth consultation is paid and lasts 1 hour. The fee is confirmed by the firm before the appointment, with no surprises.\nTo book: fill out the form in the Eligibility and appointment booking section of this site (7 questions, then your booking).",
        prix: "Fees depend on the chosen service and the complexity of your case, and the firm confirms them clearly before starting. The in-depth consultation is paid and lasts 1 hour. Government fees remain separate and are paid directly to the authorities.",
        delais: "Processing times vary by service and by the country where you file: a few weeks for a visitor visa, several months for permanent residence. Right at the consultation, the firm gives you a realistic estimate for your case.",
        documents: "The basics are almost always the same: a valid passport, diplomas and transcripts, proof of work experience, proof of funds and language tests depending on the service. After the eligibility test, you receive the exact list for your situation.",
        contact: "To reach the firm:\nPhone: +1 418 509 8246 (calls only)\nPhone and WhatsApp: +1 581 525 6184\nWhatsApp (Togo): +228 91 50 99 54\nEmail: info@afalaimmigration.ca\nHours: Monday to Saturday, 9 a.m. to 6 p.m.",
        adresse: "The firm is based in Rimouski, Quebec: 317-308 Rue du Bourgeois, Rimouski, QC G5L 7P9, Canada. Cases are supported remotely across Canada and internationally.",
        langues: "Support is offered in French or English, whichever you prefer.",
        refus: "A refusal is not always the end. The firm first analyzes the official reasons for the refusal, then the options: a stronger new application, a request for reconsideration, or another service better suited to your profile.",
        merci: "You're welcome! If you want to go further, the eligibility test and the consultation are the next step. Good luck with your project!"
      }
    }
  };
  var KEYS = [
    ["consultation", ["consultation", "rendez-vous", "rendez vous", "rdv", "appointment", "booking", "book"]],
    ["prix", ["prix", "cout", "tarif", "combien", "frais", "honoraire", "price", "cost", "fee", "fees", "how much"]],
    ["contact", ["contact", "joindre", "telephone", "appeler", "courriel", "email", "whatsapp", "numero", "reach", "phone", "call"]],
    ["services", ["service", "services", "offre", "programme", "program", "offer"]],
    ["etudes", ["etudes", "etude", "etudiant", "universite", "college", "ecole", "study", "student", "school"]],
    ["supervisa", ["super visa", "supervisa", "grands-parents", "grandparents"]],
    ["visiteur", ["visiteur", "visite", "tourisme", "tourist", "visitor", "visit", "ave", "eta"]],
    ["eimt", ["eimt", "lmia", "employeur", "recrute", "employer", "hiring"]],
    ["travail", ["travail", "travailler", "emploi", "job", "work"]],
    ["express", ["express", "crs", "tirage", "draw"]],
    ["provinces", ["province", "provinces", "provincial", "pnp", "nomination", "nominee"]],
    ["residence", ["residence permanente", "permanent residence", "installer", "immigrer", "settle"]],
    ["famille", ["famille", "regroupement", "parrainage", "conjoint", "epouse", "epoux", "family", "sponsor", "spouse", "reunification"]],
    ["asile", ["asile", "refugie", "asylum", "refugee"]],
    ["citoyennete", ["citoyennete", "citoyen", "citizenship", "citizen", "passeport", "passport"]],
    ["humanitaire", ["humanitaire", "humanitarian", "compassionate"]],
    ["delais", ["delai", "temps", "duree", "long", "time", "long", "delay", "processing"]],
    ["documents", ["document", "documents", "papier", "piece", "prepare"]],
    ["adresse", ["adresse", "situe", "rimouski", "bureau", "address", "located", "office", "where"]],
    ["langues", ["langue", "anglais", "francais", "english", "french", "language"]],
    ["refus", ["refus", "refuse", "rejet", "refused", "refusal", "denied"]],
    ["merci", ["merci", "thanks", "thank"]]
  ];
  var CHIP_ACTIONS = {
    "Nos services": "services", "Our services": "services",
    "Prendre rendez-vous": "consultation", "Book an appointment": "consultation",
    "La consultation": "consultation", "The consultation": "consultation",
    "Nous contacter": "contact", "Contact us": "contact"
  };
  var t = T[LANG];
  var panel = document.getElementById('afalaChatPanel');
  var msgs = document.getElementById('afalaChatMsgs');
  var chipsBox = document.getElementById('afalaChatChips');
  var input = document.getElementById('afalaChatInput');
  var started = false;
  document.getElementById('afalaChatSub').textContent = t.sub;
  document.getElementById('afalaChatNote').textContent = t.note;
  input.setAttribute('placeholder', t.placeholder);
  function norm(x){ return ' ' + x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ') + ' '; }
  function addMsg(text, who){
    var d = document.createElement('div');
    d.className = 'afala-msg ' + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function answerFor(q){
    var n = norm(q), best = null, bestScore = 0;
    for (var i = 0; i < KEYS.length; i++){
      var score = 0;
      for (var j = 0; j < KEYS[i][1].length; j++){
        var k = ' ' + KEYS[i][1][j].normalize('NFD').replace(/[\u0300-\u036f]/g, '') + ' ';
        if (n.indexOf(k) > -1) score += (KEYS[i][1][j].indexOf(' ') > -1 ? 3 : 1);
      }
      if (score > bestScore){ bestScore = score; best = KEYS[i][0]; }
    }
    if (best) return t.answers[best];
    if (/bonjour|salut|hello|bonsoir|hi/.test(n)) return t.greeting;
    return t.fallback;
  }
  function showChips(){
    chipsBox.innerHTML = '';
    t.chips.forEach(function(label){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'afala-chip'; b.textContent = label;
      b.addEventListener('click', function(){
        addMsg(label, 'user');
        var key = CHIP_ACTIONS[label];
        setTimeout(function(){ addMsg(t.answers[key], 'bot'); }, 250);
      });
      chipsBox.appendChild(b);
    });
  }
  function openPanel(){
    panel.classList.add('open');
    if (!started){ started = true; addMsg(t.greeting, 'bot'); showChips(); }
    setTimeout(function(){ input.focus(); }, 60);
  }
  document.getElementById('afalaChatBtn').addEventListener('click', function(){
    panel.classList.contains('open') ? panel.classList.remove('open') : openPanel();
  });
  document.getElementById('afalaChatClose').addEventListener('click', function(){ panel.classList.remove('open'); });
  document.getElementById('afalaChatForm').addEventListener('submit', function(e){
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    addMsg(q, 'user');
    input.value = '';
    setTimeout(function(){ addMsg(answerFor(q), 'bot'); }, 300);
  });
});


(function(){
  var form = document.getElementById('contactForm');
  if(!form) return;
  var result = document.getElementById('contactResult');
  function T(x){ return window.AFALA_T ? window.AFALA_T(x) : x; }
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    var champs = [
      {el: document.getElementById('k-nom'), nom: 'Nom'},
      {el: document.getElementById('k-tel'), nom: 'Téléphone'},
      {el: document.getElementById('k-mail'), nom: 'Courriel'},
      {el: document.getElementById('k-msg'), nom: 'Message'}
    ];
    var consent = document.getElementById('k-consent');
    var manquants = [];
    champs.forEach(function(c){
      var ok = c.el.value.trim() !== '';
      if(c.el.type === 'email' && ok && c.el.value.indexOf('@') < 0) ok = false;
      c.el.style.borderColor = ok ? '' : '#E11B22';
      if(!ok) manquants.push(c.nom);
    });
    if(!consent.checked) manquants.push('Consentement');
    if(manquants.length){
      result.textContent = T('Il manque des informations :') + ' ' + manquants.join(', ') + '.';
      var premier = form.querySelector('[required]');
      if(premier) premier.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    result.textContent = T('Envoi de ton message au cabinet…');
    var payload = {
      _subject: 'Nouveau message : formulaire de contact du site AFALA',
      _template: 'table',
      'Nom': document.getElementById('k-nom').value.trim(),
      'Téléphone': document.getElementById('k-tel').value.trim(),
      'Courriel': document.getElementById('k-mail').value.trim(),
      'Sujet': document.getElementById('k-sujet').value.trim(),
      'Message': document.getElementById('k-msg').value.trim()
    };
    fetch('https://formsubmit.co/ajax/info@afalaimmigration.ca', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(payload)
    }).then(function(r){
      if(!r.ok) throw new Error('send');
      result.textContent = T('Merci ! Ton message est bien envoyé. Le cabinet te répond sous 24 à 48 h.');
      form.reset();
    }).catch(function(){
      result.textContent = T("L'envoi a échoué. Écris directement à info@afalaimmigration.ca ou appelle le +1 581 525 6184.");
    });
  });
})();

/* Carrousel des témoignages */
(function(){
  var box = document.getElementById('tCarousel');
  if(!box) return;
  var slides = Array.prototype.slice.call(box.querySelectorAll('.testi'));
  var dotsBox = document.querySelector('.t-dots');
  var prev = box.querySelector('.t-prev'), next = box.querySelector('.t-next');
  var i = 0, timer = null, DELAY = 6500;
  var dots = slides.map(function(_, k){
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Témoignage ' + (k + 1));
    b.addEventListener('click', function(){ go(k); restart(); });
    if(dotsBox) dotsBox.appendChild(b);
    return b;
  });
  function go(n){
    slides[i].classList.remove('is-active');
    if(dots[i]) dots[i].classList.remove('is-on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    if(dots[i]) dots[i].classList.add('is-on');
  }
  function play(){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function(){ if(!document.hidden) go(i + 1); }, DELAY);
  }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }
  function restart(){ stop(); play(); }
  if(prev) prev.addEventListener('click', function(){ go(i - 1); restart(); });
  if(next) next.addEventListener('click', function(){ go(i + 1); restart(); });
  box.addEventListener('mouseenter', stop);
  box.addEventListener('mouseleave', play);
  var tx = null;
  box.addEventListener('touchstart', function(e){ tx = e.changedTouches[0].clientX; }, {passive:true});
  box.addEventListener('touchend', function(e){
    if(tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if(Math.abs(dx) > 42){ go(dx < 0 ? i + 1 : i - 1); restart(); }
    tx = null;
  }, {passive:true});
  go(0); play();
})();

